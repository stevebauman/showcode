import url from 'url';
import https from 'https';

const zip = require('@zip.js/zip.js/dist/zip-full');

export default function () {
    const MARKETPLACE_BASE_URL = 'https://marketplace.visualstudio.com';
    const MARKETPLACE_EXTENSION_ENDPOINT = '/_apis/public/gallery/extensionquery';
    const GITHUB_PROPERTY_KEY = 'Microsoft.VisualStudio.Services.Links.GitHub';
    const PACKAGE_FILE_KEY = 'Microsoft.VisualStudio.Services.VSIXPackage';

    /**
     * Fetch themes from the VSCode Marketplace for the provided page.
     *
     * @param {Number} page
     *
     * @return {Promise}
     */
    async function getExtensions(page) {
        const extensions = [];

        const url = `${MARKETPLACE_BASE_URL}${MARKETPLACE_EXTENSION_ENDPOINT}`;

        const query = {
            filters: [
                {
                    criteria: [
                        // Not sure what this does and doesn't affect results.
                        { filterType: 8, value: 'Microsoft.VisualStudio.Code' },
                        // Not sure what this does and doesn't affect results.
                        { filterType: 10, value: 'target:"Microsoft.VisualStudio.Code"' },
                        // Not sure what this does but does filter out records.
                        { filterType: 12, value: '5122' },
                        { filterType: 5, value: 'Themes' },
                    ],
                    direction: 2, // Not sure what this does.
                    pageSize: 100,
                    pageNumber: page,
                    sortBy: 4, // Sorts by most downloads.
                    sortOrder: 0,
                },
            ],
            flags: 914, // Settings flags to 914 will return the github link.
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json;api-version=3.0-preview.1',
                'Content-Type': 'application/json',
                // node-fetch sets user-agent header if not provided, causing bad
                // requests from the marketplace api.
                'User-Agent': '',
            },
            body: JSON.stringify(query),
        });

        if (!response.ok) {
            throw new Error(`getExtensions error: Bad response ${response.statusText}`);
        }

        try {
            const data = await response.json();

            data.results[0].extensions.forEach((extension) => {
                // Sort by the lastUpdatedAt (ISO string) to get the latest version.
                const latestVersion = extension.versions.sort((a, b) =>
                    b.lastUpdated.localeCompare(a.lastUpdated)
                )[0];
                // Find the property the contains extension's repository url.
                const repoUrlProp = latestVersion.properties.find(
                    (prop) => prop.key === GITHUB_PROPERTY_KEY
                );
                // Get the extensions package url.
                const packageUrlProp = latestVersion.files.find(
                    (prop) => prop.assetType === PACKAGE_FILE_KEY
                );

                if (packageUrlProp) {
                    extensions.push({
                        extensionId: extension.extensionId,
                        extensionName: extension.extensionName,
                        publisherName: extension.publisher.publisherName,
                        lastUpdated: +new Date(extension.lastUpdated),
                        publishedDate: +new Date(extension.publishedDate),
                        releaseDate: +new Date(extension.releaseDate),
                        displayName: extension.displayName,
                        shortDescription: extension.shortDescription,
                        packageUrl: packageUrlProp.source,
                        repositoryUrl: repoUrlProp ? repoUrlProp.value : null,
                        installs:
                            extractStatistic(extension, 'install') +
                            extractStatistic(extension, 'updateCount'),
                        rating: extractStatistic(extension, 'averagerating'),
                        ratingCount: extractStatistic(extension, 'ratingcount'),
                        trendingDaily: extractStatistic(extension, 'trendingdaily'),
                        trendingWeekly: extractStatistic(extension, 'trendingmonthly'),
                        trendingMonthly: extractStatistic(extension, 'trendingweekly'),
                    });
                } else {
                    // Skip themes without github url.
                    console.log(
                        `Missing property '${PACKAGE_FILE_KEY}': \n${JSON.stringify(extension)}\n`
                    );
                }
            });
        } catch (err) {
            console.error(err);
            throw new Error('getExtensions error: Invalid response data');
        }

        if (!extensions) {
            throw new Error('getExtensions error: Invalid extensions');
        }

        return extensions;
    }

    /**
     * @param {String} url
     * @param {String} encoding
     *
     * @returns {Promise}
     */
    async function download(url) {
        return fetch(url).then((response) => response.blob());
    }

    /**
     * @param {String} url
     *
     * @returns {Promise}
     */
    async function getThemes(url) {
        const baseUrl = url.replace('.git', '') + '/blob/master/';

        const packageJsonUrl = convertGHURLToDownloadURL(baseUrl + 'package.json');

        return fetch(packageJsonUrl)
            .then((response) => response.json())
            .then(({ contributes }) =>
                (contributes?.themes ?? []).map(({ label, path }) => ({
                    label: label,
                    path: convertGHURLToDownloadURL(baseUrl + path.replace('./', '')),
                }))
            );
    }

    /**
     *
     * @param {String} url
     */
    async function downloadExtension(url) {
        let content;

        try {
            content = await download(url);
        } catch (e) {
            console.log(e);
            throw Error(`Failed`);
        }

        const reader = new zip.ZipReader(new zip.BlobReader(content));

        const entries = await reader.getEntries();

        if (entries.length) {
            // get first entry content as text by using a TextWriter
            const text = await entries[0].getData(
                // writer
                new zip.TextWriter(),
                // options
                {
                    onprogress: (index, max) => {
                        // onprogress callback
                    },
                }
            );
            // text contains the entry data as a String
            console.log(text);
        }

        // close the ZipReader
        await reader.close();

        // const zipPath = `tmp/${extId}.zip`;
        // fs.writeFileSync(zipPath, content);

        // const zip = fs.createReadStream(zipPath).pipe(unzipper.Parse({ forceStream: true }));

        // for await (const entry of zip) {
        //     const match = fPaths.filter(([_name, fPath]) => {
        //         return entry.path === fPath;
        //     });

        //     if (match.length > 0) {
        //         const fName =
        //             typeof match[0] === 'string' ? entry.path.split('/').pop() : match[0][0];

        //         entry.pipe(fs.createWriteStream(`tmp/theme/${fName}`));
        //     } else {
        //         entry.autodrain();
        //     }
        // }
    }

    function convertGHURLToDownloadURL(ghURL) {
        const oldPath = url.parse(ghURL).path;
        return 'https://raw.githubusercontent.com' + oldPath.replace('/blob/', '/');
    }

    function extractStatistic(theme, name) {
        const stat = theme.statistics.find((s) => s.statisticName === name);
        if (!stat) {
            return 0;
        }
        return stat.value;
    }

    return { getThemes, getExtensions, downloadExtension };
}
