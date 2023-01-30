import fs from 'fs';
import path from 'path';
import { BUNDLED_THEMES, BUNDLED_LANGUAGES } from '@stevebauman/shiki';

console.log('Publishing Shiki assets...');

const shikiPublishPath = path.join(__dirname, '/../static/shiki');
const shikiNodePath = path.join(__dirname, '/../node_modules/@stevebauman/shiki');

console.log('Copying onig.wasm...');

fs.copyFileSync(
    path.join(shikiNodePath, '/dist/onig.wasm'),
    path.join(shikiPublishPath, '/dist/onig.wasm')
);

console.log('Copying languages...');

copyDir(path.join(shikiNodePath, 'languages'), path.join(shikiPublishPath, 'languages'));

console.log('Copying themes...');

copyDir(path.join(shikiNodePath, 'themes'), path.join(shikiPublishPath, 'themes'));

console.log('Generating "all" theme and language files...');

fs.writeFileSync(path.join(shikiPublishPath, 'themes', 'all.json'), JSON.stringify(BUNDLED_THEMES));

fs.writeFileSync(
    path.join(shikiPublishPath, 'languages', 'all.json'),
    JSON.stringify(BUNDLED_LANGUAGES)
);

function copyDir(source: string, dest: string) {
    for (let file of fs.readdirSync(source)) {
        let from = path.join(source, file);
        let to = path.join(dest, file);

        console.log(`Copying [${from}] to [${to}]...`);

        fs.copyFileSync(from, to);
    }
}
