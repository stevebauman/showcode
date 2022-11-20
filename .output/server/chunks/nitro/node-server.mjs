globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { eventHandler, setHeaders, sendRedirect, defineEventHandler, handleCacheHeaders, createEvent, getRequestHeader, getRequestHeaders, setResponseHeader, createError, getQuery, getCookie, createApp, createRouter as createRouter$1, lazyEventHandler, toNodeListener } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase, kebabCase, pascalCase, camelCase } from 'scule';
import { hash } from 'ohash';
import { parseURL, withQuery, joinURL, withLeadingSlash, withoutTrailingSlash, isRelative } from 'ufo';
import { createStorage, prefixStorage } from 'unstorage';
import overlay from 'unstorage/drivers/overlay';
import memory$1 from 'unstorage/drivers/memory';
import defu from 'defu';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, join } from 'pathe';
import { unified } from 'unified';
import { toString } from 'mdast-util-to-string';
import { preprocess } from 'micromark/lib/preprocess.js';
import { postprocess } from 'micromark/lib/postprocess.js';
import { stringifyPosition } from 'unist-util-stringify-position';
import { markdownLineEnding, markdownSpace } from 'micromark-util-character';
import { push, splice } from 'micromark-util-chunked';
import { resolveAll } from 'micromark-util-resolve-all';
import remarkEmoji from 'remark-emoji';
import rehypeSlug from 'rehype-slug';
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';
import rehypeSortAttributeValues from 'rehype-sort-attribute-values';
import rehypeSortAttributes from 'rehype-sort-attributes';
import rehypeRaw from 'rehype-raw';
import remarkMDC, { parseFrontMatter } from 'remark-mdc';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import { all } from 'mdast-util-to-hast';
import { detab } from 'detab';
import { u } from 'unist-builder';
import { encode } from 'mdurl';
import slugify from 'slugify';
import { position } from 'unist-util-position';
import htmlTags from 'html-tags';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routeRules":{"/__nuxt_error":{"cache":false}},"envPrefix":"NUXT_"},"public":{"content":{"clientDB":{"isSPA":false,"integrity":1668968345428},"navigation":{"fields":[]},"base":"_content","tags":{"p":"prose-p","a":"prose-a","blockquote":"prose-blockquote","code-inline":"prose-code-inline","code":"prose-code","em":"prose-em","h1":"prose-h1","h2":"prose-h2","h3":"prose-h3","h4":"prose-h4","h5":"prose-h5","h6":"prose-h6","hr":"prose-hr","img":"prose-img","ul":"prose-ul","ol":"prose-ol","li":"prose-li","strong":"prose-strong","table":"prose-table","thead":"prose-thead","tbody":"prose-tbody","td":"prose-td","th":"prose-th","tr":"prose-tr"},"highlight":false,"wsUrl":"","documentDriven":false,"anchorLinks":{"depth":4,"exclude":[1]}}},"content":{"cacheVersion":2,"cacheIntegrity":"MbmUQftgKb","transformers":[],"base":"_content","watch":{"ws":{"port":4000,"hostname":"localhost","showURL":false}},"sources":{},"ignores":["\\.","-"],"locales":[],"highlight":false,"markdown":{"tags":{"p":"prose-p","a":"prose-a","blockquote":"prose-blockquote","code-inline":"prose-code-inline","code":"prose-code","em":"prose-em","h1":"prose-h1","h2":"prose-h2","h3":"prose-h3","h4":"prose-h4","h5":"prose-h5","h6":"prose-h6","hr":"prose-hr","img":"prose-img","ul":"prose-ul","ol":"prose-ol","li":"prose-li","strong":"prose-strong","table":"prose-table","thead":"prose-thead","tbody":"prose-tbody","td":"prose-td","th":"prose-th","tr":"prose-tr"},"anchorLinks":{"depth":4,"exclude":[1]},"prism":{"theme":false},"remarkPlugins":{},"rehypePlugins":{}},"yaml":{},"csv":{"delimeter":",","json":true},"navigation":{"fields":[]},"documentDriven":false,"experimental":{"clientDB":false}}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
};
function isObject$1(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject$1(obj[key])) {
      if (isObject$1(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config$1 = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config$1;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
const timingMiddleware = eventHandler((event) => {
  const start = globalTiming.start();
  const _end = event.res.end;
  event.res.end = function(chunk, encoding, cb) {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!event.res.headersSent) {
      event.res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(event.res, chunk, encoding, cb);
    return this;
  }.bind(event.res);
});

const _assets = {
  ["nitro:bundled:cache:content:content-index.json"]: {
    import: () => import('../raw/content-index.mjs').then(r => r.default || r),
    meta: {"type":"application/json","etag":"\"3f-avJwW4IuPwcudzLA/prV6PTz1H0\"","mtime":"2022-11-20T18:20:03.888Z"}
  },
  ["nitro:bundled:cache:content:content-navigation.json"]: {
    import: () => import('../raw/content-navigation.mjs').then(r => r.default || r),
    meta: {"type":"application/json","etag":"\"4d-pdC4FmZeR5lpc+F8qr8aUViQ7cc\"","mtime":"2022-11-20T18:20:03.888Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:changelog.md"]: {
    import: () => import('../raw/changelog.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"8517-gBuQL4Ub7mKaqOvzyn+F62f+33E\"","mtime":"2022-11-20T18:20:03.888Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:help.md"]: {
    import: () => import('../raw/help.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"1b0d-ddkYs3EuWJPBywLKa1jTPxLy0wE\"","mtime":"2022-11-20T18:20:03.888Z"}
  }
};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const bundledStorage = ["/cache/content"];
for (const base of bundledStorage) {
  storage.mount(base, overlay({
    layers: [
      memory$1(),
      // TODO
      // prefixStorage(storage, base),
      prefixStorage(storage, 'assets:nitro:bundled:' + base)
    ]
  }));
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(createRouter({ routes: config.nitro.routeRules }));
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(event, routeRules.redirect.to, routeRules.redirect.statusCode);
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(path);
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      if (!pending[key]) {
        entry.value = void 0;
        entry.integrity = void 0;
        entry.mtime = void 0;
        entry.expires = void 0;
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      entry.mtime = Date.now();
      entry.integrity = integrity;
      delete pending[key];
      if (validate(entry)) {
        useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return Promise.resolve(entry);
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const key = (opts.getKey || getKey)(...args);
    const entry = await get(key, () => fn(...args));
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length ? hash(args, {}) : "";
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: (event) => {
      const url = event.req.originalUrl || event.req.url;
      const friendlyName = decodeURI(parseURL(url).pathname).replace(/[^a-zA-Z0-9]/g, "").substring(0, 16);
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [
      opts.integrity,
      handler
    ]
  };
  const _cachedHandler = cachedFunction(async (incomingEvent) => {
    const reqProxy = cloneWithProxy(incomingEvent.req, { headers: {} });
    const resHeaders = {};
    let _resSendBody;
    const resProxy = cloneWithProxy(incomingEvent.res, {
      statusCode: 200,
      getHeader(name) {
        return resHeaders[name];
      },
      setHeader(name, value) {
        resHeaders[name] = value;
        return this;
      },
      getHeaderNames() {
        return Object.keys(resHeaders);
      },
      hasHeader(name) {
        return name in resHeaders;
      },
      removeHeader(name) {
        delete resHeaders[name];
      },
      getHeaders() {
        return resHeaders;
      },
      end(chunk, arg2, arg3) {
        if (typeof chunk === "string") {
          _resSendBody = chunk;
        }
        if (typeof arg2 === "function") {
          arg2();
        }
        if (typeof arg3 === "function") {
          arg3();
        }
        return this;
      },
      write(chunk, arg2, arg3) {
        if (typeof chunk === "string") {
          _resSendBody = chunk;
        }
        if (typeof arg2 === "function") {
          arg2();
        }
        if (typeof arg3 === "function") {
          arg3();
        }
        return this;
      },
      writeHead(statusCode, headers2) {
        this.statusCode = statusCode;
        if (headers2) {
          for (const header in headers2) {
            this.setHeader(header, headers2[header]);
          }
        }
        return this;
      }
    });
    const event = createEvent(reqProxy, resProxy);
    event.context = incomingEvent.context;
    const body = await handler(event) || _resSendBody;
    const headers = event.res.getHeaders();
    headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
    headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || new Date().toUTCString();
    const cacheControl = [];
    if (opts.swr) {
      if (opts.maxAge) {
        cacheControl.push(`s-maxage=${opts.maxAge}`);
      }
      if (opts.staleMaxAge) {
        cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
      } else {
        cacheControl.push("stale-while-revalidate");
      }
    } else if (opts.maxAge) {
      cacheControl.push(`max-age=${opts.maxAge}`);
    }
    if (cacheControl.length) {
      headers["cache-control"] = cacheControl.join(", ");
    }
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.res.headersSent || event.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.res.statusCode = response.code;
    for (const name in response.headers) {
      event.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const plugins = [
  
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = process.cwd();
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  event.node.res.statusCode = errorObject.statusCode !== 200 && errorObject.statusCode || 500;
  if (errorObject.statusMessage) {
    event.node.res.statusMessage = errorObject.statusMessage;
  }
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.node.res.setHeader("Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    event.node.res.setHeader("Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  if (res.status && res.status !== 200) {
    event.node.res.statusCode = res.status;
  }
  if (res.statusText) {
    event.node.res.statusMessage = res.statusText;
  }
  event.node.res.end(await res.text());
});

const assets = {
  "/_nuxt/Alert.91a45c5d.js": {
    "type": "application/javascript",
    "etag": "\"3f6-VyTXJpWqiYY6XrEOcyR86o99R0w\"",
    "mtime": "2022-11-20T18:20:02.340Z",
    "size": 1014,
    "path": "../public/_nuxt/Alert.91a45c5d.js"
  },
  "/_nuxt/ButtonBackground.d45b0cd6.js": {
    "type": "application/javascript",
    "etag": "\"383-hgwoecyfPOZppwCitAshmZR8cQ8\"",
    "mtime": "2022-11-20T18:20:02.339Z",
    "size": 899,
    "path": "../public/_nuxt/ButtonBackground.d45b0cd6.js"
  },
  "/_nuxt/ButtonColorPicker.fe203c0d.js": {
    "type": "application/javascript",
    "etag": "\"84c3-CN/B75yEK01pVp4Gl2O31OJ/6mQ\"",
    "mtime": "2022-11-20T18:20:02.338Z",
    "size": 33987,
    "path": "../public/_nuxt/ButtonColorPicker.fe203c0d.js"
  },
  "/_nuxt/ButtonLock.e6a22eea.js": {
    "type": "application/javascript",
    "etag": "\"1f5-c2JsASC15JqEKGjuW7ADfpiX8rU\"",
    "mtime": "2022-11-20T18:20:02.338Z",
    "size": 501,
    "path": "../public/_nuxt/ButtonLock.e6a22eea.js"
  },
  "/_nuxt/ButtonPlaceholder.ef07643f.js": {
    "type": "application/javascript",
    "etag": "\"1a2-jmfNP0YGXfto2A0r7EpmfyqZgZ0\"",
    "mtime": "2022-11-20T18:20:02.337Z",
    "size": 418,
    "path": "../public/_nuxt/ButtonPlaceholder.ef07643f.js"
  },
  "/_nuxt/ButtonResize.f71c70b2.js": {
    "type": "application/javascript",
    "etag": "\"1b0-Ctrzaj27DHDyNfdL+KmUlP8mgPM\"",
    "mtime": "2022-11-20T18:20:02.336Z",
    "size": 432,
    "path": "../public/_nuxt/ButtonResize.f71c70b2.js"
  },
  "/_nuxt/ButtonSettings.3b47bf61.js": {
    "type": "application/javascript",
    "etag": "\"163-78vlXgZPK0HgJOFSpcokf1xCPFk\"",
    "mtime": "2022-11-20T18:20:02.336Z",
    "size": 355,
    "path": "../public/_nuxt/ButtonSettings.3b47bf61.js"
  },
  "/_nuxt/ButtonTheme.cf7e4c82.js": {
    "type": "application/javascript",
    "etag": "\"a56-zqd1rrn+gZuM+1NKqNLHGMO+NGM\"",
    "mtime": "2022-11-20T18:20:02.335Z",
    "size": 2646,
    "path": "../public/_nuxt/ButtonTheme.cf7e4c82.js"
  },
  "/_nuxt/Canvas.092bd435.js": {
    "type": "application/javascript",
    "etag": "\"d66-ptzFfDgsfTz5ctHgTtZ4TsnMrEI\"",
    "mtime": "2022-11-20T18:20:02.335Z",
    "size": 3430,
    "path": "../public/_nuxt/Canvas.092bd435.js"
  },
  "/_nuxt/Code.5ae399b1.js": {
    "type": "application/javascript",
    "etag": "\"41c-dGk/gU1bHT+N+ORrJyHhEH1LZyk\"",
    "mtime": "2022-11-20T18:20:02.334Z",
    "size": 1052,
    "path": "../public/_nuxt/Code.5ae399b1.js"
  },
  "/_nuxt/CodeLine.11de981f.js": {
    "type": "application/javascript",
    "etag": "\"8d2-fciNf7Hwh/DoPtU/TY9deDQ67rw\"",
    "mtime": "2022-11-20T18:20:02.333Z",
    "size": 2258,
    "path": "../public/_nuxt/CodeLine.11de981f.js"
  },
  "/_nuxt/ContentDoc.7511ba15.js": {
    "type": "application/javascript",
    "etag": "\"930-n0htqD+Feo7YuAw/9+Of6ahdzOQ\"",
    "mtime": "2022-11-20T18:20:02.333Z",
    "size": 2352,
    "path": "../public/_nuxt/ContentDoc.7511ba15.js"
  },
  "/_nuxt/ContentList.7b1bbf5b.js": {
    "type": "application/javascript",
    "etag": "\"396-ZDGwZfnI7ZJVyUElv9wGd1NOmP0\"",
    "mtime": "2022-11-20T18:20:02.332Z",
    "size": 918,
    "path": "../public/_nuxt/ContentList.7b1bbf5b.js"
  },
  "/_nuxt/ContentNavigation.102840ec.js": {
    "type": "application/javascript",
    "etag": "\"7c18-seDFSQe2mkzoJKwhw2JkWr79tmw\"",
    "mtime": "2022-11-20T18:20:02.332Z",
    "size": 31768,
    "path": "../public/_nuxt/ContentNavigation.102840ec.js"
  },
  "/_nuxt/ContentNavigation.3775f909.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"30c0-gcSlVBeN/exQmEu2DJ9+mLYpYwU\"",
    "mtime": "2022-11-20T18:20:02.331Z",
    "size": 12480,
    "path": "../public/_nuxt/ContentNavigation.3775f909.css"
  },
  "/_nuxt/ContentQuery.89520e9f.js": {
    "type": "application/javascript",
    "etag": "\"330a-lGbD2qy3ggDIZpuSJeLCOD1w184\"",
    "mtime": "2022-11-20T18:20:02.330Z",
    "size": 13066,
    "path": "../public/_nuxt/ContentQuery.89520e9f.js"
  },
  "/_nuxt/ContentRenderer.963f5716.js": {
    "type": "application/javascript",
    "etag": "\"4e7-JI+ztiGFAjjD60UBsgTv7Ms78B4\"",
    "mtime": "2022-11-20T18:20:02.329Z",
    "size": 1255,
    "path": "../public/_nuxt/ContentRenderer.963f5716.js"
  },
  "/_nuxt/ContentRendererMarkdown.00f37ef7.js": {
    "type": "application/javascript",
    "etag": "\"5680-3bWDz9VlSVLXm1DEpcFTrhCgMqg\"",
    "mtime": "2022-11-20T18:20:02.328Z",
    "size": 22144,
    "path": "../public/_nuxt/ContentRendererMarkdown.00f37ef7.js"
  },
  "/_nuxt/ContentSlot.12fcbe2f.js": {
    "type": "application/javascript",
    "etag": "\"3e8-UTmBueD+6s3aWTEU1Df4O4fkWpg\"",
    "mtime": "2022-11-20T18:20:02.328Z",
    "size": 1000,
    "path": "../public/_nuxt/ContentSlot.12fcbe2f.js"
  },
  "/_nuxt/ControlRow.1e509d01.js": {
    "type": "application/javascript",
    "etag": "\"106-IbiNlDDNHAs1cnvAGRZsEZP7Id0\"",
    "mtime": "2022-11-20T18:20:02.327Z",
    "size": 262,
    "path": "../public/_nuxt/ControlRow.1e509d01.js"
  },
  "/_nuxt/ControlTab.d6611262.js": {
    "type": "application/javascript",
    "etag": "\"297-iygX65/7Bzit4jFOalTL9VOHMJk\"",
    "mtime": "2022-11-20T18:20:02.326Z",
    "size": 663,
    "path": "../public/_nuxt/ControlTab.d6611262.js"
  },
  "/_nuxt/ControlTabs.2d5910ba.js": {
    "type": "application/javascript",
    "etag": "\"54f-6fvsSRuhWBNfqhDJn3I+EPVImlM\"",
    "mtime": "2022-11-20T18:20:02.326Z",
    "size": 1359,
    "path": "../public/_nuxt/ControlTabs.2d5910ba.js"
  },
  "/_nuxt/DesktopTitlebar.9dd957c7.js": {
    "type": "application/javascript",
    "etag": "\"366-dm8W2tG3bcKuR+LPyvRQkqNrxaE\"",
    "mtime": "2022-11-20T18:20:02.325Z",
    "size": 870,
    "path": "../public/_nuxt/DesktopTitlebar.9dd957c7.js"
  },
  "/_nuxt/Divider.5c0ae6e6.js": {
    "type": "application/javascript",
    "etag": "\"329-Hmi+hSp2oQuB8sG6MyU6cwCEKyk\"",
    "mtime": "2022-11-20T18:20:02.325Z",
    "size": 809,
    "path": "../public/_nuxt/Divider.5c0ae6e6.js"
  },
  "/_nuxt/DocumentDrivenEmpty.02e3ee3c.js": {
    "type": "application/javascript",
    "etag": "\"120-TFMcRQs2Ba5ZzTuMnV0FxjtfBLM\"",
    "mtime": "2022-11-20T18:20:02.324Z",
    "size": 288,
    "path": "../public/_nuxt/DocumentDrivenEmpty.02e3ee3c.js"
  },
  "/_nuxt/DocumentDrivenNotFound.785052d9.js": {
    "type": "application/javascript",
    "etag": "\"9f-XU2wK4a0/30j6ZCAtd1/uRMDhis\"",
    "mtime": "2022-11-20T18:20:02.323Z",
    "size": 159,
    "path": "../public/_nuxt/DocumentDrivenNotFound.785052d9.js"
  },
  "/_nuxt/Dot.29ec27b8.js": {
    "type": "application/javascript",
    "etag": "\"ff-1aimiV5rWJY0Ld4qzOqxvhmrayU\"",
    "mtime": "2022-11-20T18:20:02.323Z",
    "size": 255,
    "path": "../public/_nuxt/Dot.29ec27b8.js"
  },
  "/_nuxt/Dropdown.e79e16ca.js": {
    "type": "application/javascript",
    "etag": "\"6f2-RY3FhFl8/roKxnTFj0GTWKdUjlE\"",
    "mtime": "2022-11-20T18:20:02.322Z",
    "size": 1778,
    "path": "../public/_nuxt/Dropdown.e79e16ca.js"
  },
  "/_nuxt/Element.f8e121c9.js": {
    "type": "application/javascript",
    "etag": "\"293-dgTn2gtWziBgQcg0x8hUVccxiYM\"",
    "mtime": "2022-11-20T18:20:02.322Z",
    "size": 659,
    "path": "../public/_nuxt/Element.f8e121c9.js"
  },
  "/_nuxt/FauxMenu.9aea156e.js": {
    "type": "application/javascript",
    "etag": "\"2b3-lvkUBN2GYbGgXwzNzRm7EqYJzww\"",
    "mtime": "2022-11-20T18:20:02.321Z",
    "size": 691,
    "path": "../public/_nuxt/FauxMenu.9aea156e.js"
  },
  "/_nuxt/FileDropdown.464c2913.js": {
    "type": "application/javascript",
    "etag": "\"636-eWSXHfN2zDzY085l3XbAf3zUHHM\"",
    "mtime": "2022-11-20T18:20:02.320Z",
    "size": 1590,
    "path": "../public/_nuxt/FileDropdown.464c2913.js"
  },
  "/_nuxt/FormDivider.45444cd9.js": {
    "type": "application/javascript",
    "etag": "\"199-mX5+BwlPKvWZ5z73EWJA/CcYxQI\"",
    "mtime": "2022-11-20T18:20:02.320Z",
    "size": 409,
    "path": "../public/_nuxt/FormDivider.45444cd9.js"
  },
  "/_nuxt/FormGroup.d019c283.js": {
    "type": "application/javascript",
    "etag": "\"e3-a4EuTRqfcFC4bXnSMAOp4/1r1mw\"",
    "mtime": "2022-11-20T18:20:02.319Z",
    "size": 227,
    "path": "../public/_nuxt/FormGroup.d019c283.js"
  },
  "/_nuxt/GitHubCorner.7bfacbcb.js": {
    "type": "application/javascript",
    "etag": "\"7f9-93rKZEejigSCTMcqeIZ7fZ1hBjw\"",
    "mtime": "2022-11-20T18:20:02.319Z",
    "size": 2041,
    "path": "../public/_nuxt/GitHubCorner.7bfacbcb.js"
  },
  "/_nuxt/Hotkeys.2db21588.js": {
    "type": "application/javascript",
    "etag": "\"2d6-VvIIoTtljnNVxkknPKyLmg0dHCw\"",
    "mtime": "2022-11-20T18:20:02.318Z",
    "size": 726,
    "path": "../public/_nuxt/Hotkeys.2db21588.js"
  },
  "/_nuxt/Interact.378af0ec.js": {
    "type": "application/javascript",
    "etag": "\"2006a-LuSinD5ymvvCTmegyDRIESZsczU\"",
    "mtime": "2022-11-20T18:20:02.318Z",
    "size": 131178,
    "path": "../public/_nuxt/Interact.378af0ec.js"
  },
  "/_nuxt/Label.0551d16c.js": {
    "type": "application/javascript",
    "etag": "\"fa-+4yRdSRZbc0dULQqDBjsUhGAPTA\"",
    "mtime": "2022-11-20T18:20:02.316Z",
    "size": 250,
    "path": "../public/_nuxt/Label.0551d16c.js"
  },
  "/_nuxt/LazyComponent.8f14d559.js": {
    "type": "application/javascript",
    "etag": "\"371-h0cIwP4Ljx4qnTvfRFqzmtfzvfk\"",
    "mtime": "2022-11-20T18:20:02.316Z",
    "size": 881,
    "path": "../public/_nuxt/LazyComponent.8f14d559.js"
  },
  "/_nuxt/Logo.a52106a7.js": {
    "type": "application/javascript",
    "etag": "\"d3e-ftlsq5lbDiL/Cmfu3zI/LNQ0lkM\"",
    "mtime": "2022-11-20T18:20:02.315Z",
    "size": 3390,
    "path": "../public/_nuxt/Logo.a52106a7.js"
  },
  "/_nuxt/Markdown.5b447644.js": {
    "type": "application/javascript",
    "etag": "\"15b-28vxdmFRbHnC3OJiE46BFrAKR2E\"",
    "mtime": "2022-11-20T18:20:02.315Z",
    "size": 347,
    "path": "../public/_nuxt/Markdown.5b447644.js"
  },
  "/_nuxt/Modal.8d7c1851.js": {
    "type": "application/javascript",
    "etag": "\"594-rEBl9Gtftxp8tIte/kGjRMby2Pg\"",
    "mtime": "2022-11-20T18:20:02.314Z",
    "size": 1428,
    "path": "../public/_nuxt/Modal.8d7c1851.js"
  },
  "/_nuxt/ModalChangelog.83e30626.js": {
    "type": "application/javascript",
    "etag": "\"231-tn1HJK/mVrwpHCcREdLq5tCSfBw\"",
    "mtime": "2022-11-20T18:20:02.313Z",
    "size": 561,
    "path": "../public/_nuxt/ModalChangelog.83e30626.js"
  },
  "/_nuxt/ModalCustomBackground.a7cd3208.js": {
    "type": "application/javascript",
    "etag": "\"5ae6-48dKBKydgAB5nBVVKQ0IoFziRSM\"",
    "mtime": "2022-11-20T18:20:02.313Z",
    "size": 23270,
    "path": "../public/_nuxt/ModalCustomBackground.a7cd3208.js"
  },
  "/_nuxt/ModalHelp.10860428.js": {
    "type": "application/javascript",
    "etag": "\"22d-Ofp+YezlsaGfbv57y8XZY1Inlq4\"",
    "mtime": "2022-11-20T18:20:02.312Z",
    "size": 557,
    "path": "../public/_nuxt/ModalHelp.10860428.js"
  },
  "/_nuxt/ModalPreferences.943fc8dd.js": {
    "type": "application/javascript",
    "etag": "\"240a-2udletNRkxJxob3dFYRQep7rIRA\"",
    "mtime": "2022-11-20T18:20:02.311Z",
    "size": 9226,
    "path": "../public/_nuxt/ModalPreferences.943fc8dd.js"
  },
  "/_nuxt/ModalTemplates.504dd5b5.js": {
    "type": "application/javascript",
    "etag": "\"8e6-ktKvaJjba1LWrMPHBLrYGvetGSI\"",
    "mtime": "2022-11-20T18:20:02.311Z",
    "size": 2278,
    "path": "../public/_nuxt/ModalTemplates.504dd5b5.js"
  },
  "/_nuxt/Page.bae2a157.js": {
    "type": "application/javascript",
    "etag": "\"18e0-9Un8PBuiBx21sLVuT9WEzlc78dM\"",
    "mtime": "2022-11-20T18:20:02.310Z",
    "size": 6368,
    "path": "../public/_nuxt/Page.bae2a157.js"
  },
  "/_nuxt/PopoverSettings.c9ed7a8b.js": {
    "type": "application/javascript",
    "etag": "\"24b-NsIVPT9aqyt0Dt5Wfd6IUjuL+Zo\"",
    "mtime": "2022-11-20T18:20:02.309Z",
    "size": 587,
    "path": "../public/_nuxt/PopoverSettings.c9ed7a8b.js"
  },
  "/_nuxt/Preview.e7e9a80e.js": {
    "type": "application/javascript",
    "etag": "\"b1fa-vnjFlPrcJ3q/tw7LX4eToDURFWk\"",
    "mtime": "2022-11-20T18:20:02.309Z",
    "size": 45562,
    "path": "../public/_nuxt/Preview.e7e9a80e.js"
  },
  "/_nuxt/ProseA.06837fcb.js": {
    "type": "application/javascript",
    "etag": "\"13d-sfE06AUtxJaAYYafEtDveP+a3y4\"",
    "mtime": "2022-11-20T18:20:02.308Z",
    "size": 317,
    "path": "../public/_nuxt/ProseA.06837fcb.js"
  },
  "/_nuxt/ProseBlockquote.8685ea92.js": {
    "type": "application/javascript",
    "etag": "\"c2-iJ1DW7hjyCtasVMmWBUGMfNn1Tc\"",
    "mtime": "2022-11-20T18:20:02.307Z",
    "size": 194,
    "path": "../public/_nuxt/ProseBlockquote.8685ea92.js"
  },
  "/_nuxt/ProseCode.e62ddbe3.js": {
    "type": "application/javascript",
    "etag": "\"13f-jLAS2vOKVzcD17Y7lpAj8VNdtsc\"",
    "mtime": "2022-11-20T18:20:02.306Z",
    "size": 319,
    "path": "../public/_nuxt/ProseCode.e62ddbe3.js"
  },
  "/_nuxt/ProseCode.e63e49c6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2e-GbvrqT5j9gSWlpa8e36U/Kv6Zx0\"",
    "mtime": "2022-11-20T18:20:02.306Z",
    "size": 46,
    "path": "../public/_nuxt/ProseCode.e63e49c6.css"
  },
  "/_nuxt/ProseCodeInline.0a15b480.js": {
    "type": "application/javascript",
    "etag": "\"bc-J54MgkRmg4RJw89lDLxkbjVCgdI\"",
    "mtime": "2022-11-20T18:20:02.305Z",
    "size": 188,
    "path": "../public/_nuxt/ProseCodeInline.0a15b480.js"
  },
  "/_nuxt/ProseEm.b78a686d.js": {
    "type": "application/javascript",
    "etag": "\"ba-WKIjQyydfE7HyHLTrHFLAIYCVV8\"",
    "mtime": "2022-11-20T18:20:02.304Z",
    "size": 186,
    "path": "../public/_nuxt/ProseEm.b78a686d.js"
  },
  "/_nuxt/ProseH1.5d82a2e2.js": {
    "type": "application/javascript",
    "etag": "\"1a0-oXw7eguGBV23tZuiKFiWZ05qvBw\"",
    "mtime": "2022-11-20T18:20:02.304Z",
    "size": 416,
    "path": "../public/_nuxt/ProseH1.5d82a2e2.js"
  },
  "/_nuxt/ProseH2.2c130400.js": {
    "type": "application/javascript",
    "etag": "\"1a0-+QuIpJ5lrby86G0lmNkvkZz28cE\"",
    "mtime": "2022-11-20T18:20:02.303Z",
    "size": 416,
    "path": "../public/_nuxt/ProseH2.2c130400.js"
  },
  "/_nuxt/ProseH3.82fbe6d8.js": {
    "type": "application/javascript",
    "etag": "\"1a0-/OYyfL3hqYH0ZDvwtz15SpZJ04s\"",
    "mtime": "2022-11-20T18:20:02.302Z",
    "size": 416,
    "path": "../public/_nuxt/ProseH3.82fbe6d8.js"
  },
  "/_nuxt/ProseH4.84d30a36.js": {
    "type": "application/javascript",
    "etag": "\"1a0-v5Fzx65h428fdzONDQ2nZSqNqPY\"",
    "mtime": "2022-11-20T18:20:02.302Z",
    "size": 416,
    "path": "../public/_nuxt/ProseH4.84d30a36.js"
  },
  "/_nuxt/ProseH5.85e5f380.js": {
    "type": "application/javascript",
    "etag": "\"1a0-8WntQt+4okp/CX9qWWThlob9aK8\"",
    "mtime": "2022-11-20T18:20:02.301Z",
    "size": 416,
    "path": "../public/_nuxt/ProseH5.85e5f380.js"
  },
  "/_nuxt/ProseH6.5603c4a4.js": {
    "type": "application/javascript",
    "etag": "\"1a0-M7Kd+RD1obLTYtDU3djUE1qIL8o\"",
    "mtime": "2022-11-20T18:20:02.300Z",
    "size": 416,
    "path": "../public/_nuxt/ProseH6.5603c4a4.js"
  },
  "/_nuxt/ProseHr.50e7c1eb.js": {
    "type": "application/javascript",
    "etag": "\"96-weY7T34yy2YbBhUf5yUahrdDqjM\"",
    "mtime": "2022-11-20T18:20:02.300Z",
    "size": 150,
    "path": "../public/_nuxt/ProseHr.50e7c1eb.js"
  },
  "/_nuxt/ProseImg.595dec1b.js": {
    "type": "application/javascript",
    "etag": "\"185-tB45cI+PBlolbMMSv/jbqykeUDg\"",
    "mtime": "2022-11-20T18:20:02.299Z",
    "size": 389,
    "path": "../public/_nuxt/ProseImg.595dec1b.js"
  },
  "/_nuxt/ProseLi.9b68f592.js": {
    "type": "application/javascript",
    "etag": "\"ba-aSAW04Ky7O5potZkjOlAD7JgL2g\"",
    "mtime": "2022-11-20T18:20:02.298Z",
    "size": 186,
    "path": "../public/_nuxt/ProseLi.9b68f592.js"
  },
  "/_nuxt/ProseOl.917ae850.js": {
    "type": "application/javascript",
    "etag": "\"ba-xcxw8wUqM3ytliqQ2ND2NV05R50\"",
    "mtime": "2022-11-20T18:20:02.297Z",
    "size": 186,
    "path": "../public/_nuxt/ProseOl.917ae850.js"
  },
  "/_nuxt/ProseP.09e2c2c5.js": {
    "type": "application/javascript",
    "etag": "\"b9-7/x0gWwY6DreaWzZJaRfUKSTgE4\"",
    "mtime": "2022-11-20T18:20:02.297Z",
    "size": 185,
    "path": "../public/_nuxt/ProseP.09e2c2c5.js"
  },
  "/_nuxt/ProseStrong.e5bd6603.js": {
    "type": "application/javascript",
    "etag": "\"be-m8y3/EZNMOfFvAlKAFx4pri+CfA\"",
    "mtime": "2022-11-20T18:20:02.296Z",
    "size": 190,
    "path": "../public/_nuxt/ProseStrong.e5bd6603.js"
  },
  "/_nuxt/ProseTable.448c1316.js": {
    "type": "application/javascript",
    "etag": "\"bd-1w8f86QQHdfOWTy1X3pO4GwW3cc\"",
    "mtime": "2022-11-20T18:20:02.295Z",
    "size": 189,
    "path": "../public/_nuxt/ProseTable.448c1316.js"
  },
  "/_nuxt/ProseTbody.6cb53a32.js": {
    "type": "application/javascript",
    "etag": "\"bd-2SiC4IcJr+Imy7pNNjjRNgjDZxs\"",
    "mtime": "2022-11-20T18:20:02.295Z",
    "size": 189,
    "path": "../public/_nuxt/ProseTbody.6cb53a32.js"
  },
  "/_nuxt/ProseTd.e769de23.js": {
    "type": "application/javascript",
    "etag": "\"ba-30CkVoSY/1CLhrXbnIg3Sz2tTC8\"",
    "mtime": "2022-11-20T18:20:02.294Z",
    "size": 186,
    "path": "../public/_nuxt/ProseTd.e769de23.js"
  },
  "/_nuxt/ProseTh.e68eb10c.js": {
    "type": "application/javascript",
    "etag": "\"ba-DcTEOtCZyLUEYfLCRTZOQ8Wc0+A\"",
    "mtime": "2022-11-20T18:20:02.294Z",
    "size": 186,
    "path": "../public/_nuxt/ProseTh.e68eb10c.js"
  },
  "/_nuxt/ProseThead.2b0a25f1.js": {
    "type": "application/javascript",
    "etag": "\"bd-tzzDqF9AyW+xuUipIvP2rVuUjS0\"",
    "mtime": "2022-11-20T18:20:02.293Z",
    "size": 189,
    "path": "../public/_nuxt/ProseThead.2b0a25f1.js"
  },
  "/_nuxt/ProseTr.4c0f6e1a.js": {
    "type": "application/javascript",
    "etag": "\"b5-ixTGRXBO0jBVwAwB0MPXWdRk2w0\"",
    "mtime": "2022-11-20T18:20:02.292Z",
    "size": 181,
    "path": "../public/_nuxt/ProseTr.4c0f6e1a.js"
  },
  "/_nuxt/ProseUl.213d89d1.js": {
    "type": "application/javascript",
    "etag": "\"ba-EFgcgKUuHA0GUzA2abimOm4rvso\"",
    "mtime": "2022-11-20T18:20:02.292Z",
    "size": 186,
    "path": "../public/_nuxt/ProseUl.213d89d1.js"
  },
  "/_nuxt/Range.418c2216.js": {
    "type": "application/javascript",
    "etag": "\"224-2+/20LuiuugJH4EvYncT2JBa9nI\"",
    "mtime": "2022-11-20T18:20:02.291Z",
    "size": 548,
    "path": "../public/_nuxt/Range.418c2216.js"
  },
  "/_nuxt/Separator.1c4aad71.js": {
    "type": "application/javascript",
    "etag": "\"33f-Ef21UCPSZX1/akqM1/hC1Caqylc\"",
    "mtime": "2022-11-20T18:20:02.291Z",
    "size": 831,
    "path": "../public/_nuxt/Separator.1c4aad71.js"
  },
  "/_nuxt/Tab.9ae99b59.js": {
    "type": "application/javascript",
    "etag": "\"bb2-MuaFztR8wlmFt/whB5Rcf30+luc\"",
    "mtime": "2022-11-20T18:20:02.290Z",
    "size": 2994,
    "path": "../public/_nuxt/Tab.9ae99b59.js"
  },
  "/_nuxt/TabButton.e99c5e64.js": {
    "type": "application/javascript",
    "etag": "\"191-w61BLGA09Nne9UV63t3c5gL/2d4\"",
    "mtime": "2022-11-20T18:20:02.289Z",
    "size": 401,
    "path": "../public/_nuxt/TabButton.e99c5e64.js"
  },
  "/_nuxt/Toggle.c559d6b1.js": {
    "type": "application/javascript",
    "etag": "\"7c7-ealNnFSRCTFJtlC/22NLARCQDHI\"",
    "mtime": "2022-11-20T18:20:02.288Z",
    "size": 1991,
    "path": "../public/_nuxt/Toggle.c559d6b1.js"
  },
  "/_nuxt/ToggleBorder.1a41921f.js": {
    "type": "application/javascript",
    "etag": "\"4a4-LuBCeMRwBQFUIVT5Gac3y9t9KkY\"",
    "mtime": "2022-11-20T18:20:02.288Z",
    "size": 1188,
    "path": "../public/_nuxt/ToggleBorder.1a41921f.js"
  },
  "/_nuxt/ToggleDarkMode.6f2d051c.js": {
    "type": "application/javascript",
    "etag": "\"20a-CScLxqNoWB/LFNaTFPe2Wa18Gfk\"",
    "mtime": "2022-11-20T18:20:02.287Z",
    "size": 522,
    "path": "../public/_nuxt/ToggleDarkMode.6f2d051c.js"
  },
  "/_nuxt/ToggleShadow.a84dfb34.js": {
    "type": "application/javascript",
    "etag": "\"954-MvSyHPN4CBdv2hTj1fulATnZRTA\"",
    "mtime": "2022-11-20T18:20:02.287Z",
    "size": 2388,
    "path": "../public/_nuxt/ToggleShadow.a84dfb34.js"
  },
  "/_nuxt/Window.5af67782.js": {
    "type": "application/javascript",
    "etag": "\"1331-KP0aHHieMnyXby+sZ/KcCz3JS+0\"",
    "mtime": "2022-11-20T18:20:02.286Z",
    "size": 4913,
    "path": "../public/_nuxt/Window.5af67782.js"
  },
  "/_nuxt/WindowControls.a2ead36f.js": {
    "type": "application/javascript",
    "etag": "\"713-ekMM5bVw4SBrtzwNDgyNuITC2uU\"",
    "mtime": "2022-11-20T18:20:02.285Z",
    "size": 1811,
    "path": "../public/_nuxt/WindowControls.a2ead36f.js"
  },
  "/_nuxt/abap.fd5b7bee.js": {
    "type": "application/javascript",
    "etag": "\"36c7-BkjYG66QpeqvLEzm8IWLfAqkVsE\"",
    "mtime": "2022-11-20T18:20:02.285Z",
    "size": 14023,
    "path": "../public/_nuxt/abap.fd5b7bee.js"
  },
  "/_nuxt/apex.ec81bb56.js": {
    "type": "application/javascript",
    "etag": "\"efd-5cL7U8DBnfJmavNMRQdezS/uu34\"",
    "mtime": "2022-11-20T18:20:02.284Z",
    "size": 3837,
    "path": "../public/_nuxt/apex.ec81bb56.js"
  },
  "/_nuxt/asyncData.b76862a4.js": {
    "type": "application/javascript",
    "etag": "\"9aa-a3gQHm8fb9n2TIhtMI7XOHPKW0c\"",
    "mtime": "2022-11-20T18:20:02.283Z",
    "size": 2474,
    "path": "../public/_nuxt/asyncData.b76862a4.js"
  },
  "/_nuxt/azcli.dbd37b8b.js": {
    "type": "application/javascript",
    "etag": "\"2c4-d5hlt/eDPY9gvRDWxWKmMcnFWI4\"",
    "mtime": "2022-11-20T18:20:02.283Z",
    "size": 708,
    "path": "../public/_nuxt/azcli.dbd37b8b.js"
  },
  "/_nuxt/bat.fdcc6c9c.js": {
    "type": "application/javascript",
    "etag": "\"6a9-fqyzydH6w2W/IrxqFK8/P/84uGI\"",
    "mtime": "2022-11-20T18:20:02.282Z",
    "size": 1705,
    "path": "../public/_nuxt/bat.fdcc6c9c.js"
  },
  "/_nuxt/bicep.c8ac78e3.js": {
    "type": "application/javascript",
    "etag": "\"96c-6/udYdSmEWwuGGyt/njh2AAj5rQ\"",
    "mtime": "2022-11-20T18:20:02.282Z",
    "size": 2412,
    "path": "../public/_nuxt/bicep.c8ac78e3.js"
  },
  "/_nuxt/buy.d99adb2f.js": {
    "type": "application/javascript",
    "etag": "\"56b5-vc4ZAaTZhtmQVqL/9yp9Wi6Gyv4\"",
    "mtime": "2022-11-20T18:20:02.281Z",
    "size": 22197,
    "path": "../public/_nuxt/buy.d99adb2f.js"
  },
  "/_nuxt/cameligo.afba7f53.js": {
    "type": "application/javascript",
    "etag": "\"7fd-tN1ZOyXmPMobQ3KvdXwT89kmTbY\"",
    "mtime": "2022-11-20T18:20:02.280Z",
    "size": 2045,
    "path": "../public/_nuxt/cameligo.afba7f53.js"
  },
  "/_nuxt/client-db.18145f19.js": {
    "type": "application/javascript",
    "etag": "\"4e6e-cV/5eriMUHMWjt4YvqgE4Oxi23s\"",
    "mtime": "2022-11-20T18:20:02.280Z",
    "size": 20078,
    "path": "../public/_nuxt/client-db.18145f19.js"
  },
  "/_nuxt/clojure.020cc7f7.js": {
    "type": "application/javascript",
    "etag": "\"251f-xVhAVDJXc5mg4M3ldYiCErTPBtE\"",
    "mtime": "2022-11-20T18:20:02.278Z",
    "size": 9503,
    "path": "../public/_nuxt/clojure.020cc7f7.js"
  },
  "/_nuxt/codicon.ff6b888d.ttf": {
    "type": "font/ttf",
    "etag": "\"10a3c-GH6bl/o3SB+pMTtIQ0gMWlM6Qaw\"",
    "mtime": "2022-11-20T18:20:02.278Z",
    "size": 68156,
    "path": "../public/_nuxt/codicon.ff6b888d.ttf"
  },
  "/_nuxt/coffee.021446c9.js": {
    "type": "application/javascript",
    "etag": "\"d7a-zlFRoDUx5tDXwN48R2q9Xgx1saI\"",
    "mtime": "2022-11-20T18:20:02.276Z",
    "size": 3450,
    "path": "../public/_nuxt/coffee.021446c9.js"
  },
  "/_nuxt/composables.2927ecab.js": {
    "type": "application/javascript",
    "etag": "\"5c-5+KysE7bxnz/kz6uTrSmAykOaYQ\"",
    "mtime": "2022-11-20T18:20:02.276Z",
    "size": 92,
    "path": "../public/_nuxt/composables.2927ecab.js"
  },
  "/_nuxt/cpp.8d0e3666.js": {
    "type": "application/javascript",
    "etag": "\"14bc-0k269U/M8zCpHmXIi4sHHXeVB3c\"",
    "mtime": "2022-11-20T18:20:02.275Z",
    "size": 5308,
    "path": "../public/_nuxt/cpp.8d0e3666.js"
  },
  "/_nuxt/csharp.cbe18943.js": {
    "type": "application/javascript",
    "etag": "\"1120-kLW2Ke0OyU9GDiEDSzR9FMgST7Q\"",
    "mtime": "2022-11-20T18:20:02.274Z",
    "size": 4384,
    "path": "../public/_nuxt/csharp.cbe18943.js"
  },
  "/_nuxt/csp.bd10ea3f.js": {
    "type": "application/javascript",
    "etag": "\"4ff-42D/J4kcuqQBr28Ek0BpcswIF5Y\"",
    "mtime": "2022-11-20T18:20:02.274Z",
    "size": 1279,
    "path": "../public/_nuxt/csp.bd10ea3f.js"
  },
  "/_nuxt/css.373a1a16.js": {
    "type": "application/javascript",
    "etag": "\"110f-QIYoN2L/9KAZoEieT8AItvFsGfU\"",
    "mtime": "2022-11-20T18:20:02.273Z",
    "size": 4367,
    "path": "../public/_nuxt/css.373a1a16.js"
  },
  "/_nuxt/cssMode.753a6282.js": {
    "type": "application/javascript",
    "etag": "\"7d69-nE9ejbkMkMIr1vW5l6MMnUj4l6w\"",
    "mtime": "2022-11-20T18:20:02.273Z",
    "size": 32105,
    "path": "../public/_nuxt/cssMode.753a6282.js"
  },
  "/_nuxt/dart.1cba14b0.js": {
    "type": "application/javascript",
    "etag": "\"100e-G61UN95tGE6AAmlirke4JyeD/i4\"",
    "mtime": "2022-11-20T18:20:02.272Z",
    "size": 4110,
    "path": "../public/_nuxt/dart.1cba14b0.js"
  },
  "/_nuxt/dockerfile.f8e9e2f2.js": {
    "type": "application/javascript",
    "etag": "\"6c1-kx1tQUZtiuMpjmrEGFIoe30MFa0\"",
    "mtime": "2022-11-20T18:20:02.271Z",
    "size": 1729,
    "path": "../public/_nuxt/dockerfile.f8e9e2f2.js"
  },
  "/_nuxt/ecl.65c6f89c.js": {
    "type": "application/javascript",
    "etag": "\"1452-WFKELyLqeSCK6V5LU5U3b0lTpbc\"",
    "mtime": "2022-11-20T18:20:02.271Z",
    "size": 5202,
    "path": "../public/_nuxt/ecl.65c6f89c.js"
  },
  "/_nuxt/elixir.4e9b4182.js": {
    "type": "application/javascript",
    "etag": "\"254c-ztk/SrYgaI3BNZNVsbW03q8RpZY\"",
    "mtime": "2022-11-20T18:20:02.270Z",
    "size": 9548,
    "path": "../public/_nuxt/elixir.4e9b4182.js"
  },
  "/_nuxt/entry.34beaa91.js": {
    "type": "application/javascript",
    "etag": "\"4d301-qpyBElYpMVgv5V/3YjW+QoXQKmg\"",
    "mtime": "2022-11-20T18:20:02.269Z",
    "size": 316161,
    "path": "../public/_nuxt/entry.34beaa91.js"
  },
  "/_nuxt/entry.4babd920.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"15ee-KQr3nzeIn7Lt7U7nXfybSwHJohI\"",
    "mtime": "2022-11-20T18:20:02.266Z",
    "size": 5614,
    "path": "../public/_nuxt/entry.4babd920.css"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2022-11-20T18:20:02.266Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.5ee54a0d.js": {
    "type": "application/javascript",
    "etag": "\"8d7-sf5NXoXLBKtSpLryVUNIeQ3rZ1g\"",
    "mtime": "2022-11-20T18:20:02.265Z",
    "size": 2263,
    "path": "../public/_nuxt/error-404.5ee54a0d.js"
  },
  "/_nuxt/error-500.77832702.js": {
    "type": "application/javascript",
    "etag": "\"77f-7OWTL1c1fBkQ+6vXz7+n8nPe33o\"",
    "mtime": "2022-11-20T18:20:02.264Z",
    "size": 1919,
    "path": "../public/_nuxt/error-500.77832702.js"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2022-11-20T18:20:02.263Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-component.32911552.js": {
    "type": "application/javascript",
    "etag": "\"4ad-qt/kysa01sBvDTX6vb6IqNKJaP0\"",
    "mtime": "2022-11-20T18:20:02.263Z",
    "size": 1197,
    "path": "../public/_nuxt/error-component.32911552.js"
  },
  "/_nuxt/flow9.6177c565.js": {
    "type": "application/javascript",
    "etag": "\"686-oEGbBEwE5U+p//RFsGCqqy1t28o\"",
    "mtime": "2022-11-20T18:20:02.262Z",
    "size": 1670,
    "path": "../public/_nuxt/flow9.6177c565.js"
  },
  "/_nuxt/fsharp.741953c4.js": {
    "type": "application/javascript",
    "etag": "\"b1b-h7WEBbuSCW1ND5RVtJwwJFwuiig\"",
    "mtime": "2022-11-20T18:20:02.262Z",
    "size": 2843,
    "path": "../public/_nuxt/fsharp.741953c4.js"
  },
  "/_nuxt/go.e4fc9dd7.js": {
    "type": "application/javascript",
    "etag": "\"9d5-YCNWv/y3bHWDDp4Q/TMcznpzV04\"",
    "mtime": "2022-11-20T18:20:02.261Z",
    "size": 2517,
    "path": "../public/_nuxt/go.e4fc9dd7.js"
  },
  "/_nuxt/graphql.a230b913.js": {
    "type": "application/javascript",
    "etag": "\"848-xWKk2rFCpHoonoJFVCbmeKEAy0c\"",
    "mtime": "2022-11-20T18:20:02.260Z",
    "size": 2120,
    "path": "../public/_nuxt/graphql.a230b913.js"
  },
  "/_nuxt/handlebars.7df4a577.js": {
    "type": "application/javascript",
    "etag": "\"18d0-hgjZ6KBb07VSoWtp2OKg2m9svfQ\"",
    "mtime": "2022-11-20T18:20:02.260Z",
    "size": 6352,
    "path": "../public/_nuxt/handlebars.7df4a577.js"
  },
  "/_nuxt/hcl.c63d7a6d.js": {
    "type": "application/javascript",
    "etag": "\"d7a-fk5/sg6GN0rF588da22v44UzElg\"",
    "mtime": "2022-11-20T18:20:02.259Z",
    "size": 3450,
    "path": "../public/_nuxt/hcl.c63d7a6d.js"
  },
  "/_nuxt/html.0df1426c.js": {
    "type": "application/javascript",
    "etag": "\"1140-JFwVP8ldgeVqARulRVlbhOJpH68\"",
    "mtime": "2022-11-20T18:20:02.259Z",
    "size": 4416,
    "path": "../public/_nuxt/html.0df1426c.js"
  },
  "/_nuxt/htmlMode.7570810c.js": {
    "type": "application/javascript",
    "etag": "\"7783-VthfmgCIs7UxuzqIihxCrPK5WIU\"",
    "mtime": "2022-11-20T18:20:02.258Z",
    "size": 30595,
    "path": "../public/_nuxt/htmlMode.7570810c.js"
  },
  "/_nuxt/index.5e1ae42b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"711-3cKrGwqxONig05l1hdvXHFz27Og\"",
    "mtime": "2022-11-20T18:20:02.257Z",
    "size": 1809,
    "path": "../public/_nuxt/index.5e1ae42b.css"
  },
  "/_nuxt/index.68c44503.js": {
    "type": "application/javascript",
    "etag": "\"273-247HTsPRGzXkRd0I0p8dXMP0/JE\"",
    "mtime": "2022-11-20T18:20:02.256Z",
    "size": 627,
    "path": "../public/_nuxt/index.68c44503.js"
  },
  "/_nuxt/index.d577d8fb.js": {
    "type": "application/javascript",
    "etag": "\"1b2c5-/GIrgPWsMozX7XJultd8yrqnZzo\"",
    "mtime": "2022-11-20T18:20:02.256Z",
    "size": 111301,
    "path": "../public/_nuxt/index.d577d8fb.js"
  },
  "/_nuxt/ini.7660a03a.js": {
    "type": "application/javascript",
    "etag": "\"3c1-EVdUfJgafUaiT5tM+58GkNcUmUM\"",
    "mtime": "2022-11-20T18:20:02.254Z",
    "size": 961,
    "path": "../public/_nuxt/ini.7660a03a.js"
  },
  "/_nuxt/java.c18365f6.js": {
    "type": "application/javascript",
    "etag": "\"c09-8esdtEyuVb1IHl8vXXJcPLmyOFc\"",
    "mtime": "2022-11-20T18:20:02.253Z",
    "size": 3081,
    "path": "../public/_nuxt/java.c18365f6.js"
  },
  "/_nuxt/javascript.3d916605.js": {
    "type": "application/javascript",
    "etag": "\"355-j385wzYGvYeP4a3FzmXKPj05MjM\"",
    "mtime": "2022-11-20T18:20:02.252Z",
    "size": 853,
    "path": "../public/_nuxt/javascript.3d916605.js"
  },
  "/_nuxt/jsonMode.4b33708d.js": {
    "type": "application/javascript",
    "etag": "\"924a-4pr4x16koScK/Ag5NVl11AE7Jdg\"",
    "mtime": "2022-11-20T18:20:02.252Z",
    "size": 37450,
    "path": "../public/_nuxt/jsonMode.4b33708d.js"
  },
  "/_nuxt/julia.85b406e9.js": {
    "type": "application/javascript",
    "etag": "\"1baf-KvcpkTdE3E83y8JJ5E/pOtmzgtU\"",
    "mtime": "2022-11-20T18:20:02.250Z",
    "size": 7087,
    "path": "../public/_nuxt/julia.85b406e9.js"
  },
  "/_nuxt/kotlin.a5d87642.js": {
    "type": "application/javascript",
    "etag": "\"ce3-h5L6ZKvgUqd7fzSEutGZdepr5MU\"",
    "mtime": "2022-11-20T18:20:02.250Z",
    "size": 3299,
    "path": "../public/_nuxt/kotlin.a5d87642.js"
  },
  "/_nuxt/less.0f42eeeb.js": {
    "type": "application/javascript",
    "etag": "\"eab-tJm5q65CicGryAPmqUtjqUYw1Ws\"",
    "mtime": "2022-11-20T18:20:02.249Z",
    "size": 3755,
    "path": "../public/_nuxt/less.0f42eeeb.js"
  },
  "/_nuxt/lexon.6915513d.js": {
    "type": "application/javascript",
    "etag": "\"8f9-oEulYdeqy1/9hU4OlNGT9NeRy0c\"",
    "mtime": "2022-11-20T18:20:02.248Z",
    "size": 2297,
    "path": "../public/_nuxt/lexon.6915513d.js"
  },
  "/_nuxt/liquid.2fbbf418.js": {
    "type": "application/javascript",
    "etag": "\"dd2-sduZlcS5yKwXgv7kbzG9mNwaFpU\"",
    "mtime": "2022-11-20T18:20:02.248Z",
    "size": 3538,
    "path": "../public/_nuxt/liquid.2fbbf418.js"
  },
  "/_nuxt/lua.2daa6b9f.js": {
    "type": "application/javascript",
    "etag": "\"7bf-9zq94ysVB6xsAL+lBK4MKXEvO/A\"",
    "mtime": "2022-11-20T18:20:02.247Z",
    "size": 1983,
    "path": "../public/_nuxt/lua.2daa6b9f.js"
  },
  "/_nuxt/m3.5dde6d08.js": {
    "type": "application/javascript",
    "etag": "\"a75-r+Oheirin+KRDkufMZk7tmEa7Q8\"",
    "mtime": "2022-11-20T18:20:02.246Z",
    "size": 2677,
    "path": "../public/_nuxt/m3.5dde6d08.js"
  },
  "/_nuxt/markdown.59e2f45b.js": {
    "type": "application/javascript",
    "etag": "\"e30-QfbYkRAqUctYo2WMXv5Rv3T/2hA\"",
    "mtime": "2022-11-20T18:20:02.246Z",
    "size": 3632,
    "path": "../public/_nuxt/markdown.59e2f45b.js"
  },
  "/_nuxt/mips.974ce704.js": {
    "type": "application/javascript",
    "etag": "\"987-dV1lJGtbNG4+NCyaU9NmhUzVneA\"",
    "mtime": "2022-11-20T18:20:02.245Z",
    "size": 2439,
    "path": "../public/_nuxt/mips.974ce704.js"
  },
  "/_nuxt/msdax.e22667b9.js": {
    "type": "application/javascript",
    "etag": "\"12a4-U2jZScoTN5EPH4eaF8o046MA4cE\"",
    "mtime": "2022-11-20T18:20:02.244Z",
    "size": 4772,
    "path": "../public/_nuxt/msdax.e22667b9.js"
  },
  "/_nuxt/mysql.13f8bdb1.js": {
    "type": "application/javascript",
    "etag": "\"27c3-VBSnM+J1Ukt9XqYjEYz1SICnFCE\"",
    "mtime": "2022-11-20T18:20:02.244Z",
    "size": 10179,
    "path": "../public/_nuxt/mysql.13f8bdb1.js"
  },
  "/_nuxt/objective-c.3be147af.js": {
    "type": "application/javascript",
    "etag": "\"8d6-IfdfCC4R9nV093LqnUy0DWghpfM\"",
    "mtime": "2022-11-20T18:20:02.243Z",
    "size": 2262,
    "path": "../public/_nuxt/objective-c.3be147af.js"
  },
  "/_nuxt/pascal.89ec1f9e.js": {
    "type": "application/javascript",
    "etag": "\"b27-+Yz+Uc8efFHI5a2KwOVMwIV8Imw\"",
    "mtime": "2022-11-20T18:20:02.242Z",
    "size": 2855,
    "path": "../public/_nuxt/pascal.89ec1f9e.js"
  },
  "/_nuxt/pascaligo.7eaa9392.js": {
    "type": "application/javascript",
    "etag": "\"744-b5GZCEr/q0BS2OJ1osfNehmieIM\"",
    "mtime": "2022-11-20T18:20:02.242Z",
    "size": 1860,
    "path": "../public/_nuxt/pascaligo.7eaa9392.js"
  },
  "/_nuxt/perl.83fc388c.js": {
    "type": "application/javascript",
    "etag": "\"1fb3-0JhQ1kNhVlH9byxaYOzTPrQ0NlA\"",
    "mtime": "2022-11-20T18:20:02.241Z",
    "size": 8115,
    "path": "../public/_nuxt/perl.83fc388c.js"
  },
  "/_nuxt/pgsql.7af02091.js": {
    "type": "application/javascript",
    "etag": "\"33d0-cBEPWXcrEylc1SAKwZ6+hE90LCU\"",
    "mtime": "2022-11-20T18:20:02.240Z",
    "size": 13264,
    "path": "../public/_nuxt/pgsql.7af02091.js"
  },
  "/_nuxt/php.20335915.js": {
    "type": "application/javascript",
    "etag": "\"1ecf-2UgVHVI82eseAgpYS4eVs+PoWXs\"",
    "mtime": "2022-11-20T18:20:02.239Z",
    "size": 7887,
    "path": "../public/_nuxt/php.20335915.js"
  },
  "/_nuxt/pla.8eafe645.js": {
    "type": "application/javascript",
    "etag": "\"607-XCXVJVP0cLUVv8KbKZIbA5CaxI8\"",
    "mtime": "2022-11-20T18:20:02.239Z",
    "size": 1543,
    "path": "../public/_nuxt/pla.8eafe645.js"
  },
  "/_nuxt/postiats.2f485d81.js": {
    "type": "application/javascript",
    "etag": "\"1e24-ypoi8JzR9ScxNhdF2paL1lZf06k\"",
    "mtime": "2022-11-20T18:20:02.238Z",
    "size": 7716,
    "path": "../public/_nuxt/postiats.2f485d81.js"
  },
  "/_nuxt/powerquery.f8462a65.js": {
    "type": "application/javascript",
    "etag": "\"419f-aJnal1AZtTccDZ0OzQNSC869pHE\"",
    "mtime": "2022-11-20T18:20:02.237Z",
    "size": 16799,
    "path": "../public/_nuxt/powerquery.f8462a65.js"
  },
  "/_nuxt/powershell.28082079.js": {
    "type": "application/javascript",
    "etag": "\"c39-mjx1PBq30BvwDnRfCbrd9Ezy+n0\"",
    "mtime": "2022-11-20T18:20:02.236Z",
    "size": 3129,
    "path": "../public/_nuxt/powershell.28082079.js"
  },
  "/_nuxt/protobuf.ca7a62f5.js": {
    "type": "application/javascript",
    "etag": "\"229b-IFVf7JLYcHg6Y3FCgJHlbEqco+U\"",
    "mtime": "2022-11-20T18:20:02.236Z",
    "size": 8859,
    "path": "../public/_nuxt/protobuf.ca7a62f5.js"
  },
  "/_nuxt/pug.ad09c2eb.js": {
    "type": "application/javascript",
    "etag": "\"1250-aKuSfCmXzaljd1Up7EKEYt1UMbw\"",
    "mtime": "2022-11-20T18:20:02.235Z",
    "size": 4688,
    "path": "../public/_nuxt/pug.ad09c2eb.js"
  },
  "/_nuxt/python.b3fc37bd.js": {
    "type": "application/javascript",
    "etag": "\"c65-Dw0PWv1lYYv7fPhzu7DXE66+iNU\"",
    "mtime": "2022-11-20T18:20:02.234Z",
    "size": 3173,
    "path": "../public/_nuxt/python.b3fc37bd.js"
  },
  "/_nuxt/qsharp.77d6058d.js": {
    "type": "application/javascript",
    "etag": "\"ae0-30C3xoOamlwlPMJBLhRfzFhtqSw\"",
    "mtime": "2022-11-20T18:20:02.234Z",
    "size": 2784,
    "path": "../public/_nuxt/qsharp.77d6058d.js"
  },
  "/_nuxt/r.f8b33ee6.js": {
    "type": "application/javascript",
    "etag": "\"baf-7YYCC4AhSqZeg0mX7lai9hF/pPI\"",
    "mtime": "2022-11-20T18:20:02.233Z",
    "size": 2991,
    "path": "../public/_nuxt/r.f8b33ee6.js"
  },
  "/_nuxt/razor.a581b585.js": {
    "type": "application/javascript",
    "etag": "\"20a4-fYcZRC0bt0NL0GKeyWBk9RqNuQI\"",
    "mtime": "2022-11-20T18:20:02.232Z",
    "size": 8356,
    "path": "../public/_nuxt/razor.a581b585.js"
  },
  "/_nuxt/redis.ea891ab6.js": {
    "type": "application/javascript",
    "etag": "\"d58-tLQw9Aw6LhM+nkeXDHg+H81J+Yk\"",
    "mtime": "2022-11-20T18:20:02.231Z",
    "size": 3416,
    "path": "../public/_nuxt/redis.ea891ab6.js"
  },
  "/_nuxt/redshift.548fb53d.js": {
    "type": "application/javascript",
    "etag": "\"2d7f-gzQfM0lAtPd0AgN5DaM7jcvseE4\"",
    "mtime": "2022-11-20T18:20:02.231Z",
    "size": 11647,
    "path": "../public/_nuxt/redshift.548fb53d.js"
  },
  "/_nuxt/restructuredtext.cf44a52f.js": {
    "type": "application/javascript",
    "etag": "\"ea9-/twir9arZYFBDVkTwf12flD6MaA\"",
    "mtime": "2022-11-20T18:20:02.230Z",
    "size": 3753,
    "path": "../public/_nuxt/restructuredtext.cf44a52f.js"
  },
  "/_nuxt/ruby.7e07168c.js": {
    "type": "application/javascript",
    "etag": "\"20ac-2n0e313el5fS7VAq75NXiLKMDKM\"",
    "mtime": "2022-11-20T18:20:02.229Z",
    "size": 8364,
    "path": "../public/_nuxt/ruby.7e07168c.js"
  },
  "/_nuxt/rust.eb1efcf7.js": {
    "type": "application/javascript",
    "etag": "\"fb4-8y2Eh7zo8KHULXD3A5Z2Y7f6D84\"",
    "mtime": "2022-11-20T18:20:02.226Z",
    "size": 4020,
    "path": "../public/_nuxt/rust.eb1efcf7.js"
  },
  "/_nuxt/sb.f19dca66.js": {
    "type": "application/javascript",
    "etag": "\"699-SE6/WnbRovNEZySeXDiaLRMuHuE\"",
    "mtime": "2022-11-20T18:20:02.226Z",
    "size": 1689,
    "path": "../public/_nuxt/sb.f19dca66.js"
  },
  "/_nuxt/scala.b5a2dbbe.js": {
    "type": "application/javascript",
    "etag": "\"1c0a-m9HCzyxyAI7cMNFK6kghqalyUSg\"",
    "mtime": "2022-11-20T18:20:02.225Z",
    "size": 7178,
    "path": "../public/_nuxt/scala.b5a2dbbe.js"
  },
  "/_nuxt/scheme.0e8c61c4.js": {
    "type": "application/javascript",
    "etag": "\"65b-8xWda4npUimrdKZXuchq0duTKS4\"",
    "mtime": "2022-11-20T18:20:02.224Z",
    "size": 1627,
    "path": "../public/_nuxt/scheme.0e8c61c4.js"
  },
  "/_nuxt/scss.d1e445bb.js": {
    "type": "application/javascript",
    "etag": "\"187a-eM7DGrg95SLlEjivrcTM6Z0d9eM\"",
    "mtime": "2022-11-20T18:20:02.223Z",
    "size": 6266,
    "path": "../public/_nuxt/scss.d1e445bb.js"
  },
  "/_nuxt/shell.9d179227.js": {
    "type": "application/javascript",
    "etag": "\"ae2-ddl31PkDWb9Ss3yklmAjGNANOT0\"",
    "mtime": "2022-11-20T18:20:02.223Z",
    "size": 2786,
    "path": "../public/_nuxt/shell.9d179227.js"
  },
  "/_nuxt/solidity.dbc0d7d0.js": {
    "type": "application/javascript",
    "etag": "\"4819-f3Xz4Qz87ldNuYuCPWEsCCdwUs8\"",
    "mtime": "2022-11-20T18:20:02.222Z",
    "size": 18457,
    "path": "../public/_nuxt/solidity.dbc0d7d0.js"
  },
  "/_nuxt/sophia.0e04f24f.js": {
    "type": "application/javascript",
    "etag": "\"a40-1b8DQ26lPBfoF8BYuHmstYKWaU8\"",
    "mtime": "2022-11-20T18:20:02.221Z",
    "size": 2624,
    "path": "../public/_nuxt/sophia.0e04f24f.js"
  },
  "/_nuxt/sparql.e30753e5.js": {
    "type": "application/javascript",
    "etag": "\"96c-K6P5tKw4/g55It24nivtgcjU+ds\"",
    "mtime": "2022-11-20T18:20:02.220Z",
    "size": 2412,
    "path": "../public/_nuxt/sparql.e30753e5.js"
  },
  "/_nuxt/split.bb84f483.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13b3a-ndXM6ABr+QAN2JkoiyVoBl4WRPs\"",
    "mtime": "2022-11-20T18:20:02.220Z",
    "size": 80698,
    "path": "../public/_nuxt/split.bb84f483.css"
  },
  "/_nuxt/split.es.435b128d.js": {
    "type": "application/javascript",
    "etag": "\"2ecea5-MMplqNjWCXPkT08Ur67c3qfjfz8\"",
    "mtime": "2022-11-20T18:20:02.216Z",
    "size": 3067557,
    "path": "../public/_nuxt/split.es.435b128d.js"
  },
  "/_nuxt/sql.839a2911.js": {
    "type": "application/javascript",
    "etag": "\"27ad-QFDD0+FMALAwHtDBpVPB5LR9L4M\"",
    "mtime": "2022-11-20T18:20:02.206Z",
    "size": 10157,
    "path": "../public/_nuxt/sql.839a2911.js"
  },
  "/_nuxt/st.fdec309e.js": {
    "type": "application/javascript",
    "etag": "\"1c52-w4ZyRSUavyFSj4R8FxIduSUcbyo\"",
    "mtime": "2022-11-20T18:20:02.206Z",
    "size": 7250,
    "path": "../public/_nuxt/st.fdec309e.js"
  },
  "/_nuxt/swift.44bd0bb9.js": {
    "type": "application/javascript",
    "etag": "\"1071-I2Bi+iF4CgzIq0f7iPvY40GmI3E\"",
    "mtime": "2022-11-20T18:20:02.205Z",
    "size": 4209,
    "path": "../public/_nuxt/swift.44bd0bb9.js"
  },
  "/_nuxt/systemverilog.ac2ae976.js": {
    "type": "application/javascript",
    "etag": "\"1d27-fLgcMC9OLPkM0QlaZA6Kl4tsYXM\"",
    "mtime": "2022-11-20T18:20:02.204Z",
    "size": 7463,
    "path": "../public/_nuxt/systemverilog.ac2ae976.js"
  },
  "/_nuxt/tcl.710815b2.js": {
    "type": "application/javascript",
    "etag": "\"d67-vh9DzbyGzCKMidreCxeEOsJSRV8\"",
    "mtime": "2022-11-20T18:20:02.204Z",
    "size": 3431,
    "path": "../public/_nuxt/tcl.710815b2.js"
  },
  "/_nuxt/tsMode.011b0edc.js": {
    "type": "application/javascript",
    "etag": "\"7044-9kTFSfaLoAFYAYKXxXP7fLTGLtY\"",
    "mtime": "2022-11-20T18:20:02.203Z",
    "size": 28740,
    "path": "../public/_nuxt/tsMode.011b0edc.js"
  },
  "/_nuxt/twig.45a5f26d.js": {
    "type": "application/javascript",
    "etag": "\"16c8-zM7/teUcLWWtPzRYuHQtTjhDdmU\"",
    "mtime": "2022-11-20T18:20:02.202Z",
    "size": 5832,
    "path": "../public/_nuxt/twig.45a5f26d.js"
  },
  "/_nuxt/typescript.55eda9a3.js": {
    "type": "application/javascript",
    "etag": "\"134f-Dc36NiJMHew51oR3kpzFDu7TOps\"",
    "mtime": "2022-11-20T18:20:02.201Z",
    "size": 4943,
    "path": "../public/_nuxt/typescript.55eda9a3.js"
  },
  "/_nuxt/useFonts.08393901.js": {
    "type": "application/javascript",
    "etag": "\"221c0-G7sbBwmkr/1XbBKpKutt1vILVTM\"",
    "mtime": "2022-11-20T18:20:02.200Z",
    "size": 139712,
    "path": "../public/_nuxt/useFonts.08393901.js"
  },
  "/_nuxt/useShiki.7e9e464a.js": {
    "type": "application/javascript",
    "etag": "\"48b-vJIQKWwDONIJNSw4wpO9+nh8PrM\"",
    "mtime": "2022-11-20T18:20:02.198Z",
    "size": 1163,
    "path": "../public/_nuxt/useShiki.7e9e464a.js"
  },
  "/_nuxt/utils.b3a63507.js": {
    "type": "application/javascript",
    "etag": "\"d8b-vF/2lo2E8U7fIF5bmoX0IHiyQlU\"",
    "mtime": "2022-11-20T18:20:02.197Z",
    "size": 3467,
    "path": "../public/_nuxt/utils.b3a63507.js"
  },
  "/_nuxt/vb.0133aac1.js": {
    "type": "application/javascript",
    "etag": "\"1613-N8rtAjh2yTnRM/fIWzXQKDN3vLw\"",
    "mtime": "2022-11-20T18:20:02.196Z",
    "size": 5651,
    "path": "../public/_nuxt/vb.0133aac1.js"
  },
  "/_nuxt/web-socket.18caf292.js": {
    "type": "application/javascript",
    "etag": "\"34e-CYEkZHpbmimS/LTmG5ID9iXYL6c\"",
    "mtime": "2022-11-20T18:20:02.196Z",
    "size": 846,
    "path": "../public/_nuxt/web-socket.18caf292.js"
  },
  "/_nuxt/welcome.15195a3c.js": {
    "type": "application/javascript",
    "etag": "\"17752-IjH/6wytJCtcV0PlMNkyH+qLLqQ\"",
    "mtime": "2022-11-20T18:20:02.194Z",
    "size": 96082,
    "path": "../public/_nuxt/welcome.15195a3c.js"
  },
  "/_nuxt/xml.fc68bc39.js": {
    "type": "application/javascript",
    "etag": "\"7c5-LmAO7+dw/z849rftwRNGX0aHNuM\"",
    "mtime": "2022-11-20T18:20:02.192Z",
    "size": 1989,
    "path": "../public/_nuxt/xml.fc68bc39.js"
  },
  "/_nuxt/yaml.09b8ec0b.js": {
    "type": "application/javascript",
    "etag": "\"d4c-AhVzOOtjHaHbNiNEVUnNQfG9HJI\"",
    "mtime": "2022-11-20T18:20:02.191Z",
    "size": 3404,
    "path": "../public/_nuxt/yaml.09b8ec0b.js"
  },
  "/api/_content/cache.json": {
    "type": "application/json",
    "etag": "\"a080-ObnZev9J5+B4XdTqcO9b7VuIZx0\"",
    "mtime": "2022-11-20T18:20:03.877Z",
    "size": 41088,
    "path": "../public/api/_content/cache.json"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = [];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  const encodingHeader = String(event.req.headers["accept-encoding"] || "");
  const encodings = encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort().concat([""]);
  if (encodings.length > 1) {
    event.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end();
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end();
      return;
    }
  }
  if (asset.type && !event.res.getHeader("Content-Type")) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.getHeader("ETag")) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.getHeader("Last-Modified")) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  if (asset.encoding && !event.res.getHeader("Content-Encoding")) {
    event.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size && !event.res.getHeader("Content-Length")) {
    event.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const get = (obj, path) => path.split(".").reduce((acc, part) => acc && acc[part], obj);
const _pick = (obj, condition) => Object.keys(obj).filter(condition).reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});
const apply = (fn) => (data) => Array.isArray(data) ? data.map((item) => fn(item)) : fn(data);
const detectProperties = (keys) => {
  const prefixes = [];
  const properties = [];
  for (const key of keys) {
    if (["$", "_"].includes(key)) {
      prefixes.push(key);
    } else {
      properties.push(key);
    }
  }
  return { prefixes, properties };
};
const withoutKeys = (keys = []) => (obj) => {
  if (keys.length === 0 || !obj) {
    return obj;
  }
  const { prefixes, properties } = detectProperties(keys);
  return _pick(obj, (key) => !properties.includes(key) && !prefixes.includes(key[0]));
};
const withKeys = (keys = []) => (obj) => {
  if (keys.length === 0 || !obj) {
    return obj;
  }
  const { prefixes, properties } = detectProperties(keys);
  return _pick(obj, (key) => properties.includes(key) || prefixes.includes(key[0]));
};
const sortList = (data, params) => {
  const comperable = new Intl.Collator(params.$locale, {
    numeric: params.$numeric,
    caseFirst: params.$caseFirst,
    sensitivity: params.$sensitivity
  });
  const keys = Object.keys(params).filter((key) => !key.startsWith("$"));
  for (const key of keys) {
    data = data.sort((a, b) => {
      const values = [get(a, key), get(b, key)].map((value) => {
        if (value === null) {
          return void 0;
        }
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      if (params[key] === -1) {
        values.reverse();
      }
      return comperable.compare(values[0], values[1]);
    });
  }
  return data;
};
const assertArray = (value, message = "Expected an array") => {
  if (!Array.isArray(value)) {
    throw new TypeError(message);
  }
};
const ensureArray = (value) => Array.isArray(value) ? value : value ? [value] : [];

const arrayParams = ["sort", "where", "only", "without"];
const createQuery = (fetcher, intitialParams) => {
  const queryParams = {
    ...intitialParams
  };
  for (const key of arrayParams) {
    if (queryParams[key]) {
      queryParams[key] = ensureArray(queryParams[key]);
    }
  }
  const $set = (key, fn = (v) => v) => {
    return (...values) => {
      queryParams[key] = fn(...values);
      return query;
    };
  };
  const query = {
    params: () => queryParams,
    only: $set("only", ensureArray),
    without: $set("without", ensureArray),
    where: $set("where", (q) => [...ensureArray(queryParams.where), q]),
    sort: $set("sort", (sort) => [...ensureArray(queryParams.sort), ...ensureArray(sort)]),
    limit: $set("limit", (v) => parseInt(String(v), 10)),
    skip: $set("skip", (v) => parseInt(String(v), 10)),
    find: () => fetcher(query),
    findOne: () => {
      queryParams.first = true;
      return fetcher(query);
    },
    findSurround: (surroundQuery, options) => {
      queryParams.surround = { query: surroundQuery, ...options };
      return fetcher(query);
    },
    locale: (_locale) => query.where({ _locale })
  };
  return query;
};

function createMatch(opts = {}) {
  const operators = createOperators(match, opts.operators);
  function match(item, conditions) {
    if (typeof conditions !== "object" || conditions instanceof RegExp) {
      return operators.$eq(item, conditions);
    }
    return Object.keys(conditions || {}).every((key) => {
      const condition = conditions[key];
      if (key.startsWith("$") && operators[key]) {
        const fn = operators[key];
        return typeof fn === "function" ? fn(item, condition) : false;
      }
      return match(get(item, key), condition);
    });
  }
  return match;
}
function createOperators(match, operators = {}) {
  return {
    $match: (item, condition) => match(item, condition),
    $eq: (item, condition) => condition instanceof RegExp ? condition.test(item) : item === condition,
    $ne: (item, condition) => condition instanceof RegExp ? !condition.test(item) : item !== condition,
    $not: (item, condition) => !match(item, condition),
    $and: (item, condition) => {
      assertArray(condition, "$and requires an array as condition");
      return condition.every((cond) => match(item, cond));
    },
    $or: (item, condition) => {
      assertArray(condition, "$or requires an array as condition");
      return condition.some((cond) => match(item, cond));
    },
    $in: (item, condition) => ensureArray(condition).some(
      (cond) => Array.isArray(item) ? match(item, { $contains: cond }) : match(item, cond)
    ),
    $contains: (item, condition) => {
      item = Array.isArray(item) ? item : String(item);
      return ensureArray(condition).every((i) => item.includes(i));
    },
    $icontains: (item, condition) => {
      if (typeof condition !== "string") {
        throw new TypeError("$icontains requires a string, use $contains instead");
      }
      item = String(item).toLocaleLowerCase();
      return ensureArray(condition).every((i) => item.includes(i.toLocaleLowerCase()));
    },
    $containsAny: (item, condition) => {
      assertArray(condition, "$containsAny requires an array as condition");
      item = Array.isArray(item) ? item : String(item);
      return condition.some((i) => item.includes(i));
    },
    $exists: (item, condition) => condition ? typeof item !== "undefined" : typeof item === "undefined",
    $type: (item, condition) => typeof item === String(condition),
    $regex: (item, condition) => {
      if (!(condition instanceof RegExp)) {
        const matched = String(condition).match(/\/(.*)\/([dgimsuy]*)$/);
        condition = matched ? new RegExp(matched[1], matched[2] || "") : new RegExp(condition);
      }
      return condition.test(String(item || ""));
    },
    $lt: (item, condition) => {
      return item < condition;
    },
    $lte: (item, condition) => {
      return item <= condition;
    },
    $gt: (item, condition) => {
      return item > condition;
    },
    $gte: (item, condition) => {
      return item >= condition;
    },
    ...operators || {}
  };
}

function createPipelineFetcher(getContentsList) {
  const match = createMatch();
  const surround = (data, { query, before, after }) => {
    const matchQuery = typeof query === "string" ? { _path: query } : query;
    const index = data.findIndex((item) => match(item, matchQuery));
    before = before || 1;
    after = after || 1;
    const slice = new Array(before + after).fill(null, 0);
    return index === -1 ? slice : slice.map((_, i) => data[index - before + i + Number(i >= before)] || null);
  };
  const pipelines = [
    (data, params) => data.filter((item) => ensureArray(params.where).every((matchQuery) => match(item, matchQuery))),
    (data, params) => ensureArray(params.sort).forEach((options) => sortList(data, options)),
    (data, params) => params.surround ? surround(data, params.surround) : data,
    (data, params) => params.skip ? data.slice(params.skip) : data,
    (data, params) => params.limit ? data.slice(0, params.limit) : data,
    (data, params) => apply(withoutKeys(params.without))(data),
    (data, params) => apply(withKeys(params.only))(data)
  ];
  return async (query) => {
    const data = await getContentsList();
    const params = query.params();
    const filteredData = pipelines.reduce(($data, pipe) => pipe($data, params) || $data, data);
    if (params.first) {
      return filteredData[0];
    }
    return filteredData;
  };
}

const defineTransformer = (transformer) => {
  return transformer;
};

function createTokenizer(parser, initialize, from) {
  let point = Object.assign(
    from ? Object.assign({}, from) : {
      line: 1,
      column: 1,
      offset: 0
    },
    {
      _index: 0,
      _bufferIndex: -1
    }
  );
  const columnStart = {};
  const resolveAllConstructs = [];
  let chunks = [];
  let stack = [];
  const effects = {
    consume,
    enter,
    exit,
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    interrupt: constructFactory(onsuccessfulcheck, {
      interrupt: true
    })
  };
  const context = {
    previous: null,
    code: null,
    containerState: {},
    events: [],
    parser,
    sliceStream,
    sliceSerialize,
    now,
    defineSkip,
    write
  };
  let state = initialize.tokenize.call(context, effects);
  if (initialize.resolveAll) {
    resolveAllConstructs.push(initialize);
  }
  return context;
  function write(slice) {
    chunks = push(chunks, slice);
    main();
    if (chunks[chunks.length - 1] !== null) {
      return [];
    }
    addResult(initialize, 0);
    context.events = resolveAll(resolveAllConstructs, context.events, context);
    return context.events;
  }
  function sliceSerialize(token, expandTabs) {
    return serializeChunks(sliceStream(token), expandTabs);
  }
  function sliceStream(token) {
    return sliceChunks(chunks, token);
  }
  function now() {
    return Object.assign({}, point);
  }
  function defineSkip(value) {
    columnStart[value.line] = value.column;
    accountForPotentialSkip();
  }
  function main() {
    let chunkIndex;
    while (point._index < chunks.length) {
      const chunk = chunks[point._index];
      if (typeof chunk === "string") {
        chunkIndex = point._index;
        if (point._bufferIndex < 0) {
          point._bufferIndex = 0;
        }
        while (point._index === chunkIndex && point._bufferIndex < chunk.length) {
          go(chunk.charCodeAt(point._bufferIndex));
        }
      } else {
        go(chunk);
      }
    }
  }
  function go(code) {
    state = state(code);
  }
  function consume(code) {
    if (markdownLineEnding(code)) {
      point.line++;
      point.column = 1;
      point.offset += code === -3 ? 2 : 1;
      accountForPotentialSkip();
    } else if (code !== -1) {
      point.column++;
      point.offset++;
    }
    if (point._bufferIndex < 0) {
      point._index++;
    } else {
      point._bufferIndex++;
      if (point._bufferIndex === chunks[point._index].length) {
        point._bufferIndex = -1;
        point._index++;
      }
    }
    context.previous = code;
  }
  function enter(type, fields) {
    const token = fields || {};
    token.type = type;
    token.start = now();
    context.events.push(["enter", token, context]);
    stack.push(token);
    return token;
  }
  function exit(type) {
    const token = stack.pop();
    token.end = now();
    context.events.push(["exit", token, context]);
    return token;
  }
  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from);
  }
  function onsuccessfulcheck(_, info) {
    info.restore();
  }
  function constructFactory(onreturn, fields) {
    return hook;
    function hook(constructs, returnState, bogusState) {
      let listOfConstructs;
      let constructIndex;
      let currentConstruct;
      let info;
      return Array.isArray(constructs) ? handleListOfConstructs(constructs) : "tokenize" in constructs ? handleListOfConstructs([constructs]) : handleMapOfConstructs(constructs);
      function handleMapOfConstructs(map) {
        return start;
        function start(code) {
          const def = code !== null && map[code];
          const all = code !== null && map.null;
          const list = [
            ...Array.isArray(def) ? def : def ? [def] : [],
            ...Array.isArray(all) ? all : all ? [all] : []
          ];
          return handleListOfConstructs(list)(code);
        }
      }
      function handleListOfConstructs(list) {
        listOfConstructs = list;
        constructIndex = 0;
        if (list.length === 0) {
          return bogusState;
        }
        return handleConstruct(list[constructIndex]);
      }
      function handleConstruct(construct) {
        return start;
        function start(code) {
          info = store();
          currentConstruct = construct;
          if (!construct.partial) {
            context.currentConstruct = construct;
          }
          if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) {
            return nok();
          }
          return construct.tokenize.call(
            fields ? Object.assign(Object.create(context), fields) : context,
            effects,
            ok,
            nok
          )(code);
        }
      }
      function ok(code) {
        onreturn(currentConstruct, info);
        return returnState;
      }
      function nok(code) {
        info.restore();
        if (++constructIndex < listOfConstructs.length) {
          return handleConstruct(listOfConstructs[constructIndex]);
        }
        return bogusState;
      }
    }
  }
  function addResult(construct, from2) {
    if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
      resolveAllConstructs.push(construct);
    }
    if (construct.resolve) {
      splice(
        context.events,
        from2,
        context.events.length - from2,
        construct.resolve(context.events.slice(from2), context)
      );
    }
    if (construct.resolveTo) {
      context.events = construct.resolveTo(context.events, context);
    }
  }
  function store() {
    const startPoint = now();
    const startPrevious = context.previous;
    const startCurrentConstruct = context.currentConstruct;
    const startEventsIndex = context.events.length;
    const startStack = Array.from(stack);
    return {
      restore,
      from: startEventsIndex
    };
    function restore() {
      point = startPoint;
      context.previous = startPrevious;
      context.currentConstruct = startCurrentConstruct;
      context.events.length = startEventsIndex;
      stack = startStack;
      accountForPotentialSkip();
    }
  }
  function accountForPotentialSkip() {
    if (point.line in columnStart && point.column < 2) {
      point.column = columnStart[point.line];
      point.offset += columnStart[point.line] - 1;
    }
  }
}
function sliceChunks(chunks, token) {
  const startIndex = token.start._index;
  const startBufferIndex = token.start._bufferIndex;
  const endIndex = token.end._index;
  const endBufferIndex = token.end._bufferIndex;
  let view;
  if (startIndex === endIndex) {
    view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
  } else {
    view = chunks.slice(startIndex, endIndex);
    if (startBufferIndex > -1) {
      view[0] = view[0].slice(startBufferIndex);
    }
    if (endBufferIndex > 0) {
      view.push(chunks[endIndex].slice(0, endBufferIndex));
    }
  }
  return view;
}
function serializeChunks(chunks, expandTabs) {
  let index = -1;
  const result = [];
  let atTab;
  while (++index < chunks.length) {
    const chunk = chunks[index];
    let value;
    if (typeof chunk === "string") {
      value = chunk;
    } else
      switch (chunk) {
        case -5: {
          value = "\r";
          break;
        }
        case -4: {
          value = "\n";
          break;
        }
        case -3: {
          value = "\r\n";
          break;
        }
        case -2: {
          value = expandTabs ? " " : "	";
          break;
        }
        case -1: {
          if (!expandTabs && atTab)
            continue;
          value = " ";
          break;
        }
        default: {
          value = String.fromCharCode(chunk);
        }
      }
    atTab = chunk === -2;
    result.push(value);
  }
  return result.join("");
}

function initializeDocument(effects) {
  const self = this;
  const delimiter = (this.parser.delimiter || ",").charCodeAt(0);
  return enterRow;
  function enterRow(code) {
    return effects.attempt(
      { tokenize: attemptLastLine },
      (code2) => {
        effects.consume(code2);
        return enterRow;
      },
      (code2) => {
        effects.enter("row");
        return enterColumn(code2);
      }
    )(code);
  }
  function enterColumn(code) {
    effects.enter("column");
    return content(code);
  }
  function content(code) {
    if (code === null) {
      effects.exit("column");
      effects.exit("row");
      effects.consume(code);
      return content;
    }
    if (code === 34) {
      return quotedData(code);
    }
    if (code === delimiter) {
      if (self.previous === delimiter || markdownLineEnding(self.previous) || self.previous === null) {
        effects.enter("data");
        effects.exit("data");
      }
      effects.exit("column");
      effects.enter("columnSeparator");
      effects.consume(code);
      effects.exit("columnSeparator");
      effects.enter("column");
      return content;
    }
    if (markdownLineEnding(code)) {
      effects.exit("column");
      effects.enter("newline");
      effects.consume(code);
      effects.exit("newline");
      effects.exit("row");
      return enterRow;
    }
    return data(code);
  }
  function data(code) {
    effects.enter("data");
    return dataChunk(code);
  }
  function dataChunk(code) {
    if (code === null || markdownLineEnding(code) || code === delimiter) {
      effects.exit("data");
      return content(code);
    }
    if (code === 92) {
      return escapeCharacter(code);
    }
    effects.consume(code);
    return dataChunk;
  }
  function escapeCharacter(code) {
    effects.consume(code);
    return function(code2) {
      effects.consume(code2);
      return content;
    };
  }
  function quotedData(code) {
    effects.enter("quotedData");
    effects.enter("quotedDataChunk");
    effects.consume(code);
    return quotedDataChunk;
  }
  function quotedDataChunk(code) {
    if (code === 92) {
      return escapeCharacter(code);
    }
    if (code === 34) {
      return effects.attempt(
        { tokenize: attemptDoubleQuote },
        (code2) => {
          effects.exit("quotedDataChunk");
          effects.enter("quotedDataChunk");
          return quotedDataChunk(code2);
        },
        (code2) => {
          effects.consume(code2);
          effects.exit("quotedDataChunk");
          effects.exit("quotedData");
          return content;
        }
      )(code);
    }
    effects.consume(code);
    return quotedDataChunk;
  }
}
function attemptDoubleQuote(effects, ok, nok) {
  return startSequence;
  function startSequence(code) {
    if (code !== 34) {
      return nok(code);
    }
    effects.enter("quoteFence");
    effects.consume(code);
    return sequence;
  }
  function sequence(code) {
    if (code !== 34) {
      return nok(code);
    }
    effects.consume(code);
    effects.exit("quoteFence");
    return (code2) => ok(code2);
  }
}
function attemptLastLine(effects, ok, nok) {
  return enterLine;
  function enterLine(code) {
    if (!markdownSpace(code) && code !== null) {
      return nok(code);
    }
    effects.enter("emptyLine");
    return continueLine(code);
  }
  function continueLine(code) {
    if (markdownSpace(code)) {
      effects.consume(code);
      return continueLine;
    }
    if (code === null) {
      effects.exit("emptyLine");
      return ok(code);
    }
    return nok(code);
  }
}
const parse$1 = (options) => {
  return createTokenizer(
    { ...options },
    { tokenize: initializeDocument },
    void 0
  );
};

const own = {}.hasOwnProperty;
const initialPoint = {
  line: 1,
  column: 1,
  offset: 0
};
const fromCSV = function(value, encoding, options) {
  if (typeof encoding !== "string") {
    options = encoding;
    encoding = void 0;
  }
  return compiler$1()(
    postprocess(
      parse$1(options).write(preprocess()(value, encoding, true))
    )
  );
};
function compiler$1() {
  const config = {
    enter: {
      column: opener(openColumn),
      row: opener(openRow),
      data: onenterdata,
      quotedData: onenterdata
    },
    exit: {
      row: closer(),
      column: closer(),
      data: onexitdata,
      quotedData: onexitQuotedData
    }
  };
  return compile;
  function compile(events) {
    const tree = {
      type: "root",
      children: []
    };
    const stack = [tree];
    const tokenStack = [];
    const context = {
      stack,
      tokenStack,
      config,
      enter,
      exit,
      resume
    };
    let index = -1;
    while (++index < events.length) {
      const handler = config[events[index][0]];
      if (own.call(handler, events[index][1].type)) {
        handler[events[index][1].type].call(
          Object.assign(
            {
              sliceSerialize: events[index][2].sliceSerialize
            },
            context
          ),
          events[index][1]
        );
      }
    }
    if (tokenStack.length > 0) {
      const tail = tokenStack[tokenStack.length - 1];
      const handler = tail[1] || defaultOnError;
      handler.call(context, void 0, tail[0]);
    }
    tree.position = {
      start: point(
        events.length > 0 ? events[0][1].start : initialPoint
      ),
      end: point(
        events.length > 0 ? events[events.length - 2][1].end : initialPoint
      )
    };
    return tree;
  }
  function point(d) {
    return {
      line: d.line,
      column: d.column,
      offset: d.offset
    };
  }
  function opener(create, and) {
    return open;
    function open(token) {
      enter.call(this, create(token), token);
      if (and) {
        and.call(this, token);
      }
    }
  }
  function enter(node, token, errorHandler) {
    const parent = this.stack[this.stack.length - 1];
    parent.children.push(node);
    this.stack.push(node);
    this.tokenStack.push([token, errorHandler]);
    node.position = {
      start: point(token.start)
    };
    return node;
  }
  function closer(and) {
    return close;
    function close(token) {
      if (and) {
        and.call(this, token);
      }
      exit.call(this, token);
    }
  }
  function exit(token, onExitError) {
    const node = this.stack.pop();
    const open = this.tokenStack.pop();
    if (!open) {
      throw new Error(
        "Cannot close `" + token.type + "` (" + stringifyPosition({
          start: token.start,
          end: token.end
        }) + "): it\u2019s not open"
      );
    } else if (open[0].type !== token.type) {
      if (onExitError) {
        onExitError.call(this, token, open[0]);
      } else {
        const handler = open[1] || defaultOnError;
        handler.call(this, token, open[0]);
      }
    }
    node.position.end = point(token.end);
    return node;
  }
  function resume() {
    return toString(this.stack.pop());
  }
  function onenterdata(token) {
    const parent = this.stack[this.stack.length - 1];
    let tail = parent.children[parent.children.length - 1];
    if (!tail || tail.type !== "text") {
      tail = text();
      tail.position = {
        start: point(token.start)
      };
      parent.children.push(tail);
    }
    this.stack.push(tail);
  }
  function onexitdata(token) {
    const tail = this.stack.pop();
    tail.value += this.sliceSerialize(token).trim().replace(/""/g, '"');
    tail.position.end = point(token.end);
  }
  function onexitQuotedData(token) {
    const tail = this.stack.pop();
    const value = this.sliceSerialize(token);
    tail.value += this.sliceSerialize(token).trim().substring(1, value.length - 1).replace(/""/g, '"');
    tail.position.end = point(token.end);
  }
  function text() {
    return {
      type: "text",
      value: ""
    };
  }
  function openColumn() {
    return {
      type: "column",
      children: []
    };
  }
  function openRow() {
    return {
      type: "row",
      children: []
    };
  }
}
function defaultOnError(left, right) {
  if (left) {
    throw new Error(
      "Cannot close `" + left.type + "` (" + stringifyPosition({
        start: left.start,
        end: left.end
      }) + "): a different token (`" + right.type + "`, " + stringifyPosition({
        start: right.start,
        end: right.end
      }) + ") is open"
    );
  } else {
    throw new Error(
      "Cannot close document, a token (`" + right.type + "`, " + stringifyPosition({
        start: right.start,
        end: right.end
      }) + ") is still open"
    );
  }
}

function csvParse(options) {
  const parser = (doc) => {
    return fromCSV(doc, options);
  };
  Object.assign(this, { Parser: parser });
  const toJsonObject = (tree) => {
    const [header, ...rows] = tree.children;
    const columns = header.children.map((col) => col.children[0].value);
    const data = rows.map((row) => {
      return row.children.reduce((acc, col, i) => {
        acc[String(columns[i])] = col.children[0]?.value;
        return acc;
      }, {});
    });
    return data;
  };
  const toJsonArray = (tree) => {
    const data = tree.children.map((row) => {
      return row.children.map((col) => col.children[0]?.value);
    });
    return data;
  };
  const compiler = (doc) => {
    if (options.json) {
      return toJsonObject(doc);
    }
    return toJsonArray(doc);
  };
  Object.assign(this, { Compiler: compiler });
}
const csv = defineTransformer({
  name: "csv",
  extensions: [".csv"],
  parse: async (_id, content, options = {}) => {
    const stream = unified().use(csvParse, {
      delimiter: ",",
      json: true,
      ...options
    });
    const { result } = await stream.process(content);
    return {
      _id,
      _type: "csv",
      body: result
    };
  }
});

function flattenNodeText(node) {
  if (node.type === "text") {
    return node.value || "";
  } else {
    return (node.children || []).reduce((text, child) => {
      return text.concat(flattenNodeText(child));
    }, "");
  }
}
function flattenNode(node, maxDepth = 2, _depth = 0) {
  if (!Array.isArray(node.children) || _depth === maxDepth) {
    return [node];
  }
  return [
    node,
    ...node.children.reduce((acc, child) => acc.concat(flattenNode(child, maxDepth, _depth + 1)), [])
  ];
}

const TOC_TAGS = ["h2", "h3", "h4", "h5", "h6"];
const TOC_TAGS_DEPTH = TOC_TAGS.reduce((tags, tag) => {
  tags[tag] = Number(tag.charAt(tag.length - 1));
  return tags;
}, {});
const getHeaderDepth = (node) => TOC_TAGS_DEPTH[node.tag];
const getTocTags = (depth) => {
  if (depth < 1 || depth > 5) {
    console.log(`\`toc.depth\` is set to ${depth}. It should be a number between 1 and 5. `);
    depth = 1;
  }
  return TOC_TAGS.slice(0, depth);
};
function nestHeaders(headers) {
  if (headers.length <= 1) {
    return headers;
  }
  const toc = [];
  let parent;
  headers.forEach((header) => {
    if (!parent || header.depth <= parent.depth) {
      header.children = [];
      parent = header;
      toc.push(header);
    } else {
      parent.children.push(header);
    }
  });
  toc.forEach((header) => {
    if (header.children?.length) {
      header.children = nestHeaders(header.children);
    } else {
      delete header.children;
    }
  });
  return toc;
}
function generateFlatToc(body, options) {
  const { searchDepth, depth, title = "" } = options;
  const tags = getTocTags(depth);
  const headers = flattenNode(body, searchDepth).filter((node) => tags.includes(node.tag || ""));
  const links = headers.map((node) => ({
    id: node.props?.id,
    depth: getHeaderDepth(node),
    text: flattenNodeText(node)
  }));
  return {
    title,
    searchDepth,
    depth,
    links
  };
}
function generateToc(body, options) {
  const toc = generateFlatToc(body, options);
  toc.links = nestHeaders(toc.links);
  return toc;
}

function emphasis(h, node) {
  return h(node, "em", node.attributes, all(h, node));
}

function parseThematicBlock(lang) {
  if (!lang) {
    return {
      language: void 0,
      highlights: void 0,
      fileName: void 0
    };
  }
  const language = lang.replace(/[{|[](.+)/, "").match(/^[^ \t]+(?=[ \t]|$)/);
  const highlightTokens = lang.match(/{([^}]+)}/);
  const filenameTokens = lang.match(/\[(.+)\]/);
  return {
    language: language ? language[0] : void 0,
    highlights: parseHighlightedLines(highlightTokens && highlightTokens[1]),
    filename: Array.isArray(filenameTokens) ? filenameTokens[1] : void 0
  };
}
function parseHighlightedLines(lines) {
  const lineArray = String(lines || "").split(",").filter(Boolean).flatMap((line) => {
    const [start, end] = line.trim().split("-").map((a) => Number(a.trim()));
    return Array.from({ length: (end || start) - start + 1 }).map((_, i) => start + i);
  });
  return lineArray.length ? lineArray : void 0;
}
const TAG_NAME_REGEXP = /^<\/?([A-Za-z0-9-_]+) ?[^>]*>/;
function getTagName(value) {
  const result = String(value).match(TAG_NAME_REGEXP);
  return result && result[1];
}
function wrap(nodes, loose = false) {
  const result = [];
  let index = -1;
  if (loose) {
    result.push(u("text", "\n"));
  }
  while (++index < nodes.length) {
    if (index) {
      result.push(u("text", "\n"));
    }
    result.push(nodes[index]);
  }
  if (loose && nodes.length > 0) {
    result.push(u("text", "\n"));
  }
  return result;
}

const code = (h, node) => {
  const lang = (node.lang || "") + " " + (node.meta || "");
  const { language, highlights, filename } = parseThematicBlock(lang);
  const code = node.value ? detab(node.value + "\n") : "";
  return h(
    node.position,
    "code",
    {
      language,
      filename,
      highlights,
      code
    },
    [h(node, "pre", {}, [h(node, "code", { __ignoreMap: "" }, [u("text", code)])])]
  );
};

function html(h, node) {
  const tagName = getTagName(node.value);
  if (tagName && /[A-Z]/.test(tagName)) {
    node.value = node.value.replace(tagName, kebabCase(tagName));
  }
  if (tagName === "code") {
    node.value = node.value.replace(tagName, "code-inline");
  }
  return h.dangerous ? h.augment(node, u("raw", node.value)) : null;
}

function heading(h, node) {
  return h(node, "h" + node.depth, all(h, node));
}

const SEMVER_REGEX = /^(\d+)(\.\d+)*(\.x)?$/;
const describeId = (_id) => {
  const [_source, ...parts] = _id.split(":");
  const [, filename, _extension] = parts[parts.length - 1].match(/(.*)\.([^.]+)$/);
  parts[parts.length - 1] = filename;
  const _path = parts.join("/");
  return {
    _source,
    _path,
    _extension,
    _file: _extension ? `${_path}.${_extension}` : _path
  };
};
const pathMeta = defineTransformer({
  name: "path-meta",
  extensions: [".*"],
  transform(content, options = {}) {
    const { locales = [], defaultLocale = "en" } = options;
    const { _source, _file, _path, _extension } = describeId(content._id);
    const parts = _path.split("/");
    const _locale = locales.includes(parts[0]) ? parts.shift() : defaultLocale;
    const filePath = generatePath(parts.join("/"));
    return {
      _path: filePath,
      _dir: filePath.split("/").slice(-2)[0],
      _draft: isDraft(_path),
      _partial: isPartial(_path),
      _locale,
      ...content,
      title: content.title || generateTitle(refineUrlPart(parts[parts.length - 1])),
      _source,
      _file,
      _extension
    };
  }
});
const isDraft = (path) => !!path.match(/\.draft(\/|\.|$)/);
const isPartial = (path) => path.split(/[:/]/).some((part) => part.match(/^_.*/));
const generatePath = (path, { forceLeadingSlash = true } = {}) => {
  path = path.split("/").map((part) => slugify(refineUrlPart(part), { lower: true })).join("/");
  return forceLeadingSlash ? withLeadingSlash(withoutTrailingSlash(path)) : path;
};
const generateTitle = (path) => path.split(/[\s-]/g).map(pascalCase).join(" ");
function refineUrlPart(name) {
  name = name.split(/[/:]/).pop();
  if (SEMVER_REGEX.test(name)) {
    return name;
  }
  return name.replace(/(\d+\.)?(.*)/, "$2").replace(/^index(\.draft)?$/, "").replace(/\.draft$/, "");
}

function link(h, node) {
  const props = {
    ...node.attributes || {},
    href: encode(normalizeLink(node.url))
  };
  if (node.title !== null && node.title !== void 0) {
    props.title = node.title;
  }
  return h(node, "a", props, all(h, node));
}
function normalizeLink(link2) {
  if (link2.endsWith(".md") && (isRelative(link2) || !/^https?/.test(link2) && !link2.startsWith("/"))) {
    return generatePath(link2.replace(/\.md$/, ""), { forceLeadingSlash: false });
  } else {
    return link2;
  }
}

function list(h, node) {
  const props = {};
  const name = `${node.ordered ? "ol" : "ul"}`;
  if (typeof node.start === "number" && node.start !== 1) {
    props.start = node.start;
  }
  if ((node.children || []).some((child) => typeof child.checked === "boolean")) {
    props.className = ["contains-task-list"];
  }
  return h(node, name, props, wrap(all(h, node), true));
}

function listItem(h, node, parent) {
  const result = all(h, node);
  const loose = parent ? listLoose(parent) : listItemLoose(node);
  const props = {};
  let wrapped = [];
  let index;
  let child;
  if (typeof node.checked === "boolean") {
    result.unshift(
      h({}, "input", {
        type: "checkbox",
        checked: node.checked,
        disabled: true
      })
    );
    props.className = ["task-list-item"];
  }
  const length = result.length;
  index = -1;
  while (++index < length) {
    child = result[index];
    if (child.tagName === "p" && !loose) {
      wrapped = wrapped.concat(child.children || []);
    } else {
      wrapped.push(child);
    }
  }
  return h(node, "li", props, wrapped);
}
function listLoose(node) {
  let loose = node.spread;
  const children = node.children;
  const length = children.length;
  let index = -1;
  while (!loose && ++index < length) {
    loose = listItemLoose(children[index]);
  }
  return loose;
}
function listItemLoose(node) {
  const spread = node.spread;
  const children = node.children || [];
  return spread === void 0 || spread === null ? children.length > 1 : spread;
}

function table(h, node) {
  const rows = node.children;
  const align = node.align || [];
  const result = rows.map((row, index) => {
    const childres = row.children;
    const name = index === 0 ? "th" : "td";
    let pos = node.align ? align.length : childres.length;
    const out = [];
    while (pos--) {
      const cell = childres[pos];
      out[pos] = h(cell, name, { align: align[pos] }, cell ? all(h, cell) : []);
    }
    return h(row, "tr", wrap(out, true));
  });
  const body = result[1] && h(
    {
      start: position(result[1]).start,
      end: position(result[result.length - 1]).end
    },
    "tbody",
    wrap(result.slice(1), true)
  );
  return h(node, "table", wrap([h(result[0].position, "thead", wrap([result[0]], true))].concat(body || []), true));
}

function paragraph(h, node) {
  if (node.children && node.children[0] && node.children[0].type === "html") {
    const tagName = kebabCase(getTagName(node.children[0].value) || "div");
    if (!htmlTags.includes(tagName)) {
      return all(h, node);
    }
  }
  return h(node, "p", all(h, node));
}

function image(h, node) {
  const props = {
    ...node.attributes,
    src: encode(node.url),
    alt: node.alt
  };
  if (node.title !== null && node.title !== void 0) {
    props.title = node.title;
  }
  return h(node, "img", props);
}

function blockquote(h, node) {
  return h(node, "blockquote", wrap(all(h, node), true));
}

function strong(h, node) {
  return h(node, "strong", node.attributes, all(h, node));
}

function inlineCode(h, node) {
  return h(node, "code-inline", node.attributes, [
    u("text", node.value.replace(/\r?\n|\r/g, " "))
  ]);
}

function thematicBreak(h, node) {
  return h(node, "hr");
}

function containerComponent(h, node) {
  const hast = h(node, node.tagName, node.attributes, all(h, node));
  hast.attributes = node.attributes;
  hast.fmAttributes = node.fmAttributes;
  return hast;
}

const handlers$1 = {
  emphasis,
  code,
  paragraph,
  html,
  link,
  list,
  listItem,
  heading,
  table,
  image,
  blockquote,
  strong,
  inlineCode,
  thematicBreak,
  containerComponent
};

function compiler(_options) {
  function parseAsJSON(node) {
    if (Array.isArray(node)) {
      return node.map(parseAsJSON).filter(Boolean);
    }
    if (node.type === "element") {
      if (node.tagName === "li") {
        let hasPreviousParagraph = false;
        node.children = node.children.flatMap((child) => {
          if (child.tagName === "p") {
            if (hasPreviousParagraph) {
              child.children.unshift({
                type: "element",
                tagName: "br",
                properties: {}
              });
            }
            hasPreviousParagraph = true;
            return child.children;
          }
          return child;
        });
      }
      if (node.tagName === "component-slot") {
        node.tagName = "template";
      }
      return {
        type: "element",
        tag: node.tagName,
        props: node.properties,
        children: parseAsJSON(node.children || [])
      };
    }
    if (node.type === "text") {
      if (node.value === "\n") {
        return null;
      }
      return {
        type: "text",
        value: node.value
      };
    }
    if (node.type === "comment") {
      return null;
    }
    node.children = parseAsJSON(node.children || []);
    return node;
  }
  this.Compiler = function(root) {
    return {
      type: "root",
      children: parseAsJSON(root.children || [])
    };
  };
}

function isTag(vnode, tag) {
  if (vnode.type === tag) {
    return true;
  }
  if (typeof vnode.type === "object" && vnode.type.tag === tag) {
    return true;
  }
  if (vnode.tag === tag) {
    return true;
  }
  return false;
}
function isText(vnode) {
  return isTag(vnode, "text") || typeof vnode.children === "string";
}
function nodeChildren(node) {
  if (Array.isArray(node.children) || typeof node.children === "string") {
    return node.children;
  }
  if (typeof node.children.default === "function") {
    return node.children.default();
  }
  return [];
}
function nodeTextContent(node) {
  if (!node) {
    return "";
  }
  if (Array.isArray(node)) {
    return node.map(nodeTextContent).join("");
  }
  if (isText(node)) {
    return node.children || node.value;
  }
  const children = nodeChildren(node);
  if (Array.isArray(children)) {
    return children.map(nodeTextContent).join("");
  }
  return "";
}

const usePlugins = (plugins, stream) => {
  for (const plugin of Object.values(plugins)) {
    if (plugin) {
      const { instance, ...options } = plugin;
      stream.use(instance, options);
    }
  }
};
function generateBody(content, options) {
  const rehypeOptions = {
    handlers: handlers$1,
    allowDangerousHtml: true
  };
  return new Promise((resolve, reject) => {
    const stream = unified().use(remarkParse);
    if (options.mdc) {
      stream.use(remarkMDC);
    }
    usePlugins(options.remarkPlugins, stream);
    stream.use(remark2rehype, rehypeOptions);
    usePlugins(options.rehypePlugins, stream);
    stream.use(compiler, options);
    stream.process(
      {
        value: content,
        data: options.data
      },
      (error, file) => {
        if (error) {
          return reject(error);
        }
        Object.assign(options.data, file?.data || {});
        resolve(file?.result);
      }
    );
  });
}
function contentHeading(body) {
  let title = "";
  let description = "";
  const children = body.children.filter((node) => node.type !== "text" && node.tag !== "hr");
  if (children.length && children[0].tag === "h1") {
    const node = children.shift();
    title = nodeTextContent(node);
  }
  if (children.length && children[0].tag === "p") {
    const node = children.shift();
    description = nodeTextContent(node);
  }
  return {
    title,
    description
  };
}

const useDefaultOptions = () => ({
  mdc: true,
  toc: {
    depth: 2,
    searchDepth: 2
  },
  tags: {},
  remarkPlugins: {
    "remark-emoji": {
      instance: remarkEmoji
    },
    "remark-squeeze-paragraphs": {
      instance: remarkSqueezeParagraphs
    },
    "remark-gfm": {
      instance: remarkGfm
    }
  },
  rehypePlugins: {
    "rehype-slug": {
      instance: rehypeSlug
    },
    "rehype-external-links": {
      instance: rehypeExternalLinks
    },
    "rehype-sort-attribute-values": {
      instance: rehypeSortAttributeValues
    },
    "rehype-sort-attributes": {
      instance: rehypeSortAttributes
    },
    "rehype-raw": {
      instance: rehypeRaw,
      passThrough: ["element"]
    }
  }
});
async function parse(file, userOptions = {}) {
  const options = defu(userOptions, useDefaultOptions());
  const { content, data } = await parseFrontMatter(file);
  const body = await generateBody(content, { ...options, data });
  let toc;
  if (data.toc !== false) {
    const tocOption = defu(data.toc || {}, options.toc);
    toc = generateToc(body, tocOption);
  }
  const excerptString = useExcerpt(content);
  const excerpt = excerptString ? await generateBody(excerptString, { ...options, data }) : void 0;
  const heading = contentHeading(body);
  return {
    body: {
      ...body,
      toc
    },
    meta: {
      _empty: content.trim().length === 0,
      title: heading.title,
      description: heading.description,
      excerpt,
      ...data
    }
  };
}
function useExcerpt(content, delimiter = /<!--\s*?more\s*?-->/i) {
  if (!delimiter) {
    return "";
  }
  let idx = -1;
  const match = delimiter.exec(content);
  if (match) {
    idx = match.index;
  }
  if (idx !== -1) {
    return content.slice(0, idx);
  }
  return content;
}

const markdown = defineTransformer({
  name: "markdown",
  extensions: [".md"],
  parse: async (_id, content, options = {}) => {
    const config = { ...options };
    config.rehypePlugins = await importPlugins(config.rehypePlugins);
    config.remarkPlugins = await importPlugins(config.remarkPlugins);
    const parsed = await parse(content, config);
    return {
      ...parsed.meta,
      body: parsed.body,
      _type: "markdown",
      _id
    };
  }
});
async function importPlugins(plugins = {}) {
  const resolvedPlugins = {};
  for (const [name, plugin] of Object.entries(plugins)) {
    if (plugin) {
      resolvedPlugins[name] = {
        instance: plugin.instance || await import(
          /* @vite-ignore */
          name
        ).then((m) => m.default || m),
        ...plugin
      };
    } else {
      resolvedPlugins[name] = false;
    }
  }
  return resolvedPlugins;
}

const yaml = defineTransformer({
  name: "Yaml",
  extensions: [".yml", ".yaml"],
  parse: async (_id, content) => {
    const { data } = await parseFrontMatter(`---
${content}
---`);
    let parsed = data;
    if (Array.isArray(data)) {
      console.warn(`YAML array is not supported in ${_id}, moving the array into the \`body\` key`);
      parsed = { body: data };
    }
    return {
      ...parsed,
      _id,
      _type: "yaml"
    };
  }
});

const json = defineTransformer({
  name: "Json",
  extensions: [".json", ".json5"],
  parse: async (_id, content) => {
    let parsed;
    if (typeof content === "string") {
      if (_id.endsWith("json5")) {
        parsed = (await import('json5').then((m) => m.default || m)).parse(content);
      } else if (_id.endsWith("json")) {
        parsed = destr(content);
      }
    } else {
      parsed = content;
    }
    if (Array.isArray(parsed)) {
      console.warn(`JSON array is not supported in ${_id}, moving the array into the \`body\` key`);
      parsed = {
        body: parsed
      };
    }
    return {
      ...parsed,
      _id,
      _type: "json"
    };
  }
});

const TRANSFORMERS = [
  csv,
  markdown,
  json,
  yaml,
  pathMeta
];
function getParser(ext, additionalTransformers = []) {
  let parser = additionalTransformers.find((p) => ext.match(new RegExp(p.extensions.join("|"), "i")) && p.parse);
  if (!parser) {
    parser = TRANSFORMERS.find((p) => ext.match(new RegExp(p.extensions.join("|"), "i")) && p.parse);
  }
  return parser;
}
function getTransformers(ext, additionalTransformers = []) {
  return [
    ...additionalTransformers.filter((p) => ext.match(new RegExp(p.extensions.join("|"), "i")) && p.transform),
    ...TRANSFORMERS.filter((p) => ext.match(new RegExp(p.extensions.join("|"), "i")) && p.transform)
  ];
}
async function transformContent(id, content, options = {}) {
  const { transformers = [] } = options;
  const file = { _id: id, body: content };
  const ext = extname(id);
  const parser = getParser(ext, transformers);
  if (!parser) {
    console.warn(`${ext} files are not supported, "${id}" falling back to raw content`);
    return file;
  }
  const parserOptions = options[camelCase(parser.name)] || {};
  const parsed = await parser.parse(file._id, file.body, parserOptions);
  const matchedTransformers = getTransformers(ext, transformers);
  const result = await matchedTransformers.reduce(async (prev, cur) => {
    const next = await prev || parsed;
    const transformOptions = options[camelCase(cur.name)] || {};
    return cur.transform(next, transformOptions);
  }, Promise.resolve(parsed));
  return result;
}

const isPreview = (event) => {
  const previewToken = getQuery(event).previewToken || getCookie(event, "previewToken");
  return !!previewToken;
};
const getPreview = (event) => {
  const key = getQuery(event).previewToken || getCookie(event, "previewToken");
  return { key };
};

async function getContentIndex(event) {
  let contentIndex = await cacheStorage.getItem("content-index.json");
  if (!contentIndex) {
    const data = await serverQueryContent(event).find();
    contentIndex = data.reduce((acc, item) => {
      if (!acc[item._path]) {
        acc[item._path] = item._id;
      } else if (item._id.startsWith("content:")) {
        acc[item._path] = item._id;
      }
      return acc;
    }, {});
    await cacheStorage.setItem("content-index.json", contentIndex);
  }
  return contentIndex;
}
async function getIndexedContentsList(event, query) {
  const params = query.params();
  const path = params?.where?.find((wh) => wh._path)?._path;
  if (!isPreview(event) && (typeof path === "string" || path instanceof RegExp)) {
    const index = await getContentIndex(event);
    const keys = Object.keys(index).filter((key) => path.test ? path.test(key) : key === String(path)).map((key) => index[key]);
    const contents = await Promise.all(keys.map((key) => getContent(event, key)));
    return contents;
  }
  return getContentsList(event);
}

const transformers = [];

const sourceStorage = prefixStorage(useStorage(), "content:source");
const cacheStorage = prefixStorage(useStorage(), "cache:content");
const cacheParsedStorage = prefixStorage(useStorage(), "cache:content:parsed");
const contentConfig = useRuntimeConfig().content;
const contentIgnores = contentConfig.ignores.map(
  (p) => typeof p === "string" ? new RegExp(`^${p}|:${p}`) : p
);
const invalidKeyCharacters = `'"?#/`.split("");
const contentIgnorePredicate = (key) => {
  if (key.startsWith("preview:") || contentIgnores.some((prefix) => prefix.test(key))) {
    return false;
  }
  if (invalidKeyCharacters.some((ik) => key.includes(ik))) {
    console.warn(`Ignoring [${key}]. File name should not contain any of the following characters: ${invalidKeyCharacters.join(", ")}`);
    return false;
  }
  return true;
};
const getContentsIds = async (event, prefix) => {
  let keys = [];
  {
    keys = await cacheParsedStorage.getKeys(prefix);
  }
  if (keys.length === 0) {
    keys = await sourceStorage.getKeys(prefix);
  }
  if (isPreview(event)) {
    const { key } = getPreview(event);
    const previewPrefix = `preview:${key}:${prefix || ""}`;
    const previewKeys = await sourceStorage.getKeys(previewPrefix);
    if (previewKeys.length) {
      const keysSet = new Set(keys);
      await Promise.all(
        previewKeys.map(async (key2) => {
          const meta = await sourceStorage.getMeta(key2);
          if (meta?.__deleted) {
            keysSet.delete(key2.substring(previewPrefix.length));
          } else {
            keysSet.add(key2.substring(previewPrefix.length));
          }
        })
      );
      keys = Array.from(keysSet);
    }
  }
  return keys.filter(contentIgnorePredicate);
};
const getContentsList = async (event, prefix) => {
  const keys = await getContentsIds(event, prefix);
  const contents = await Promise.all(keys.map((key) => getContent(event, key)));
  return contents;
};
const getContent = async (event, id) => {
  const contentId = id;
  if (!contentIgnorePredicate(id)) {
    return { _id: contentId, body: null };
  }
  if (isPreview(event)) {
    const { key } = getPreview(event);
    const previewId = `preview:${key}:${id}`;
    const draft = await sourceStorage.getItem(previewId);
    if (draft) {
      id = previewId;
    }
  }
  const cached = await cacheParsedStorage.getItem(id);
  if (cached) {
    return cached.parsed;
  }
  const meta = await sourceStorage.getMeta(id);
  const hash$1 = hash({
    meta,
    version: contentConfig.cacheVersion,
    integrity: contentConfig.cacheIntegrity
  });
  if (cached?.hash === hash$1) {
    return cached.parsed;
  }
  const body = await sourceStorage.getItem(id);
  if (body === null) {
    return { _id: contentId, body: null };
  }
  const parsed = await parseContent(contentId, body);
  await cacheParsedStorage.setItem(id, { parsed, hash: hash$1 }).catch(() => {
  });
  return parsed;
};
async function parseContent(id, content, opts = {}) {
  const nitroApp = useNitroApp();
  const options = defu(
    opts,
    {
      markdown: contentConfig.markdown,
      csv: contentConfig.csv,
      yaml: contentConfig.yaml,
      highlight: contentConfig.highlight,
      transformers: transformers,
      pathMeta: {
        defaultLocale: contentConfig.defaultLocale,
        locales: contentConfig.locales
      }
    }
  );
  const file = { _id: id, body: content };
  await nitroApp.hooks.callHook("content:file:beforeParse", file);
  const result = await transformContent(id, file.body, options);
  await nitroApp.hooks.callHook("content:file:afterParse", result);
  return result;
}
const createServerQueryFetch = (event, path) => (query) => {
  if (path) {
    if (query.params().first) {
      query.where({ _path: withoutTrailingSlash(path) });
    } else {
      query.where({ _path: new RegExp(`^${path.replace(/[-[\]{}()*+.,^$\s/]/g, "\\$&")}`) });
    }
  }
  if (!query.params().sort?.length) {
    query.sort({ _file: 1, $numeric: true });
  }
  return createPipelineFetcher(() => getIndexedContentsList(event, query))(query);
};
function serverQueryContent(event, path, ...pathParts) {
  if (typeof path === "string") {
    path = withLeadingSlash(joinURL(path, ...pathParts));
    return createQuery(createServerQueryFetch(event, path));
  }
  return createQuery(createServerQueryFetch(event), path || {});
}

function jsonParse(value) {
  return JSON.parse(value, regExpReviver);
}
function regExpReviver(_key, value) {
  const withOperator = typeof value === "string" && value.match(/^--([A-Z]+) (.+)$/) || [];
  if (withOperator[1] === "REGEX") {
    const regex = withOperator[2].match(/\/(.*)\/([dgimsuy]*)$/);
    return regex ? new RegExp(regex[1], regex[2] || "") : value;
  }
  return value;
}

const parseQueryParams = (body) => {
  try {
    return jsonParse(body);
  } catch (e) {
    throw createError({ statusCode: 400, message: "Invalid _params query" });
  }
};
const memory = {};
const getContentQuery = (event) => {
  const qid = event.context.params.qid?.replace(/.json$/, "");
  const query = getQuery(event) || {};
  if (qid && query._params) {
    memory[qid] = parseQueryParams(query._params);
    return memory[qid];
  }
  if (memory[qid]) {
    return memory[qid];
  }
  if (query._params) {
    return parseQueryParams(query._params);
  }
  if (typeof query.only === "string" && query.only.includes(",")) {
    query.only = query.only.split(",").map((s) => s.trim());
  }
  if (typeof query.without === "string" && query.without.includes(",")) {
    query.without = query.without.split(",").map((s) => s.trim());
  }
  const where = query.where || {};
  for (const key of ["draft", "partial", "empty"]) {
    if (query[key] && ["true", "false"].includes(query[key])) {
      where[key] = query[key] === "true";
      delete query[key];
    }
  }
  if (query.sort) {
    query.sort = query.sort.split(",").map((s) => {
      const [key, order] = s.split(":");
      return [key, +order];
    });
  }
  const reservedKeys = ["partial", "draft", "only", "without", "where", "sort", "limit", "skip"];
  for (const key of Object.keys(query)) {
    if (reservedKeys.includes(key)) {
      continue;
    }
    query.where = query.where || {};
    query.where[key] = query[key];
  }
  if (Object.keys(where).length > 0) {
    query.where = [where];
  } else {
    delete query.where;
  }
  return query;
};

const _wMs4hF = defineEventHandler(async (event) => {
  const query = getContentQuery(event);
  if (query.first) {
    const content = await serverQueryContent(event, query).findOne();
    const path = content?._path || query.where?.find((w) => w._path)?._path;
    if (path) {
      const _dir = await serverQueryContent(event).where({ _path: join(path, "_dir") }).without("_").findOne();
      if (!Array.isArray(_dir)) {
        return {
          _path: path,
          ...content || {},
          _dir
        };
      }
    }
    if (!content) {
      throw createError({
        statusMessage: "Document not found!",
        statusCode: 404,
        data: {
          description: "Could not find document for the given query.",
          query
        }
      });
    }
    return content;
  }
  const contents = await serverQueryContent(event, query).find();
  return contents;
});

const _84GUUP = defineEventHandler(async (event) => {
  const now = Date.now();
  const contents = await serverQueryContent(event).find();
  await getContentIndex(event);
  const navigation = await $fetch("/api/_content/navigation");
  await cacheStorage.setItem("content-navigation.json", navigation);
  return {
    generatedAt: now,
    generateTime: Date.now() - now,
    contents,
    navigation
  };
});

function createNav(contents, configs) {
  const { navigation } = useRuntimeConfig().content;
  const pickNavigationFields = (content) => ({
    ...pick(["title", ...navigation.fields])(content),
    ...isObject(content?.navigation) ? content.navigation : {}
  });
  const nav = contents.sort((a, b) => a._path.localeCompare(b._path)).reduce((nav2, content) => {
    const parts = content._path.substring(1).split("/");
    const idParts = content._id.split(":").slice(1);
    const isIndex = !!idParts[idParts.length - 1].match(/([1-9][0-9]*\.)?index.md/g);
    const getNavItem = (content2) => ({
      title: content2.title,
      _path: content2._path,
      _file: content2._file,
      children: [],
      ...pickNavigationFields(content2),
      ...content2._draft ? { _draft: true } : {}
    });
    const navItem = getNavItem(content);
    if (isIndex) {
      const dirConfig = configs[navItem._path];
      if (typeof dirConfig?.navigation !== "undefined" && !dirConfig?.navigation) {
        return nav2;
      }
      if (content._path !== "/") {
        const indexItem = getNavItem(content);
        navItem.children.push(indexItem);
      }
      Object.assign(
        navItem,
        pickNavigationFields(dirConfig)
      );
    }
    if (parts.length === 1) {
      nav2.push(navItem);
      return nav2;
    }
    const siblings = parts.slice(0, -1).reduce((nodes, part, i) => {
      const currentPathPart = "/" + parts.slice(0, i + 1).join("/");
      const conf = configs[currentPathPart];
      if (typeof conf?.navigation !== "undefined" && !conf.navigation) {
        return [];
      }
      let parent = nodes.find((n) => n._path === currentPathPart);
      if (!parent) {
        parent = {
          title: generateTitle(part),
          _path: currentPathPart,
          _file: content._file,
          children: [],
          ...pickNavigationFields(conf)
        };
        nodes.push(parent);
      }
      return parent.children;
    }, nav2);
    siblings.push(navItem);
    return nav2;
  }, []);
  return sortAndClear(nav);
}
const collator = new Intl.Collator(void 0, { numeric: true, sensitivity: "base" });
function sortAndClear(nav) {
  const sorted = nav.sort((a, b) => collator.compare(a._file, b._file));
  for (const item of sorted) {
    if (item.children.length) {
      sortAndClear(item.children);
    } else {
      delete item.children;
    }
    delete item._file;
  }
  return nav;
}
function pick(keys) {
  return (obj) => {
    obj = obj || {};
    if (keys && keys.length) {
      return keys.filter((key) => typeof obj[key] !== "undefined").reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});
    }
    return obj;
  };
}
function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

const _2Aa1bc = defineEventHandler(async (event) => {
  const query = getContentQuery(event);
  if (!isPreview(event) && Object.keys(query).length === 0) {
    const cache = await cacheStorage.getItem("content-navigation.json");
    if (cache) {
      return cache;
    }
  }
  const contents = await serverQueryContent(event, query).where({
    _partial: false,
    navigation: {
      $ne: false
    }
  }).find();
  const dirConfigs = await serverQueryContent(event).where({ _path: /\/_dir$/i, _partial: true }).find();
  const configs = dirConfigs.reduce((configs2, conf) => {
    if (conf.title.toLowerCase() === "dir") {
      conf.title = void 0;
    }
    const key = conf._path.split("/").slice(0, -1).join("/") || "/";
    configs2[key] = {
      ...conf,
      ...conf.body
    };
    return configs2;
  }, {});
  return createNav(contents, configs);
});

const _lazy_ev4ILT = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_ev4ILT, lazy: true, middleware: false, method: undefined },
  { route: '/api/_content/query/:qid', handler: _wMs4hF, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/query', handler: _wMs4hF, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/cache.json', handler: _84GUUP, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/navigation/:qid', handler: _2Aa1bc, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/navigation', handler: _2Aa1bc, lazy: false, middleware: false, method: "get" },
  { route: '/**', handler: _lazy_ev4ILT, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  h3App.use(config.app.baseURL, timingMiddleware);
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(/\/+/g, "/");
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(h.route.replace(/:\w+|\*\*/g, "_"));
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({ fetch: localFetch, Headers, defaults: { baseURL: config.app.baseURL } });
  globalThis.$fetch = $fetch;
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on("unhandledRejection", (err) => console.error("[nitro] [dev] [unhandledRejection] " + err));
  process.on("uncaughtException", (err) => console.error("[nitro] [dev] [uncaughtException] " + err));
}
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
