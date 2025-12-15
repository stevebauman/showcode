import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import remarkMDC, { parseFrontMatter } from 'remark-mdc';
import remarkGFM from 'remark-gfm';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSortAttributeValues from 'rehype-sort-attribute-values';
import rehypeSortAttributes from 'rehype-sort-attributes';
import rehypeRaw from 'rehype-raw';
import { detab } from 'detab';
import { normalizeUri } from 'micromark-util-sanitize-uri';
import { toString } from 'hast-util-to-string';
import Slugger from 'github-slugger';
import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function isRelative(inputString) {
  return ["./", "../"].some((string_) => inputString.startsWith(string_));
}
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c=class{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _(){return Object.assign(c.prototype,i$1.prototype),Object.assign(c.prototype,l$1.prototype),c}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_();class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i;
createFetch({ fetch, Headers: Headers$1, AbortController });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$2(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$2(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$2(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$3 = "memory";
const memory$1 = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$3,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory$1() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$2(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$2(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$2(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$2(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$2(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$2(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$2(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$2(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$2(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$2(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$2(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$2(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {
  ["nitro:bundled:cache:content:content-index.json"]: {
    import: () => import('../raw/content-index.mjs').then(r => r.default || r),
    meta: {"type":"application/json","etag":"\"43-spqykPKERLLrtTdUXWeMAP0n7Vc\"","mtime":"2025-12-15T04:12:26.901Z"}
  },
  ["nitro:bundled:cache:content:content-navigation.json"]: {
    import: () => import('../raw/content-navigation.mjs').then(r => r.default || r),
    meta: {"type":"application/json","etag":"\"4d-pdC4FmZeR5lpc+F8qr8aUViQ7cc\"","mtime":"2025-12-15T04:12:26.901Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:changelog.md"]: {
    import: () => import('../raw/changelog.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"99e6-SvPP82STHs7unzsGNmlAd0hULe8\"","mtime":"2025-12-15T04:12:26.901Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:help.md"]: {
    import: () => import('../raw/help.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"ddc-x/eDROPWg1jAvGEQuq3B2k2Dte4\"","mtime":"2025-12-15T04:12:26.901Z"}
  }
};

const normalizeKey$1 = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey$1(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey$1(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey$1(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function normalizeKey(key, sep = ":") {
  if (!key) {
    return "";
  }
  return key.replace(/[:/\\]/g, sep).replace(/^[:/\\]|[:/\\]$/g, "");
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME$2 = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME$2, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME$2,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME$2,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const OVERLAY_REMOVED = "__OVERLAY_REMOVED__";
const DRIVER_NAME$1 = "overlay";
const overlay = defineDriver((options) => {
  return {
    name: DRIVER_NAME$1,
    options,
    async hasItem(key, opts) {
      for (const layer of options.layers) {
        if (await layer.hasItem(key, opts)) {
          if (layer === options.layers[0] && await options.layers[0]?.getItem(key) === OVERLAY_REMOVED) {
            return false;
          }
          return true;
        }
      }
      return false;
    },
    async getItem(key) {
      for (const layer of options.layers) {
        const value = await layer.getItem(key);
        if (value === OVERLAY_REMOVED) {
          return null;
        }
        if (value !== null) {
          return value;
        }
      }
      return null;
    },
    // TODO: Support native meta
    // async getMeta (key) {},
    async setItem(key, value, opts) {
      await options.layers[0]?.setItem?.(key, value, opts);
    },
    async removeItem(key, opts) {
      await options.layers[0]?.setItem?.(key, OVERLAY_REMOVED, opts);
    },
    async getKeys(base, opts) {
      const allKeys = await Promise.all(
        options.layers.map(async (layer) => {
          const keys = await layer.getKeys(base, opts);
          return keys.map((key) => normalizeKey(key));
        })
      );
      const uniqueKeys = [...new Set(allKeys.flat())];
      const existingKeys = await Promise.all(
        uniqueKeys.map(async (key) => {
          if (await options.layers[0]?.getItem(key) === OVERLAY_REMOVED) {
            return false;
          }
          return key;
        })
      );
      return existingKeys.filter(Boolean);
    },
    async dispose() {
      await Promise.all(
        options.layers.map(async (layer) => {
          if (layer.dispose) {
            await layer.dispose();
          }
        })
      );
    }
  };
});

const DRIVER_NAME = "memory";
const memory = defineDriver(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

const bundledStorage = ["/cache/content"];
for (const base of bundledStorage) {
  storage.mount(base, overlay({
    layers: [
      memory(),
      // TODO
      // prefixStorage(storage, base),
      prefixStorage(storage, 'assets:nitro:bundled:' + base)
    ]
  }));
}

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
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
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
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
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
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

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function upperFirst(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : "";
}
function lowerFirst(str) {
  return str ? str[0].toLowerCase() + str.slice(1) : "";
}
function pascalCase(str, opts) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => upperFirst(opts?.normalize ? p.toLowerCase() : p)).join("") : "";
}
function camelCase(str, opts) {
  return lowerFirst(pascalCase(str || "", opts));
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner ?? "-") : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "95a62e0f-0253-465d-bae3-8446c1f1edf5",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "isDistributing": true,
    "isDesktop": false,
    "platform": {
      "windows": false,
      "darwin": true,
      "linux": false
    },
    "mdc": {
      "components": {
        "prose": true,
        "map": {
          "p": "prose-p",
          "a": "prose-a",
          "blockquote": "prose-blockquote",
          "code-inline": "prose-code-inline",
          "code": "ProseCodeInline",
          "em": "prose-em",
          "h1": "prose-h1",
          "h2": "prose-h2",
          "h3": "prose-h3",
          "h4": "prose-h4",
          "h5": "prose-h5",
          "h6": "prose-h6",
          "hr": "prose-hr",
          "img": "prose-img",
          "ul": "prose-ul",
          "ol": "prose-ol",
          "li": "prose-li",
          "strong": "prose-strong",
          "table": "prose-table",
          "thead": "prose-thead",
          "tbody": "prose-tbody",
          "td": "prose-td",
          "th": "prose-th",
          "tr": "prose-tr"
        }
      },
      "headings": {
        "anchorLinks": {
          "h1": false,
          "h2": true,
          "h3": true,
          "h4": true,
          "h5": false,
          "h6": false
        }
      }
    },
    "content": {
      "locales": [],
      "defaultLocale": "",
      "integrity": 1765771934696,
      "experimental": {
        "stripQueryParameters": false,
        "advanceQuery": false,
        "clientDB": false
      },
      "respectPathCase": false,
      "api": {
        "baseURL": "/api/_content"
      },
      "navigation": {
        "fields": []
      },
      "tags": {
        "p": "prose-p",
        "a": "prose-a",
        "blockquote": "prose-blockquote",
        "code-inline": "prose-code-inline",
        "code": "ProseCodeInline",
        "em": "prose-em",
        "h1": "prose-h1",
        "h2": "prose-h2",
        "h3": "prose-h3",
        "h4": "prose-h4",
        "h5": "prose-h5",
        "h6": "prose-h6",
        "hr": "prose-hr",
        "img": "prose-img",
        "ul": "prose-ul",
        "ol": "prose-ol",
        "li": "prose-li",
        "strong": "prose-strong",
        "table": "prose-table",
        "thead": "prose-thead",
        "tbody": "prose-tbody",
        "td": "prose-td",
        "th": "prose-th",
        "tr": "prose-tr"
      },
      "highlight": false,
      "wsUrl": "",
      "documentDriven": false,
      "host": "",
      "trailingSlash": false,
      "search": "",
      "contentHead": true,
      "anchorLinks": {
        "depth": 4,
        "exclude": [
          1
        ]
      }
    }
  },
  "content": {
    "cacheVersion": 2,
    "cacheIntegrity": "dLYeSFVwsx",
    "transformers": [],
    "base": "",
    "api": {
      "baseURL": "/api/_content"
    },
    "watch": {
      "ws": {
        "port": {
          "port": 4000,
          "portRange": [
            4000,
            4040
          ]
        },
        "hostname": "localhost",
        "showURL": false
      }
    },
    "sources": {},
    "ignores": [],
    "locales": [],
    "defaultLocale": "",
    "highlight": false,
    "markdown": {
      "tags": {
        "p": "prose-p",
        "a": "prose-a",
        "blockquote": "prose-blockquote",
        "code-inline": "prose-code-inline",
        "code": "ProseCodeInline",
        "em": "prose-em",
        "h1": "prose-h1",
        "h2": "prose-h2",
        "h3": "prose-h3",
        "h4": "prose-h4",
        "h5": "prose-h5",
        "h6": "prose-h6",
        "hr": "prose-hr",
        "img": "prose-img",
        "ul": "prose-ul",
        "ol": "prose-ol",
        "li": "prose-li",
        "strong": "prose-strong",
        "table": "prose-table",
        "thead": "prose-thead",
        "tbody": "prose-tbody",
        "td": "prose-td",
        "th": "prose-th",
        "tr": "prose-tr"
      },
      "anchorLinks": {
        "depth": 4,
        "exclude": [
          1
        ]
      },
      "remarkPlugins": {},
      "rehypePlugins": {}
    },
    "yaml": {},
    "csv": {
      "delimeter": ",",
      "json": true
    },
    "navigation": {
      "fields": []
    },
    "contentHead": true,
    "documentDriven": false,
    "respectPathCase": false,
    "experimental": {
      "clientDB": false,
      "cacheContents": true,
      "stripQueryParameters": false,
      "advanceQuery": false,
      "search": ""
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await import('../_/error-500.mjs');
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const plugins = [
  
];

const assets = {
  "/.DS_Store": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"2804-WhIG4olMQLa7r/eYqa7P7H/lIdE\"",
    "mtime": "2025-12-15T04:12:26.002Z",
    "size": 10244,
    "path": "../public/.DS_Store"
  },
  "/android-chrome-192x192.png": {
    "type": "image/png",
    "etag": "\"2b4f-UTzTbj7eG2KSPnoSsWEhSJpcsa4\"",
    "mtime": "2025-12-15T04:12:26.003Z",
    "size": 11087,
    "path": "../public/android-chrome-192x192.png"
  },
  "/android-chrome-512x512.png": {
    "type": "image/png",
    "etag": "\"beee-/CdqSuqGY3tow1sKaNEbAeyMZ+Q\"",
    "mtime": "2025-12-15T04:12:26.003Z",
    "size": 48878,
    "path": "../public/android-chrome-512x512.png"
  },
  "/app-icon.svg": {
    "type": "image/svg+xml",
    "etag": "\"1295-Ne24ozv+1WyvZeyNE6UdgMDugl8\"",
    "mtime": "2025-12-15T04:12:26.003Z",
    "size": 4757,
    "path": "../public/app-icon.svg"
  },
  "/apple-touch-icon.png": {
    "type": "image/png",
    "etag": "\"1e42-q4ynZ2jX/XL8yBElZvodm+M3zvA\"",
    "mtime": "2025-12-15T04:12:26.003Z",
    "size": 7746,
    "path": "../public/apple-touch-icon.png"
  },
  "/browserconfig.xml": {
    "type": "application/xml",
    "etag": "\"f6-l0rqGL2lqVgCwGuAEmqx2W2R1wg\"",
    "mtime": "2025-12-15T04:12:26.003Z",
    "size": 246,
    "path": "../public/browserconfig.xml"
  },
  "/favicon-16x16.png": {
    "type": "image/png",
    "etag": "\"4d2-+0/XX2Pb2e2l3ZurvJWrYo1sygo\"",
    "mtime": "2025-12-15T04:12:26.003Z",
    "size": 1234,
    "path": "../public/favicon-16x16.png"
  },
  "/favicon-32x32.png": {
    "type": "image/png",
    "etag": "\"7fe-6SUt6vCDtczyr/JX/Wus8o6jRlg\"",
    "mtime": "2025-12-15T04:12:26.003Z",
    "size": 2046,
    "path": "../public/favicon-32x32.png"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"3aee-Bzn8L49teTm4PYZWCHmwi7e4ZzU\"",
    "mtime": "2025-12-15T04:12:26.004Z",
    "size": 15086,
    "path": "../public/favicon.ico"
  },
  "/icon.png": {
    "type": "image/png",
    "etag": "\"457c1-jHlJeVPjxzVbP3KOw+2+fkGsACQ\"",
    "mtime": "2025-12-15T04:12:26.004Z",
    "size": 284609,
    "path": "../public/icon.png"
  },
  "/logo.svg": {
    "type": "image/svg+xml",
    "etag": "\"ace-caSO1mYAAh6crjEEA7CGQkAlQyA\"",
    "mtime": "2025-12-15T04:12:26.004Z",
    "size": 2766,
    "path": "../public/logo.svg"
  },
  "/manifest.webmanifest": {
    "type": "application/manifest+json",
    "etag": "\"173-6t4Sd8dmzkB1Nktnt6ISM+sri/Y\"",
    "mtime": "2025-12-15T04:12:25.927Z",
    "size": 371,
    "path": "../public/manifest.webmanifest"
  },
  "/mstile-150x150.png": {
    "type": "image/png",
    "etag": "\"1ae9-9Xlz/Shjo9uL8mUP6ssJLxJw01E\"",
    "mtime": "2025-12-15T04:12:26.003Z",
    "size": 6889,
    "path": "../public/mstile-150x150.png"
  },
  "/og_image.png": {
    "type": "image/png",
    "etag": "\"549d6-Mu0t1r9KBTmzESnk1TO/NxlPK24\"",
    "mtime": "2025-12-15T04:12:26.006Z",
    "size": 346582,
    "path": "../public/og_image.png"
  },
  "/safari-pinned-tab.svg": {
    "type": "image/svg+xml",
    "etag": "\"f55-w92QAp0NzsAAd9ee5JIkIv3+Y4s\"",
    "mtime": "2025-12-15T04:12:26.003Z",
    "size": 3925,
    "path": "../public/safari-pinned-tab.svg"
  },
  "/sw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1f31-1UFCNKEFoV9LtSa5QhUAQ12Sehg\"",
    "mtime": "2025-12-15T04:12:26.884Z",
    "size": 7985,
    "path": "../public/sw.js"
  },
  "/twitter_summary_card.png": {
    "type": "image/png",
    "etag": "\"a28c7-84Hz+XI4+dKWrJeeCaEEPaAkrTY\"",
    "mtime": "2025-12-15T04:12:26.006Z",
    "size": 665799,
    "path": "../public/twitter_summary_card.png"
  },
  "/workbox-8c29f6e4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3b13-Wh1UnUyyWpyRKjt8VAzqPv3W/FM\"",
    "mtime": "2025-12-15T04:12:26.884Z",
    "size": 15123,
    "path": "../public/workbox-8c29f6e4.js"
  },
  "/shiki/.DS_Store": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"2804-Eic0q1ixukJHBawIgmY853Kkw70\"",
    "mtime": "2025-12-15T04:12:25.969Z",
    "size": 10244,
    "path": "../public/shiki/.DS_Store"
  },
  "/fonts/.DS_Store": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"2804-u8+NHF1Nhm+a7Cb95Gdl56VuyWY\"",
    "mtime": "2025-12-15T04:12:25.969Z",
    "size": 10244,
    "path": "../public/fonts/.DS_Store"
  },
  "/_nuxt/-bd3A8UN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b0e-uznUucycg8FbSztYp9qr5vZ3Vsg\"",
    "mtime": "2025-12-15T04:12:25.952Z",
    "size": 6926,
    "path": "../public/_nuxt/-bd3A8UN.js"
  },
  "/_nuxt/120yhfDK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ecf-2UgVHVI82eseAgpYS4eVs+PoWXs\"",
    "mtime": "2025-12-15T04:12:25.942Z",
    "size": 7887,
    "path": "../public/_nuxt/120yhfDK.js"
  },
  "/_nuxt/1IWB1ccx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2c4-d5hlt/eDPY9gvRDWxWKmMcnFWI4\"",
    "mtime": "2025-12-15T04:12:25.942Z",
    "size": 708,
    "path": "../public/_nuxt/1IWB1ccx.js"
  },
  "/_nuxt/5jv8CcQD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"744-b5GZCEr/q0BS2OJ1osfNehmieIM\"",
    "mtime": "2025-12-15T04:12:25.942Z",
    "size": 1860,
    "path": "../public/_nuxt/5jv8CcQD.js"
  },
  "/_nuxt/9_vmXPqT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bc-AYdDPhAy0Ebd9RIhJeGTMMUlPQI\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 188,
    "path": "../public/_nuxt/9_vmXPqT.js"
  },
  "/_nuxt/A2Ko-gxp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11a-J4eK5Js57yBP4kb38UU6i/XTVkw\"",
    "mtime": "2025-12-15T04:12:25.942Z",
    "size": 282,
    "path": "../public/_nuxt/A2Ko-gxp.js"
  },
  "/_nuxt/AleRRjGV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b3-PO2dtqQ6nnDlA4JKHKkLDghs2Ks\"",
    "mtime": "2025-12-15T04:12:25.942Z",
    "size": 179,
    "path": "../public/_nuxt/AleRRjGV.js"
  },
  "/_nuxt/B0e6IkJl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1399-3MPDpTO3bfTkH531sk9LYvM98/Y\"",
    "mtime": "2025-12-15T04:12:25.942Z",
    "size": 5017,
    "path": "../public/_nuxt/B0e6IkJl.js"
  },
  "/_nuxt/B0jUM6gr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"33a-aOPdjpudlo4uHhNP+k8lK27GNIA\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 826,
    "path": "../public/_nuxt/B0jUM6gr.js"
  },
  "/_nuxt/B1aVtJYH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8d6-IfdfCC4R9nV093LqnUy0DWghpfM\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 2262,
    "path": "../public/_nuxt/B1aVtJYH.js"
  },
  "/_nuxt/B2pDeLl0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a2c9-1A214zCiQuNPLYwvHINkfGyNsp4\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 41673,
    "path": "../public/_nuxt/B2pDeLl0.js"
  },
  "/_nuxt/B5RuMey7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"142e-d2pXRLjrHv51dhLCabjA/qb74lA\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 5166,
    "path": "../public/_nuxt/B5RuMey7.js"
  },
  "/_nuxt/B5zlNRYG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15b7-YR9xqnFGC/F97dVRl7FZX1ztZfA\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 5559,
    "path": "../public/_nuxt/B5zlNRYG.js"
  },
  "/_nuxt/B7EJu28W.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d7a-zlFRoDUx5tDXwN48R2q9Xgx1saI\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 3450,
    "path": "../public/_nuxt/B7EJu28W.js"
  },
  "/_nuxt/B811l8j2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e40-Kal+oM1NUkq7n3Hq4RwFrYqvPCs\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 3648,
    "path": "../public/_nuxt/B811l8j2.js"
  },
  "/_nuxt/B8IaAclc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"43f-38AFPUgaINDl0Mgm4EqiN7qG8Xk\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 1087,
    "path": "../public/_nuxt/B8IaAclc.js"
  },
  "/_nuxt/BH8PvhSt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b4-s2iq6YQ1Tn2jYAcQ47LS3Wbo/Jg\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 180,
    "path": "../public/_nuxt/BH8PvhSt.js"
  },
  "/_nuxt/BHd6q0vd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2b7e-iQLr7Hmx+CjxbV+3tBluZ+vNqDs\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 11134,
    "path": "../public/_nuxt/BHd6q0vd.js"
  },
  "/_nuxt/BIFz-_sK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"baf-7YYCC4AhSqZeg0mX7lai9hF/pPI\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 2991,
    "path": "../public/_nuxt/BIFz-_sK.js"
  },
  "/_nuxt/BIl4cyR9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1681-8OY0+UaG+gUiKJSGiH59s2B32fM\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 5761,
    "path": "../public/_nuxt/BIl4cyR9.js"
  },
  "/_nuxt/BNm4PrKC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6ef-N7fQO8cigmWOcR+mp9zIkhPsyg4\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 1775,
    "path": "../public/_nuxt/BNm4PrKC.js"
  },
  "/_nuxt/BO6FnfXk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1452-WFKELyLqeSCK6V5LU5U3b0lTpbc\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 5202,
    "path": "../public/_nuxt/BO6FnfXk.js"
  },
  "/_nuxt/BRjLKONM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2785-tr95R98nN/5wEoC30NgCt0HPjBo\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 10117,
    "path": "../public/_nuxt/BRjLKONM.js"
  },
  "/_nuxt/BSVNQtz-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"265-6ZpMN4iTGyOAEsg8w0KwccbTpsU\"",
    "mtime": "2025-12-15T04:12:25.943Z",
    "size": 613,
    "path": "../public/_nuxt/BSVNQtz-.js"
  },
  "/_nuxt/BSZFgSs5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2e2-Xx3CPLs2P8/Z9oeBrF1kzRPIBdg\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 738,
    "path": "../public/_nuxt/BSZFgSs5.js"
  },
  "/_nuxt/BTk9bGd6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"90-JJYI+8owgk4ub9sAtch1j97IstY\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 144,
    "path": "../public/_nuxt/BTk9bGd6.js"
  },
  "/_nuxt/BYAiYHFx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"699-SE6/WnbRovNEZySeXDiaLRMuHuE\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 1689,
    "path": "../public/_nuxt/BYAiYHFx.js"
  },
  "/_nuxt/BZU4PN7O.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"915-lBiML78gpjSx/I1P8xT78qkVbBY\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 2325,
    "path": "../public/_nuxt/BZU4PN7O.js"
  },
  "/_nuxt/B_1kOXbF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c26-pkjpXtPj5l7pVMUI6SA+1tAfDwU\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 7206,
    "path": "../public/_nuxt/B_1kOXbF.js"
  },
  "/_nuxt/BdTr02Mf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"27ad-QFDD0+FMALAwHtDBpVPB5LR9L4M\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 10157,
    "path": "../public/_nuxt/BdTr02Mf.js"
  },
  "/_nuxt/BemSfMWk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"43ef91-kL2cgSc18nTTt+AoM91w11e+TRw\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 4452241,
    "path": "../public/_nuxt/BemSfMWk.js"
  },
  "/_nuxt/Benqhwzf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b6-ruz7Tax7PMxZDfuxa4G475wpoo0\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 182,
    "path": "../public/_nuxt/Benqhwzf.js"
  },
  "/_nuxt/BfRIq3la.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"16c9-REH6brIg6JM0pzk+Ow3HR60fxfY\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 5833,
    "path": "../public/_nuxt/BfRIq3la.js"
  },
  "/_nuxt/BhNW15KB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b27-+Yz+Uc8efFHI5a2KwOVMwIV8Imw\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 2855,
    "path": "../public/_nuxt/BhNW15KB.js"
  },
  "/_nuxt/BkGs623Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4d54-55xtk1MiRSFKAGQu19H4bXeGaG4\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 19796,
    "path": "../public/_nuxt/BkGs623Q.js"
  },
  "/_nuxt/BoL64M5l.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1120-kLW2Ke0OyU9GDiEDSzR9FMgST7Q\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 4384,
    "path": "../public/_nuxt/BoL64M5l.js"
  },
  "/_nuxt/BoNdQN3j.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"10fa-BeT7JyxftHS6mSF1lONqkxLRmCw\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 4346,
    "path": "../public/_nuxt/BoNdQN3j.js"
  },
  "/_nuxt/BoieXshk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ed9-HReikor92dJofAV8dqLQJ5pBuQM\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 7897,
    "path": "../public/_nuxt/BoieXshk.js"
  },
  "/_nuxt/Bqvq8jcR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c0a-m9HCzyxyAI7cMNFK6kghqalyUSg\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 7178,
    "path": "../public/_nuxt/Bqvq8jcR.js"
  },
  "/_nuxt/Bu_VLpJB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c39-mjx1PBq30BvwDnRfCbrd9Ezy+n0\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 3129,
    "path": "../public/_nuxt/Bu_VLpJB.js"
  },
  "/_nuxt/BvajGCUy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3c1-EVdUfJgafUaiT5tM+58GkNcUmUM\"",
    "mtime": "2025-12-15T04:12:25.945Z",
    "size": 961,
    "path": "../public/_nuxt/BvajGCUy.js"
  },
  "/_nuxt/BwAE3J76.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1613-N8rtAjh2yTnRM/fIWzXQKDN3vLw\"",
    "mtime": "2025-12-15T04:12:25.944Z",
    "size": 5651,
    "path": "../public/_nuxt/BwAE3J76.js"
  },
  "/_nuxt/C-Vx815a.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6a739-j6ewx567QiYm7xG0CxCDBP4L2z4\"",
    "mtime": "2025-12-15T04:12:25.945Z",
    "size": 436025,
    "path": "../public/_nuxt/C-Vx815a.js"
  },
  "/_nuxt/C0xk_yel.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b4-bphsuIQhcvledVkmLB3ziLk63xU\"",
    "mtime": "2025-12-15T04:12:25.945Z",
    "size": 180,
    "path": "../public/_nuxt/C0xk_yel.js"
  },
  "/_nuxt/C46ZqvIl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4ff-42D/J4kcuqQBr28Ek0BpcswIF5Y\"",
    "mtime": "2025-12-15T04:12:25.945Z",
    "size": 1279,
    "path": "../public/_nuxt/C46ZqvIl.js"
  },
  "/_nuxt/C7iG7M4S.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c5b-i/LrGxwyE6wDb8MBKXdbho6gQtQ\"",
    "mtime": "2025-12-15T04:12:25.945Z",
    "size": 7259,
    "path": "../public/_nuxt/C7iG7M4S.js"
  },
  "/_nuxt/CBifECDb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2d8c-FK9M9MO5kVGKbRjHGZl4lDA5Cjw\"",
    "mtime": "2025-12-15T04:12:25.945Z",
    "size": 11660,
    "path": "../public/_nuxt/CBifECDb.js"
  },
  "/_nuxt/CGrWLZr3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7fd-tN1ZOyXmPMobQ3KvdXwT89kmTbY\"",
    "mtime": "2025-12-15T04:12:25.945Z",
    "size": 2045,
    "path": "../public/_nuxt/CGrWLZr3.js"
  },
  "/_nuxt/CHOsPHWR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d58-tLQw9Aw6LhM+nkeXDHg+H81J+Yk\"",
    "mtime": "2025-12-15T04:12:25.945Z",
    "size": 3416,
    "path": "../public/_nuxt/CHOsPHWR.js"
  },
  "/_nuxt/CL-LOzEX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5f12-8EliBCn+Nklkw5fp3ByahIGrGpk\"",
    "mtime": "2025-12-15T04:12:25.945Z",
    "size": 24338,
    "path": "../public/_nuxt/CL-LOzEX.js"
  },
  "/_nuxt/CLwp5zFm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b7-AvtpOsTwgLzMO7dwvWyUUjEhVro\"",
    "mtime": "2025-12-15T04:12:25.946Z",
    "size": 183,
    "path": "../public/_nuxt/CLwp5zFm.js"
  },
  "/_nuxt/CME5AdoB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4819-f3Xz4Qz87ldNuYuCPWEsCCdwUs8\"",
    "mtime": "2025-12-15T04:12:25.946Z",
    "size": 18457,
    "path": "../public/_nuxt/CME5AdoB.js"
  },
  "/_nuxt/CPTQKOnc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"99-JFF5GhYsc9CXIsh22ZeLKj93fFY\"",
    "mtime": "2025-12-15T04:12:25.946Z",
    "size": 153,
    "path": "../public/_nuxt/CPTQKOnc.js"
  },
  "/_nuxt/CQpG440k.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e24-ypoi8JzR9ScxNhdF2paL1lZf06k\"",
    "mtime": "2025-12-15T04:12:25.946Z",
    "size": 7716,
    "path": "../public/_nuxt/CQpG440k.js"
  },
  "/_nuxt/CRCWOmpq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"36c7-BkjYG66QpeqvLEzm8IWLfAqkVsE\"",
    "mtime": "2025-12-15T04:12:25.946Z",
    "size": 14023,
    "path": "../public/_nuxt/CRCWOmpq.js"
  },
  "/_nuxt/CSrg8HWD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2ed7b-N8wCnaFdr8crlMCqwrDJ7nBez88\"",
    "mtime": "2025-12-15T04:12:25.946Z",
    "size": 191867,
    "path": "../public/_nuxt/CSrg8HWD.js"
  },
  "/_nuxt/CTwUZ5N7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"187d-VaRCcTN/cTrzVPNAtfm9NYrbbpk\"",
    "mtime": "2025-12-15T04:12:25.946Z",
    "size": 6269,
    "path": "../public/_nuxt/CTwUZ5N7.js"
  },
  "/_nuxt/CWnrJIRr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1dd-g7u0MbKF7C9h+n84gEQU0C7CMmo\"",
    "mtime": "2025-12-15T04:12:25.946Z",
    "size": 477,
    "path": "../public/_nuxt/CWnrJIRr.js"
  },
  "/_nuxt/CWrH5Asq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5e3b-QQ+Z6Faafw3lpHaWOFNHF04qwl0\"",
    "mtime": "2025-12-15T04:12:25.946Z",
    "size": 24123,
    "path": "../public/_nuxt/CWrH5Asq.js"
  },
  "/_nuxt/CXKPhwma.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2e9-hHt0t71DGXO+FO1cgiUjWLk8GdQ\"",
    "mtime": "2025-12-15T04:12:25.946Z",
    "size": 745,
    "path": "../public/_nuxt/CXKPhwma.js"
  },
  "/_nuxt/CYI6ugiv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b4-LvnDYPsAnwj4mJb9iXUX5oz27+g\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 180,
    "path": "../public/_nuxt/CYI6ugiv.js"
  },
  "/_nuxt/CYWGW-b1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"20ac-2n0e313el5fS7VAq75NXiLKMDKM\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 8364,
    "path": "../public/_nuxt/CYWGW-b1.js"
  },
  "/_nuxt/CYqgjx_P.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12a4-U2jZScoTN5EPH4eaF8o046MA4cE\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 4772,
    "path": "../public/_nuxt/CYqgjx_P.js"
  },
  "/_nuxt/CZ_YavWR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"58c2-1lDEr06BK9W3SsV1BY150ZjNbVs\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 22722,
    "path": "../public/_nuxt/CZ_YavWR.js"
  },
  "/_nuxt/CZa8nCYI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"140b-4NzXJPahWWQs5sHQCJeCA60unrc\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 5131,
    "path": "../public/_nuxt/CZa8nCYI.js"
  },
  "/_nuxt/Cac8vKd7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"686-oEGbBEwE5U+p//RFsGCqqy1t28o\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 1670,
    "path": "../public/_nuxt/Cac8vKd7.js"
  },
  "/_nuxt/Canl7DCW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8f9-oEulYdeqy1/9hU4OlNGT9NeRy0c\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 2297,
    "path": "../public/_nuxt/Canl7DCW.js"
  },
  "/_nuxt/CdjsipkG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"987-dV1lJGtbNG4+NCyaU9NmhUzVneA\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 2439,
    "path": "../public/_nuxt/CdjsipkG.js"
  },
  "/_nuxt/Cg34PuuM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a05-1d4xN0lpJEOGHsRXwT8GrWFYoaE\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 2565,
    "path": "../public/_nuxt/Cg34PuuM.js"
  },
  "/_nuxt/CghPJEOS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ea9-/twir9arZYFBDVkTwf12flD6MaA\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 3753,
    "path": "../public/_nuxt/CghPJEOS.js"
  },
  "/_nuxt/CiHQRaHl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1400-S9MAYbvHVmCJvARTnALHyIMCa7Q\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 5120,
    "path": "../public/_nuxt/CiHQRaHl.js"
  },
  "/_nuxt/CjnFlu4u.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"607-XCXVJVP0cLUVv8KbKZIbA5CaxI8\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 1543,
    "path": "../public/_nuxt/CjnFlu4u.js"
  },
  "/_nuxt/Corcdgou.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"95c-pJT7AUvQLcMGVslWMgk7Y/jpKFs\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 2396,
    "path": "../public/_nuxt/Corcdgou.js"
  },
  "/_nuxt/CsDZo4DB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b75-StIIy620/ATkf/5fiAj3ZJGjDHM\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 2933,
    "path": "../public/_nuxt/CsDZo4DB.js"
  },
  "/_nuxt/CxTeRaOR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e3-YHcmZgyFHQQ3N71lrv71wvFirG0\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 483,
    "path": "../public/_nuxt/CxTeRaOR.js"
  },
  "/_nuxt/CzxlYoT_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a60-XOXMHYsmdprvYCOy4C/Jrm+5YFc\"",
    "mtime": "2025-12-15T04:12:25.947Z",
    "size": 2656,
    "path": "../public/_nuxt/CzxlYoT_.js"
  },
  "/_nuxt/D-juXiYZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b7-DmZuS8AKEh70WVLfONtVlq4hP7w\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 183,
    "path": "../public/_nuxt/D-juXiYZ.js"
  },
  "/_nuxt/D0RJRWmp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-2vWFR+MPpUig/wSViwExU1e+BTo\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 78,
    "path": "../public/_nuxt/D0RJRWmp.js"
  },
  "/_nuxt/D28Ae8-K.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7bf-9zq94ysVB6xsAL+lBK4MKXEvO/A\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 1983,
    "path": "../public/_nuxt/D28Ae8-K.js"
  },
  "/_nuxt/D3DN5BbJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"404-jI67jq36njr+xp0x1VLgABjizUU\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 1028,
    "path": "../public/_nuxt/D3DN5BbJ.js"
  },
  "/_nuxt/D4YAG3bJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d54-TL/VhHXXqyQOiOaKAOsmbxaOEZk\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 3412,
    "path": "../public/_nuxt/D4YAG3bJ.js"
  },
  "/_nuxt/D7IUmUK8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12a4-1fyfReFOYKCOdhDBphpzk45EHBg\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 4772,
    "path": "../public/_nuxt/D7IUmUK8.js"
  },
  "/_nuxt/D84EuPTj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"cad-TfZ3YYBsgfx79OsmZLfi81DXjEA\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 3245,
    "path": "../public/_nuxt/D84EuPTj.js"
  },
  "/_nuxt/D8lhlL1r.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"100e-G61UN95tGE6AAmlirke4JyeD/i4\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 4110,
    "path": "../public/_nuxt/D8lhlL1r.js"
  },
  "/_nuxt/D9WOWImG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"251f-xVhAVDJXc5mg4M3ldYiCErTPBtE\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 9503,
    "path": "../public/_nuxt/D9WOWImG.js"
  },
  "/_nuxt/DEuSjeYs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b8-UJKPCSS3IeKGl3+uT2Vrn1ZJu1w\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 184,
    "path": "../public/_nuxt/DEuSjeYs.js"
  },
  "/_nuxt/DLk6rpji.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6c1-kx1tQUZtiuMpjmrEGFIoe30MFa0\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 1729,
    "path": "../public/_nuxt/DLk6rpji.js"
  },
  "/_nuxt/DMDD0SHb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fb4-8y2Eh7zo8KHULXD3A5Z2Y7f6D84\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 4020,
    "path": "../public/_nuxt/DMDD0SHb.js"
  },
  "/_nuxt/DNIojo20.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1010-W1plLG92iVmrQEs7bwtpP1WwpqQ\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 4112,
    "path": "../public/_nuxt/DNIojo20.js"
  },
  "/_nuxt/DPijdxVe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"22e2-PFjQ6xWlqs0O7Wjy2Iutlg/bdzM\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 8930,
    "path": "../public/_nuxt/DPijdxVe.js"
  },
  "/_nuxt/DPitgjJI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a75-r+Oheirin+KRDkufMZk7tmEa7Q8\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 2677,
    "path": "../public/_nuxt/DPitgjJI.js"
  },
  "/_nuxt/DPkNLes8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6a9-fqyzydH6w2W/IrxqFK8/P/84uGI\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 1705,
    "path": "../public/_nuxt/DPkNLes8.js"
  },
  "/_nuxt/DQU6DXDx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1112-19dwqPX9H7/zsmDDDyqFsojj8qc\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 4370,
    "path": "../public/_nuxt/DQU6DXDx.js"
  },
  "/_nuxt/DQXNmw_w.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b61-aJLV9421uCqidrHnT2iVmf97wKg\"",
    "mtime": "2025-12-15T04:12:25.948Z",
    "size": 7009,
    "path": "../public/_nuxt/DQXNmw_w.js"
  },
  "/_nuxt/DQynuZuu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"88b-hf4tpsv8qQj7WLncQ1ezNydbdDc\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 2187,
    "path": "../public/_nuxt/DQynuZuu.js"
  },
  "/_nuxt/DXBCMKVB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e3-cEm1LsAinSXI1uCsR39C1WZiKjI\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 483,
    "path": "../public/_nuxt/DXBCMKVB.js"
  },
  "/_nuxt/DXTn1qAH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"42d-pOZw9AWb12aBURYLYo3KqfwS8jE\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 1069,
    "path": "../public/_nuxt/DXTn1qAH.js"
  },
  "/_nuxt/DZRQ9xiA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14e-AXlaB//YawL1rvGPP+vRMg3Cln8\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 334,
    "path": "../public/_nuxt/DZRQ9xiA.js"
  },
  "/_nuxt/DcAWuLHr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e4-48Xr7Uek7zM9NTQ12uhwB0lVJ8w\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 484,
    "path": "../public/_nuxt/DcAWuLHr.js"
  },
  "/_nuxt/DdJtto1Z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"419f-aJnal1AZtTccDZ0OzQNSC869pHE\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 16799,
    "path": "../public/_nuxt/DdJtto1Z.js"
  },
  "/_nuxt/DgMryOEJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1d27-fLgcMC9OLPkM0QlaZA6Kl4tsYXM\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 7463,
    "path": "../public/_nuxt/DgMryOEJ.js"
  },
  "/_nuxt/Dhb-2j9p.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"65b-8xWda4npUimrdKZXuchq0duTKS4\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 1627,
    "path": "../public/_nuxt/Dhb-2j9p.js"
  },
  "/_nuxt/DlYyT36c.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1fb3-0JhQ1kNhVlH9byxaYOzTPrQ0NlA\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 8115,
    "path": "../public/_nuxt/DlYyT36c.js"
  },
  "/_nuxt/DnsZk_dE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ee4-p1cioJuLWDUzSe3duoPDfLq+ZIA\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 3812,
    "path": "../public/_nuxt/DnsZk_dE.js"
  },
  "/_nuxt/Do70Qzyk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7e00-Zmb8eU2UWg9RELF+hr/gY3X1ki8\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 32256,
    "path": "../public/_nuxt/Do70Qzyk.js"
  },
  "/_nuxt/DpGIwHLe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"56f5-IdbCF0MIvV0zj+KcpGcHqaaQ5TY\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 22261,
    "path": "../public/_nuxt/DpGIwHLe.js"
  },
  "/_nuxt/Dq1s8YP1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b4-sP+8yLWiMdWFf1+a5m/d132wLFQ\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 180,
    "path": "../public/_nuxt/Dq1s8YP1.js"
  },
  "/_nuxt/Dqrk-3dx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2d1-mWZNfZUh978wB4A55+iNJbeKzv8\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 721,
    "path": "../public/_nuxt/Dqrk-3dx.js"
  },
  "/_nuxt/DrglE2KN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6a5-d717TgSTJqT4oIITnfASYaPdG10\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 1701,
    "path": "../public/_nuxt/DrglE2KN.js"
  },
  "/_nuxt/DtAFsNIK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"185-PCRZU1LmprlMxZJq1TkFXb7gX3A\"",
    "mtime": "2025-12-15T04:12:25.949Z",
    "size": 389,
    "path": "../public/_nuxt/DtAFsNIK.js"
  },
  "/_nuxt/DwrJHhzq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e83b-lK8xrMAAP4snCO1vOCPZ4wJKU+I\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 59451,
    "path": "../public/_nuxt/DwrJHhzq.js"
  },
  "/_nuxt/DxDQ3s82.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d7a-fk5/sg6GN0rF588da22v44UzElg\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 3450,
    "path": "../public/_nuxt/DxDQ3s82.js"
  },
  "/_nuxt/DxX9CHUw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e3-UzN0AqOnUirSzLIovUHjngUQ7KQ\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 483,
    "path": "../public/_nuxt/DxX9CHUw.js"
  },
  "/_nuxt/Dy0bjov7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"340c-DZskIE6GNPuQbDtKOFGb1LKyle0\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 13324,
    "path": "../public/_nuxt/Dy0bjov7.js"
  },
  "/_nuxt/DyUjpOYB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b4-Vlz5t5sK8OmOfkRgTt3RD5e9+Js\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 180,
    "path": "../public/_nuxt/DyUjpOYB.js"
  },
  "/_nuxt/Dywv9Hjt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8027-ynO4JtmYgcGuk1lFqclfibEQFPg\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 32807,
    "path": "../public/_nuxt/Dywv9Hjt.js"
  },
  "/_nuxt/DzbeHPat.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13b-D7wYdVhtVeP+wPJBqCxJdTquT7o\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 315,
    "path": "../public/_nuxt/DzbeHPat.js"
  },
  "/_nuxt/EDKornGI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3f78-q0yv88KBe8saBzZAAHfboCrVQB8\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 16248,
    "path": "../public/_nuxt/EDKornGI.js"
  },
  "/_nuxt/GGFNNJHn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"eae-OT24TJ80Nj+4r0jb377dFpnZ4y0\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 3758,
    "path": "../public/_nuxt/GGFNNJHn.js"
  },
  "/_nuxt/IBS6jZEB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"22ca-xd+QJgUZ7J1olxkf9EcIyDxX3D0\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 8906,
    "path": "../public/_nuxt/IBS6jZEB.js"
  },
  "/_nuxt/KEyrF7De.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"96c-K6P5tKw4/g55It24nivtgcjU+ds\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 2412,
    "path": "../public/_nuxt/KEyrF7De.js"
  },
  "/_nuxt/LQdxqEYJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"848-xWKk2rFCpHoonoJFVCbmeKEAy0c\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 2120,
    "path": "../public/_nuxt/LQdxqEYJ.js"
  },
  "/_nuxt/O9LJTZXk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9d5-YCNWv/y3bHWDDp4Q/TMcznpzV04\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 2517,
    "path": "../public/_nuxt/O9LJTZXk.js"
  },
  "/_nuxt/PloMZuKG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d67-vh9DzbyGzCKMidreCxeEOsJSRV8\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 3431,
    "path": "../public/_nuxt/PloMZuKG.js"
  },
  "/_nuxt/ProsePre.B_fgAJq0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2e-GbvrqT5j9gSWlpa8e36U/Kv6Zx0\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 46,
    "path": "../public/_nuxt/ProsePre.B_fgAJq0.css"
  },
  "/_nuxt/RYC1BQQz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a40-1b8DQ26lPBfoF8BYuHmstYKWaU8\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 2624,
    "path": "../public/_nuxt/RYC1BQQz.js"
  },
  "/_nuxt/SEyurbux.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1428-Ohs9KDN23nJh9vgDr2yLnpllkP4\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 5160,
    "path": "../public/_nuxt/SEyurbux.js"
  },
  "/_nuxt/SYsfObOQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c09-8esdtEyuVb1IHl8vXXJcPLmyOFc\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 3081,
    "path": "../public/_nuxt/SYsfObOQ.js"
  },
  "/_nuxt/TCXpntNg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b4-vgnHvmE0e7Nr6ITdFZikBsEwBhI\"",
    "mtime": "2025-12-15T04:12:25.951Z",
    "size": 180,
    "path": "../public/_nuxt/TCXpntNg.js"
  },
  "/_nuxt/UwbL-v5g.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fb-jfaEMnvkOxVbwPo4/YrJRSQKX6s\"",
    "mtime": "2025-12-15T04:12:25.950Z",
    "size": 251,
    "path": "../public/_nuxt/UwbL-v5g.js"
  },
  "/_nuxt/XC0kvURe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ecb-G25nY/ppp5aDF3thLMCxd6GI2zk\"",
    "mtime": "2025-12-15T04:12:25.951Z",
    "size": 3787,
    "path": "../public/_nuxt/XC0kvURe.js"
  },
  "/_nuxt/b45nazAH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e3-ghzitY89Lpoa872ZweIouVuGNpY\"",
    "mtime": "2025-12-15T04:12:25.951Z",
    "size": 483,
    "path": "../public/_nuxt/b45nazAH.js"
  },
  "/_nuxt/codicon.DCmgc-ay.ttf": {
    "type": "font/ttf",
    "etag": "\"139d4-58fQ8Ohjcapek6AgDzlcXTeWfi4\"",
    "mtime": "2025-12-15T04:12:25.951Z",
    "size": 80340,
    "path": "../public/_nuxt/codicon.DCmgc-ay.ttf"
  },
  "/_nuxt/entry.CEKVbi_H.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"47038-UaNiidRt2YN+EFXOF2CDNfDzIbw\"",
    "mtime": "2025-12-15T04:12:25.951Z",
    "size": 290872,
    "path": "../public/_nuxt/entry.CEKVbi_H.css"
  },
  "/_nuxt/error-404.CYUhy3y9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"dca-005xQIrTNdE7LUqKJ7YOCC8lzEw\"",
    "mtime": "2025-12-15T04:12:25.951Z",
    "size": 3530,
    "path": "../public/_nuxt/error-404.CYUhy3y9.css"
  },
  "/_nuxt/error-500.CVLkTsZM.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"75a-W5VxOFBjAs2NvcF8lJBDWJ0iI/o\"",
    "mtime": "2025-12-15T04:12:25.951Z",
    "size": 1882,
    "path": "../public/_nuxt/error-500.CVLkTsZM.css"
  },
  "/_nuxt/fd1GTHhf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b1b-h7WEBbuSCW1ND5RVtJwwJFwuiig\"",
    "mtime": "2025-12-15T04:12:25.951Z",
    "size": 2843,
    "path": "../public/_nuxt/fd1GTHhf.js"
  },
  "/_nuxt/index.-ZtmFfQ2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2363e-F1r268nZuGMKmCqSRk2lk8Llwpo\"",
    "mtime": "2025-12-15T04:12:25.952Z",
    "size": 144958,
    "path": "../public/_nuxt/index.-ZtmFfQ2.css"
  },
  "/_nuxt/jh7MkHMl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"90-m3cvpAi03rANFHlzc6QYyDGYrSA\"",
    "mtime": "2025-12-15T04:12:25.951Z",
    "size": 144,
    "path": "../public/_nuxt/jh7MkHMl.js"
  },
  "/_nuxt/kFxLfcjb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1250-aKuSfCmXzaljd1Up7EKEYt1UMbw\"",
    "mtime": "2025-12-15T04:12:25.951Z",
    "size": 4688,
    "path": "../public/_nuxt/kFxLfcjb.js"
  },
  "/_nuxt/mnHvgfrU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b7-kS5UJgeYFcSzE8qjiHV714jTB4I\"",
    "mtime": "2025-12-15T04:12:25.951Z",
    "size": 183,
    "path": "../public/_nuxt/mnHvgfrU.js"
  },
  "/_nuxt/pPQtQxzK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e3-/qQjy211oOkfkfr8TmrDX8aqFN4\"",
    "mtime": "2025-12-15T04:12:25.951Z",
    "size": 483,
    "path": "../public/_nuxt/pPQtQxzK.js"
  },
  "/_nuxt/pest-black.D4vO7cTK.png": {
    "type": "image/png",
    "etag": "\"124512-+NUui9Txioot3oq/booB9bTZofk\"",
    "mtime": "2025-12-15T04:12:25.953Z",
    "size": 1197330,
    "path": "../public/_nuxt/pest-black.D4vO7cTK.png"
  },
  "/_nuxt/pest-white.06MKWBGY.png": {
    "type": "image/png",
    "etag": "\"12800d-rLIDxQ3omP4cuMblfKxrHHJQy8k\"",
    "mtime": "2025-12-15T04:12:25.953Z",
    "size": 1212429,
    "path": "../public/_nuxt/pest-white.06MKWBGY.png"
  },
  "/_nuxt/q7JyzKFN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"be9-hVjuqznujEEYv7lzhckbvBDyA10\"",
    "mtime": "2025-12-15T04:12:25.951Z",
    "size": 3049,
    "path": "../public/_nuxt/q7JyzKFN.js"
  },
  "/_nuxt/qQ0MG-9I.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ce3-h5L6ZKvgUqd7fzSEutGZdepr5MU\"",
    "mtime": "2025-12-15T04:12:25.952Z",
    "size": 3299,
    "path": "../public/_nuxt/qQ0MG-9I.js"
  },
  "/_nuxt/rGLu2a2m.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b4-2BTxB56SljbGqMSRvDE4aea4Vk8\"",
    "mtime": "2025-12-15T04:12:25.952Z",
    "size": 180,
    "path": "../public/_nuxt/rGLu2a2m.js"
  },
  "/_nuxt/tC0XSEVd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1047-a6257MoprsDourOeNyJ41qMHN7Y\"",
    "mtime": "2025-12-15T04:12:25.952Z",
    "size": 4167,
    "path": "../public/_nuxt/tC0XSEVd.js"
  },
  "/_nuxt/tailwind-beams.DnjaL6NH.png": {
    "type": "image/png",
    "etag": "\"3ee58-N3FyQxxR48avsIFPZXqSpNKPKDA\"",
    "mtime": "2025-12-15T04:12:25.952Z",
    "size": 257624,
    "path": "../public/_nuxt/tailwind-beams.DnjaL6NH.png"
  },
  "/_nuxt/useShiki.0Q2FYJqz.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"124-ODDbdhtr6BBefHgSAXzCD8K2/Vc\"",
    "mtime": "2025-12-15T04:12:25.952Z",
    "size": 292,
    "path": "../public/_nuxt/useShiki.0Q2FYJqz.css"
  },
  "/api/_content/cache.1765771934696.json": {
    "type": "application/json",
    "etag": "\"a81d-tC19mrimjDgpkIy+M0oPyBayHio\"",
    "mtime": "2025-12-15T04:12:25.913Z",
    "size": 43037,
    "path": "../public/api/_content/cache.1765771934696.json"
  },
  "/shiki/dist/onig.wasm": {
    "type": "application/wasm",
    "etag": "\"731f7-j7Y6lsbTq4zbwj9bxcZ74jfsidw\"",
    "mtime": "2025-12-15T04:12:25.971Z",
    "size": 471543,
    "path": "../public/shiki/dist/onig.wasm"
  },
  "/fonts/geist-mono/GeistMono-Regular.woff2": {
    "type": "font/woff2",
    "etag": "\"9d34-Dm0Ouo2Kq7F0sutgFzJcHfD1Hy0\"",
    "mtime": "2025-12-15T04:12:26.002Z",
    "size": 40244,
    "path": "../public/fonts/geist-mono/GeistMono-Regular.woff2"
  },
  "/fonts/geist-mono/license.TXT": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1121-UwWKLdWfBTY2Yo1KuBMyArUTtGY\"",
    "mtime": "2025-12-15T04:12:26.002Z",
    "size": 4385,
    "path": "../public/fonts/geist-mono/license.TXT"
  },
  "/fonts/jetbrains-mono/.DS_Store": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"1804-QbbuZeRGyA7i0MjZ7+trjhUvxtc\"",
    "mtime": "2025-12-15T04:12:26.002Z",
    "size": 6148,
    "path": "../public/fonts/jetbrains-mono/.DS_Store"
  },
  "/fonts/jetbrains-mono/JetBrainsMono-Regular.woff2": {
    "type": "font/woff2",
    "etag": "\"16804-gCuwHIxsDlJMoVvCMK14FMSnUX0\"",
    "mtime": "2025-12-15T04:12:26.003Z",
    "size": 92164,
    "path": "../public/fonts/jetbrains-mono/JetBrainsMono-Regular.woff2"
  },
  "/fonts/jetbrains-mono/license.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"112f-rAtOnqwhcevnD6uau8IpTgzUaUQ\"",
    "mtime": "2025-12-15T04:12:26.003Z",
    "size": 4399,
    "path": "../public/fonts/jetbrains-mono/license.txt"
  },
  "/fonts/mono-lisa/MonoLisa-Regular.woff2": {
    "type": "font/woff2",
    "etag": "\"5e04-I83KUFf/67tgYqNlPyU9k3rq120\"",
    "mtime": "2025-12-15T04:12:25.969Z",
    "size": 24068,
    "path": "../public/fonts/mono-lisa/MonoLisa-Regular.woff2"
  },
  "/fonts/mono-lisa/license.md": {
    "type": "text/markdown; charset=utf-8",
    "etag": "\"3a64-gC027iMgBx0CFMGW+gsjrjCCv2A\"",
    "mtime": "2025-12-15T04:12:25.970Z",
    "size": 14948,
    "path": "../public/fonts/mono-lisa/license.md"
  },
  "/shiki/themes/all.json": {
    "type": "application/json",
    "etag": "\"258-qsMOUJWMoqz8vzfBhMMgLg95dLs\"",
    "mtime": "2025-12-15T04:12:25.970Z",
    "size": 600,
    "path": "../public/shiki/themes/all.json"
  },
  "/shiki/themes/bluloco-dark.json": {
    "type": "application/json",
    "etag": "\"787c-ziFY66fa8oW+qAyV/PIgsTzNNaU\"",
    "mtime": "2025-12-15T04:12:25.995Z",
    "size": 30844,
    "path": "../public/shiki/themes/bluloco-dark.json"
  },
  "/shiki/themes/bluloco-light-color-theme.json": {
    "type": "application/json",
    "etag": "\"7b08-WWBjGK6qxdIlF27XGbuNNDmRu0o\"",
    "mtime": "2025-12-15T04:12:25.993Z",
    "size": 31496,
    "path": "../public/shiki/themes/bluloco-light-color-theme.json"
  },
  "/shiki/themes/bluloco-light.json": {
    "type": "application/json",
    "etag": "\"77c4-CB+wUqCAcJYhsP9JKUQ5ekKOdYs\"",
    "mtime": "2025-12-15T04:12:25.994Z",
    "size": 30660,
    "path": "../public/shiki/themes/bluloco-light.json"
  },
  "/shiki/themes/bracket-light-pro.json": {
    "type": "application/json",
    "etag": "\"382d-hvknOMtedBW2bONi0cMHZG2DAak\"",
    "mtime": "2025-12-15T04:12:25.995Z",
    "size": 14381,
    "path": "../public/shiki/themes/bracket-light-pro.json"
  },
  "/shiki/themes/brackets-light-pro.json": {
    "type": "application/json",
    "etag": "\"382e-SID7cEEuwSdyTilinkflBRuEfzo\"",
    "mtime": "2025-12-15T04:12:25.994Z",
    "size": 14382,
    "path": "../public/shiki/themes/brackets-light-pro.json"
  },
  "/shiki/themes/cobalt2.json": {
    "type": "application/json",
    "etag": "\"5cee-1oC/FM/InaDQW+SBG8aNGvHXbBU\"",
    "mtime": "2025-12-15T04:12:25.994Z",
    "size": 23790,
    "path": "../public/shiki/themes/cobalt2.json"
  },
  "/shiki/themes/css-variables.json": {
    "type": "application/json",
    "etag": "\"f9d-ezhEnZjEJ/JDLC/jlBmV0kC11nE\"",
    "mtime": "2025-12-15T04:12:25.995Z",
    "size": 3997,
    "path": "../public/shiki/themes/css-variables.json"
  },
  "/shiki/themes/dark-plus.json": {
    "type": "application/json",
    "etag": "\"35ed-SNFQuXF2hWipOwNwwozlXa+Z4pU\"",
    "mtime": "2025-12-15T04:12:25.996Z",
    "size": 13805,
    "path": "../public/shiki/themes/dark-plus.json"
  },
  "/shiki/themes/dracula-soft.json": {
    "type": "application/json",
    "etag": "\"7bf4-EmhP6IesxoeFekmTVcurfzbqwIg\"",
    "mtime": "2025-12-15T04:12:25.996Z",
    "size": 31732,
    "path": "../public/shiki/themes/dracula-soft.json"
  },
  "/shiki/themes/dracula.json": {
    "type": "application/json",
    "etag": "\"7bef-Mp3yp/oKG3XXQE0X+IYpJkbT7BU\"",
    "mtime": "2025-12-15T04:12:25.996Z",
    "size": 31727,
    "path": "../public/shiki/themes/dracula.json"
  },
  "/shiki/themes/github-dark-dimmed.json": {
    "type": "application/json",
    "etag": "\"47b3-l1ahidysG9uX6t6ZSQYnNGrWvEM\"",
    "mtime": "2025-12-15T04:12:25.996Z",
    "size": 18355,
    "path": "../public/shiki/themes/github-dark-dimmed.json"
  },
  "/shiki/themes/github-dark.json": {
    "type": "application/json",
    "etag": "\"47ac-ljKAGApitNo5U6vjLb/wyJZ8ESE\"",
    "mtime": "2025-12-15T04:12:25.996Z",
    "size": 18348,
    "path": "../public/shiki/themes/github-dark.json"
  },
  "/shiki/themes/github-light.json": {
    "type": "application/json",
    "etag": "\"4630-el/xT157U9CdRPTtIIr68XTzxmg\"",
    "mtime": "2025-12-15T04:12:25.996Z",
    "size": 17968,
    "path": "../public/shiki/themes/github-light.json"
  },
  "/shiki/themes/hc_light.json": {
    "type": "application/json",
    "etag": "\"3258-8/0OAMzwmkmxn7wv0YZ/DASH1Hw\"",
    "mtime": "2025-12-15T04:12:25.996Z",
    "size": 12888,
    "path": "../public/shiki/themes/hc_light.json"
  },
  "/shiki/themes/light-plus.json": {
    "type": "application/json",
    "etag": "\"3a92-jRwJG+Fwc9z1DmNyRJ72Q7EaMpA\"",
    "mtime": "2025-12-15T04:12:25.996Z",
    "size": 14994,
    "path": "../public/shiki/themes/light-plus.json"
  },
  "/shiki/themes/material-darker.json": {
    "type": "application/json",
    "etag": "\"667b-n7i1z0z7KBrjfnEYUTv5RYTf3Bg\"",
    "mtime": "2025-12-15T04:12:25.997Z",
    "size": 26235,
    "path": "../public/shiki/themes/material-darker.json"
  },
  "/shiki/themes/material-default.json": {
    "type": "application/json",
    "etag": "\"667c-mtud6sJ0Ne+/dL8dxB2DfCH/RE4\"",
    "mtime": "2025-12-15T04:12:25.997Z",
    "size": 26236,
    "path": "../public/shiki/themes/material-default.json"
  },
  "/shiki/themes/material-lighter.json": {
    "type": "application/json",
    "etag": "\"667e-fq8RpqxwAOQx70NC/hQHCbQPuwU\"",
    "mtime": "2025-12-15T04:12:25.997Z",
    "size": 26238,
    "path": "../public/shiki/themes/material-lighter.json"
  },
  "/shiki/themes/material-ocean.json": {
    "type": "application/json",
    "etag": "\"667c-oJj6+aBWhiO0TpPSRFvC2Nq2Byg\"",
    "mtime": "2025-12-15T04:12:25.997Z",
    "size": 26236,
    "path": "../public/shiki/themes/material-ocean.json"
  },
  "/shiki/themes/material-palenight.json": {
    "type": "application/json",
    "etag": "\"667e-w+BMZNz5w/HQFgQKJe9jgpnOUME\"",
    "mtime": "2025-12-15T04:12:25.997Z",
    "size": 26238,
    "path": "../public/shiki/themes/material-palenight.json"
  },
  "/shiki/themes/min-dark.json": {
    "type": "application/json",
    "etag": "\"2108-ygVSGZLLsxOyrZnwKZlCQf7sDvQ\"",
    "mtime": "2025-12-15T04:12:25.997Z",
    "size": 8456,
    "path": "../public/shiki/themes/min-dark.json"
  },
  "/shiki/themes/min-light.json": {
    "type": "application/json",
    "etag": "\"23ae-BElcvsCMyTKmeho7vRSxgMoZL/4\"",
    "mtime": "2025-12-15T04:12:25.997Z",
    "size": 9134,
    "path": "../public/shiki/themes/min-light.json"
  },
  "/shiki/themes/monokai.json": {
    "type": "application/json",
    "etag": "\"2fb2-A6NjyiJOt+KXS6qiZpMbeIHhomY\"",
    "mtime": "2025-12-15T04:12:25.997Z",
    "size": 12210,
    "path": "../public/shiki/themes/monokai.json"
  },
  "/shiki/themes/nord.json": {
    "type": "application/json",
    "etag": "\"a37e-wAL7NEUoQPvY4gTfHWy7fbRKfDw\"",
    "mtime": "2025-12-15T04:12:25.997Z",
    "size": 41854,
    "path": "../public/shiki/themes/nord.json"
  },
  "/shiki/themes/one-dark-pro.json": {
    "type": "application/json",
    "etag": "\"de2b-RijSRDKuZ41T9O0vxgNA+8zA0vk\"",
    "mtime": "2025-12-15T04:12:25.998Z",
    "size": 56875,
    "path": "../public/shiki/themes/one-dark-pro.json"
  },
  "/shiki/themes/one-dark.json": {
    "type": "application/json",
    "etag": "\"bd79-W+yDId1mKod8AxHzqIfEzTGii4k\"",
    "mtime": "2025-12-15T04:12:25.997Z",
    "size": 48505,
    "path": "../public/shiki/themes/one-dark.json"
  },
  "/shiki/themes/one-light.json": {
    "type": "application/json",
    "etag": "\"bd7a-p+LQKMejfRSFMeVSxS5Mkb2a31k\"",
    "mtime": "2025-12-15T04:12:25.998Z",
    "size": 48506,
    "path": "../public/shiki/themes/one-light.json"
  },
  "/shiki/themes/poimandres.json": {
    "type": "application/json",
    "etag": "\"a3c2-9U4tA0maye54GzAcDrLjgA2NZ/Y\"",
    "mtime": "2025-12-15T04:12:25.998Z",
    "size": 41922,
    "path": "../public/shiki/themes/poimandres.json"
  },
  "/shiki/themes/rajoyish.json": {
    "type": "application/json",
    "etag": "\"966c-g1eF0cl6bZjYSawV+1WhFaH5+ys\"",
    "mtime": "2025-12-15T04:12:25.997Z",
    "size": 38508,
    "path": "../public/shiki/themes/rajoyish.json"
  },
  "/shiki/themes/rose-pine-dawn.json": {
    "type": "application/json",
    "etag": "\"644e-Q3Lt2FYIb0OJNZpjSpdZz9l7NSY\"",
    "mtime": "2025-12-15T04:12:25.998Z",
    "size": 25678,
    "path": "../public/shiki/themes/rose-pine-dawn.json"
  },
  "/shiki/themes/rose-pine-moon.json": {
    "type": "application/json",
    "etag": "\"644d-mYKhA0O+UnC5b0OwF8+3vxxUbVs\"",
    "mtime": "2025-12-15T04:12:25.999Z",
    "size": 25677,
    "path": "../public/shiki/themes/rose-pine-moon.json"
  },
  "/shiki/themes/rose-pine.json": {
    "type": "application/json",
    "etag": "\"6448-NqblREcR8OgVGxPCWuIDDxmeIPA\"",
    "mtime": "2025-12-15T04:12:25.999Z",
    "size": 25672,
    "path": "../public/shiki/themes/rose-pine.json"
  },
  "/shiki/themes/slack-dark.json": {
    "type": "application/json",
    "etag": "\"3565-2cVIJ7y9sysQ1rkMnqbTdOr9cyA\"",
    "mtime": "2025-12-15T04:12:25.998Z",
    "size": 13669,
    "path": "../public/shiki/themes/slack-dark.json"
  },
  "/shiki/themes/slack-ochin.json": {
    "type": "application/json",
    "etag": "\"3444-gxwQOHtXFA31W2RWydDaqyhg8bs\"",
    "mtime": "2025-12-15T04:12:25.998Z",
    "size": 13380,
    "path": "../public/shiki/themes/slack-ochin.json"
  },
  "/shiki/themes/solarized-dark.json": {
    "type": "application/json",
    "etag": "\"2869-qhsDUnqAnRTFnQVvoPJt/vzbyE4\"",
    "mtime": "2025-12-15T04:12:25.998Z",
    "size": 10345,
    "path": "../public/shiki/themes/solarized-dark.json"
  },
  "/shiki/themes/solarized-light.json": {
    "type": "application/json",
    "etag": "\"26c9-DtsmjQ+HXKqFYVqApBwlffEBmjA\"",
    "mtime": "2025-12-15T04:12:25.999Z",
    "size": 9929,
    "path": "../public/shiki/themes/solarized-light.json"
  },
  "/shiki/themes/synthwave-80s-blue.json": {
    "type": "application/json",
    "etag": "\"b9b9-L/sNSDFDnJpZWOPRK6tvHYUayuk\"",
    "mtime": "2025-12-15T04:12:26.000Z",
    "size": 47545,
    "path": "../public/shiki/themes/synthwave-80s-blue.json"
  },
  "/shiki/themes/synthwave-80s-green.json": {
    "type": "application/json",
    "etag": "\"b9ba-oztGxRqq8Vb2ZPGh3h7R3be1S4w\"",
    "mtime": "2025-12-15T04:12:25.999Z",
    "size": 47546,
    "path": "../public/shiki/themes/synthwave-80s-green.json"
  },
  "/shiki/themes/synthwave-80s.json": {
    "type": "application/json",
    "etag": "\"b9b4-rCjL5Sq3lGLIvOhOWpUQr1yUTYs\"",
    "mtime": "2025-12-15T04:12:25.999Z",
    "size": 47540,
    "path": "../public/shiki/themes/synthwave-80s.json"
  },
  "/shiki/themes/synthwave-84.json": {
    "type": "application/json",
    "etag": "\"5608-EbWMInOMR5oq87t+2lzzzHQBQEY\"",
    "mtime": "2025-12-15T04:12:26.000Z",
    "size": 22024,
    "path": "../public/shiki/themes/synthwave-84.json"
  },
  "/shiki/themes/synthwave-x.json": {
    "type": "application/json",
    "etag": "\"46fc-JOnn8U5UklL5EfkZzhctzW9pNm4\"",
    "mtime": "2025-12-15T04:12:26.000Z",
    "size": 18172,
    "path": "../public/shiki/themes/synthwave-x.json"
  },
  "/shiki/themes/tailwind-dark.json": {
    "type": "application/json",
    "etag": "\"2d14-3NGglKcI5rwYd0ttT6ePp7EY8Sk\"",
    "mtime": "2025-12-15T04:12:26.000Z",
    "size": 11540,
    "path": "../public/shiki/themes/tailwind-dark.json"
  },
  "/shiki/themes/tailwind-light.json": {
    "type": "application/json",
    "etag": "\"2d04-Z3WNX3iPLgrOjapIRgqMMyQJM4I\"",
    "mtime": "2025-12-15T04:12:26.001Z",
    "size": 11524,
    "path": "../public/shiki/themes/tailwind-light.json"
  },
  "/shiki/themes/vitesse-dark.json": {
    "type": "application/json",
    "etag": "\"6cf0-L68lGSVDX7TM+L3n8QBApseelSE\"",
    "mtime": "2025-12-15T04:12:26.000Z",
    "size": 27888,
    "path": "../public/shiki/themes/vitesse-dark.json"
  },
  "/shiki/themes/vitesse-light.json": {
    "type": "application/json",
    "etag": "\"6c3a-7oBebgnZ62dlIRFhUxIdhgcsOxg\"",
    "mtime": "2025-12-15T04:12:26.000Z",
    "size": 27706,
    "path": "../public/shiki/themes/vitesse-light.json"
  },
  "/shiki/languages/abap.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"5015-0/uVGMZlfbtlDEMGbGLOMMve2yI\"",
    "mtime": "2025-12-15T04:12:25.969Z",
    "size": 20501,
    "path": "../public/shiki/languages/abap.tmLanguage.json"
  },
  "/shiki/languages/actionscript-3.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"58b2-5c5Uua5624aduU3H5hQalhcYsRE\"",
    "mtime": "2025-12-15T04:12:25.972Z",
    "size": 22706,
    "path": "../public/shiki/languages/actionscript-3.tmLanguage.json"
  },
  "/shiki/languages/ada.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"15a55-ZivusMnkl0uF8/6ItYppGVDdqAo\"",
    "mtime": "2025-12-15T04:12:25.971Z",
    "size": 88661,
    "path": "../public/shiki/languages/ada.tmLanguage.json"
  },
  "/shiki/languages/all.json": {
    "type": "application/json",
    "etag": "\"3d06-20pw198MfkxyCcaxlOxPHFTQ6Xo\"",
    "mtime": "2025-12-15T04:12:25.970Z",
    "size": 15622,
    "path": "../public/shiki/languages/all.json"
  },
  "/shiki/languages/antlers.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3547-a3VlZmT33gzHwHZEJM6TgIKdSy0\"",
    "mtime": "2025-12-15T04:12:25.970Z",
    "size": 13639,
    "path": "../public/shiki/languages/antlers.tmLanguage.json"
  },
  "/shiki/languages/apache.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"4411-OydPtBY3x0OBqhZuS0zResD0V6k\"",
    "mtime": "2025-12-15T04:12:25.971Z",
    "size": 17425,
    "path": "../public/shiki/languages/apache.tmLanguage.json"
  },
  "/shiki/languages/apex.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"13f11-ruqypx63Toz7mhyQsbRpt78Bqiw\"",
    "mtime": "2025-12-15T04:12:25.971Z",
    "size": 81681,
    "path": "../public/shiki/languages/apex.tmLanguage.json"
  },
  "/shiki/languages/apl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"aba6-i0BK5QmSObGys/ya/Ws+EttZ4/8\"",
    "mtime": "2025-12-15T04:12:25.971Z",
    "size": 43942,
    "path": "../public/shiki/languages/apl.tmLanguage.json"
  },
  "/shiki/languages/applescript.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"b7cd-kC2U0OsfuM5lS6YeQWv24ESaEJI\"",
    "mtime": "2025-12-15T04:12:25.972Z",
    "size": 47053,
    "path": "../public/shiki/languages/applescript.tmLanguage.json"
  },
  "/shiki/languages/asm.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"e03d-6ps6/EV77IMjqVgJ6ABPlhh0gpo\"",
    "mtime": "2025-12-15T04:12:25.972Z",
    "size": 57405,
    "path": "../public/shiki/languages/asm.tmLanguage.json"
  },
  "/shiki/languages/astro.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"855f-YT4nOnMPt6oUjNxnlMo0gP3RtgI\"",
    "mtime": "2025-12-15T04:12:25.971Z",
    "size": 34143,
    "path": "../public/shiki/languages/astro.tmLanguage.json"
  },
  "/shiki/languages/awk.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"221c-7b7lEfk/uGVvxcT92CQQZpbWiiU\"",
    "mtime": "2025-12-15T04:12:25.972Z",
    "size": 8732,
    "path": "../public/shiki/languages/awk.tmLanguage.json"
  },
  "/shiki/languages/ballerina.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"19409-bkzIkUjrBLz7p6RoOww1K5eakDE\"",
    "mtime": "2025-12-15T04:12:25.973Z",
    "size": 103433,
    "path": "../public/shiki/languages/ballerina.tmLanguage.json"
  },
  "/shiki/languages/bat.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"58cc-TdVse2MbW1ibFjC7XySSGEMPL70\"",
    "mtime": "2025-12-15T04:12:25.972Z",
    "size": 22732,
    "path": "../public/shiki/languages/bat.tmLanguage.json"
  },
  "/shiki/languages/berry.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"f05-oEdKxRmdBy9jLnZR48fueQTcLA4\"",
    "mtime": "2025-12-15T04:12:25.973Z",
    "size": 3845,
    "path": "../public/shiki/languages/berry.tmLanguage.json"
  },
  "/shiki/languages/bibtex.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"2086-lOP+T5EVyHg7GHWiP7LUlwoQ4dc\"",
    "mtime": "2025-12-15T04:12:25.973Z",
    "size": 8326,
    "path": "../public/shiki/languages/bibtex.tmLanguage.json"
  },
  "/shiki/languages/bicep.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"17b6-zmF/zg/GgBO/FU5T9vHSjuy/VVE\"",
    "mtime": "2025-12-15T04:12:25.973Z",
    "size": 6070,
    "path": "../public/shiki/languages/bicep.tmLanguage.json"
  },
  "/shiki/languages/blade.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"26260-GRwE/6KSKzIyOEctASWbeAajPYM\"",
    "mtime": "2025-12-15T04:12:25.973Z",
    "size": 156256,
    "path": "../public/shiki/languages/blade.tmLanguage.json"
  },
  "/shiki/languages/c.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1dec6-SE58pRWIqZ4QM6FnVvsIq6JMwyo\"",
    "mtime": "2025-12-15T04:12:25.973Z",
    "size": 122566,
    "path": "../public/shiki/languages/c.tmLanguage.json"
  },
  "/shiki/languages/cadence.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"48ff-Zu1QAhRSmA+fr+91mghlh65nZTw\"",
    "mtime": "2025-12-15T04:12:25.973Z",
    "size": 18687,
    "path": "../public/shiki/languages/cadence.tmLanguage.json"
  },
  "/shiki/languages/clojure.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"2a53-aBmquM8Dpr9OEbuK5fi+NnMRlxk\"",
    "mtime": "2025-12-15T04:12:25.973Z",
    "size": 10835,
    "path": "../public/shiki/languages/clojure.tmLanguage.json"
  },
  "/shiki/languages/cobol.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"b593-cCpRAEG6dDF+NrV6dTma8h1hxyE\"",
    "mtime": "2025-12-15T04:12:25.974Z",
    "size": 46483,
    "path": "../public/shiki/languages/cobol.tmLanguage.json"
  },
  "/shiki/languages/codeql.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"aba6-6tXuh75Gi9S21PyNLcT+SKOKDg8\"",
    "mtime": "2025-12-15T04:12:25.974Z",
    "size": 43942,
    "path": "../public/shiki/languages/codeql.tmLanguage.json"
  },
  "/shiki/languages/coffee.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"a1b4-4Ny2igle2SNFBdBiLjkJ0e2pRJw\"",
    "mtime": "2025-12-15T04:12:25.974Z",
    "size": 41396,
    "path": "../public/shiki/languages/coffee.tmLanguage.json"
  },
  "/shiki/languages/cpp-macro.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"58cf6-SzIRrkSBfOTy0kp8V0FAmGBI0r4\"",
    "mtime": "2025-12-15T04:12:25.975Z",
    "size": 363766,
    "path": "../public/shiki/languages/cpp-macro.tmLanguage.json"
  },
  "/shiki/languages/cpp.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"a0640-kr995VR9D0waBKbNE3QnxYHyRZQ\"",
    "mtime": "2025-12-15T04:12:25.977Z",
    "size": 656960,
    "path": "../public/shiki/languages/cpp.tmLanguage.json"
  },
  "/shiki/languages/crystal.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"c02c-CxSBssEUISYmKL8o4/aHdbuQpFs\"",
    "mtime": "2025-12-15T04:12:25.975Z",
    "size": 49196,
    "path": "../public/shiki/languages/crystal.tmLanguage.json"
  },
  "/shiki/languages/csharp.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"26575-qvvpc9vCxthWGEwR5giFVJ4ELGk\"",
    "mtime": "2025-12-15T04:12:25.974Z",
    "size": 157045,
    "path": "../public/shiki/languages/csharp.tmLanguage.json"
  },
  "/shiki/languages/css.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"13bd1-0oa9fDt7CXFDKSuX+b4RBVZsB68\"",
    "mtime": "2025-12-15T04:12:25.975Z",
    "size": 80849,
    "path": "../public/shiki/languages/css.tmLanguage.json"
  },
  "/shiki/languages/cue.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"815f-leuwDfS2RhCFD8qZ87kIemrH7s4\"",
    "mtime": "2025-12-15T04:12:25.975Z",
    "size": 33119,
    "path": "../public/shiki/languages/cue.tmLanguage.json"
  },
  "/shiki/languages/d.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"11fd3-I1+ZM4ACTtO14omk+MnLZVBEgDk\"",
    "mtime": "2025-12-15T04:12:25.976Z",
    "size": 73683,
    "path": "../public/shiki/languages/d.tmLanguage.json"
  },
  "/shiki/languages/dart.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"32fd-jYpmhCGvVGxOomrpCjmbxnvO9xI\"",
    "mtime": "2025-12-15T04:12:25.976Z",
    "size": 13053,
    "path": "../public/shiki/languages/dart.tmLanguage.json"
  },
  "/shiki/languages/diff.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"105a-agJ3+GlHhHEjhhjk+nT1i1+S0mg\"",
    "mtime": "2025-12-15T04:12:25.976Z",
    "size": 4186,
    "path": "../public/shiki/languages/diff.tmLanguage.json"
  },
  "/shiki/languages/docker.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"aec-0kwy5UHFJsUmeCEYHFJLzerYZKo\"",
    "mtime": "2025-12-15T04:12:25.976Z",
    "size": 2796,
    "path": "../public/shiki/languages/docker.tmLanguage.json"
  },
  "/shiki/languages/dream-maker.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"421a-WuPmbJXo1QsM9imVA5Xyi/kFqtQ\"",
    "mtime": "2025-12-15T04:12:25.976Z",
    "size": 16922,
    "path": "../public/shiki/languages/dream-maker.tmLanguage.json"
  },
  "/shiki/languages/elixir.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"72cd-IEJx4LFqEOr5O1pExMp4sy7vZL8\"",
    "mtime": "2025-12-15T04:12:25.976Z",
    "size": 29389,
    "path": "../public/shiki/languages/elixir.tmLanguage.json"
  },
  "/shiki/languages/elm.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"43a8-534SGjmuzEmrnvdwy1jsA/M1rSg\"",
    "mtime": "2025-12-15T04:12:25.976Z",
    "size": 17320,
    "path": "../public/shiki/languages/elm.tmLanguage.json"
  },
  "/shiki/languages/erb.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"eab-GkYZSiybyseTy3PMVHIM+Hf5hYY\"",
    "mtime": "2025-12-15T04:12:25.977Z",
    "size": 3755,
    "path": "../public/shiki/languages/erb.tmLanguage.json"
  },
  "/shiki/languages/erlang.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"bfda-Yl8Uyh5k0r5Xv94mRMA5GfvBGBE\"",
    "mtime": "2025-12-15T04:12:25.978Z",
    "size": 49114,
    "path": "../public/shiki/languages/erlang.tmLanguage.json"
  },
  "/shiki/languages/fish.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1b57-8zm3E0dOtpJO/hJFa+8cUCJ9rvo\"",
    "mtime": "2025-12-15T04:12:25.977Z",
    "size": 6999,
    "path": "../public/shiki/languages/fish.tmLanguage.json"
  },
  "/shiki/languages/fsharp.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"bda3-rkpW4gs5a6ClhS+vPFQDrR5eFUA\"",
    "mtime": "2025-12-15T04:12:25.978Z",
    "size": 48547,
    "path": "../public/shiki/languages/fsharp.tmLanguage.json"
  },
  "/shiki/languages/gherkin.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"346c-ItWqgk1Qk5ynGChYlpdia0tRROg\"",
    "mtime": "2025-12-15T04:12:25.977Z",
    "size": 13420,
    "path": "../public/shiki/languages/gherkin.tmLanguage.json"
  },
  "/shiki/languages/git-commit.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"a74-mH1IxSZ35UhYdy2ZmVJSpDWCpBY\"",
    "mtime": "2025-12-15T04:12:25.977Z",
    "size": 2676,
    "path": "../public/shiki/languages/git-commit.tmLanguage.json"
  },
  "/shiki/languages/git-rebase.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"6a5-VcjezS+9AAGYiKHkk8Q9Ckf5EHg\"",
    "mtime": "2025-12-15T04:12:25.978Z",
    "size": 1701,
    "path": "../public/shiki/languages/git-rebase.tmLanguage.json"
  },
  "/shiki/languages/glsl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1028-43FEvoW8k+aEVxv14aGyGlJQFDI\"",
    "mtime": "2025-12-15T04:12:25.978Z",
    "size": 4136,
    "path": "../public/shiki/languages/glsl.tmLanguage.json"
  },
  "/shiki/languages/gnuplot.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"7573-N+OPlgVDtJkj//Qf//vWOh4OcXM\"",
    "mtime": "2025-12-15T04:12:25.977Z",
    "size": 30067,
    "path": "../public/shiki/languages/gnuplot.tmLanguage.json"
  },
  "/shiki/languages/go.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"156ed-/is7yhR8iZ5zobEYIIJH9My8w4w\"",
    "mtime": "2025-12-15T04:12:25.978Z",
    "size": 87789,
    "path": "../public/shiki/languages/go.tmLanguage.json"
  },
  "/shiki/languages/graphql.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"78c0-yWquhb7tywZ4KNnbml5cixTkWwU\"",
    "mtime": "2025-12-15T04:12:25.978Z",
    "size": 30912,
    "path": "../public/shiki/languages/graphql.tmLanguage.json"
  },
  "/shiki/languages/groovy.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"8bdb-wtbvX3u/Jg8O3wmp/JVm755dzJ0\"",
    "mtime": "2025-12-15T04:12:25.978Z",
    "size": 35803,
    "path": "../public/shiki/languages/groovy.tmLanguage.json"
  },
  "/shiki/languages/hack.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1b92b-VPQfkV2kv6gkkX0scO7K7feJeGc\"",
    "mtime": "2025-12-15T04:12:25.980Z",
    "size": 112939,
    "path": "../public/shiki/languages/hack.tmLanguage.json"
  },
  "/shiki/languages/haml.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"34c0-P/kV3DFeQ4eVMvl6BkQgj0vmu0g\"",
    "mtime": "2025-12-15T04:12:25.979Z",
    "size": 13504,
    "path": "../public/shiki/languages/haml.tmLanguage.json"
  },
  "/shiki/languages/handlebars.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"542d-am2ofeb9GsGO8b2sotR8A1ELVVk\"",
    "mtime": "2025-12-15T04:12:25.979Z",
    "size": 21549,
    "path": "../public/shiki/languages/handlebars.tmLanguage.json"
  },
  "/shiki/languages/haskell.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"146f7-yQ6Tv978pQta/jBKaXSq0za1AlI\"",
    "mtime": "2025-12-15T04:12:25.980Z",
    "size": 83703,
    "path": "../public/shiki/languages/haskell.tmLanguage.json"
  },
  "/shiki/languages/hcl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"237c-31k8cNy2wV0ERIosFWMK45n5I3k\"",
    "mtime": "2025-12-15T04:12:25.980Z",
    "size": 9084,
    "path": "../public/shiki/languages/hcl.tmLanguage.json"
  },
  "/shiki/languages/hlsl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"23a9-5Gs3IcRedjyFrc1XZdLFV7JlOFw\"",
    "mtime": "2025-12-15T04:12:25.979Z",
    "size": 9129,
    "path": "../public/shiki/languages/hlsl.tmLanguage.json"
  },
  "/shiki/languages/html-derivative.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"5fd-K4XwbW+oBzupIw4WkUmHzTUDWl0\"",
    "mtime": "2025-12-15T04:12:25.980Z",
    "size": 1533,
    "path": "../public/shiki/languages/html-derivative.tmLanguage.json"
  },
  "/shiki/languages/html.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1976f-WPg//XtpAJP7LZwHdSo3KMeQkHo\"",
    "mtime": "2025-12-15T04:12:25.980Z",
    "size": 104303,
    "path": "../public/shiki/languages/html.tmLanguage.json"
  },
  "/shiki/languages/ini.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"ad3-TUGv2CFTA/y5sVCmmX8w1nmOZmM\"",
    "mtime": "2025-12-15T04:12:25.980Z",
    "size": 2771,
    "path": "../public/shiki/languages/ini.tmLanguage.json"
  },
  "/shiki/languages/java.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"c3a6-xKmSpB7RsFtj/AnNFPwkRZpx90g\"",
    "mtime": "2025-12-15T04:12:25.980Z",
    "size": 50086,
    "path": "../public/shiki/languages/java.tmLanguage.json"
  },
  "/shiki/languages/javascript.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3e9bb-MNC+JgmE+GmC7Rf16fTyttgEa+A\"",
    "mtime": "2025-12-15T04:12:25.981Z",
    "size": 256443,
    "path": "../public/shiki/languages/javascript.tmLanguage.json"
  },
  "/shiki/languages/jinja-html.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"221-+pOnOKt15nUR5fgUOdeOQYjwMak\"",
    "mtime": "2025-12-15T04:12:25.980Z",
    "size": 545,
    "path": "../public/shiki/languages/jinja-html.tmLanguage.json"
  },
  "/shiki/languages/jinja.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"20f9-64aogvNFiiBvbAIxddYN62NVEoI\"",
    "mtime": "2025-12-15T04:12:25.980Z",
    "size": 8441,
    "path": "../public/shiki/languages/jinja.tmLanguage.json"
  },
  "/shiki/languages/json.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"170b-3JHT3Wu/2O/b4RwGzSGqEZHTqw0\"",
    "mtime": "2025-12-15T04:12:25.980Z",
    "size": 5899,
    "path": "../public/shiki/languages/json.tmLanguage.json"
  },
  "/shiki/languages/jsonc.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"181a-WUkf3rkKO0N1irGKWTwV2GQE7Q0\"",
    "mtime": "2025-12-15T04:12:25.981Z",
    "size": 6170,
    "path": "../public/shiki/languages/jsonc.tmLanguage.json"
  },
  "/shiki/languages/jsonl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"17c0-yaBVltVfmSQGHsZEc3i7eSX5so8\"",
    "mtime": "2025-12-15T04:12:25.981Z",
    "size": 6080,
    "path": "../public/shiki/languages/jsonl.tmLanguage.json"
  },
  "/shiki/languages/jsonnet.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"154a-Ds2nmWW7jFG39tnPvSXM/JJ9sPQ\"",
    "mtime": "2025-12-15T04:12:25.981Z",
    "size": 5450,
    "path": "../public/shiki/languages/jsonnet.tmLanguage.json"
  },
  "/shiki/languages/jssm.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"f69-VbVuf+mQyqjrTQNBypDKdnmKqfo\"",
    "mtime": "2025-12-15T04:12:25.981Z",
    "size": 3945,
    "path": "../public/shiki/languages/jssm.tmLanguage.json"
  },
  "/shiki/languages/jsx.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3f568-fmc/oc7/FN9hbVUcBXrkanE4vmc\"",
    "mtime": "2025-12-15T04:12:25.982Z",
    "size": 259432,
    "path": "../public/shiki/languages/jsx.tmLanguage.json"
  },
  "/shiki/languages/julia.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"b734-9OvxV/OwEEQ1gi000UlkpJxuI+4\"",
    "mtime": "2025-12-15T04:12:25.981Z",
    "size": 46900,
    "path": "../public/shiki/languages/julia.tmLanguage.json"
  },
  "/shiki/languages/jupyter.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"79-d09Xg7SLEkL4ImtBYKaOpF8knWM\"",
    "mtime": "2025-12-15T04:12:25.981Z",
    "size": 121,
    "path": "../public/shiki/languages/jupyter.tmLanguage.json"
  },
  "/shiki/languages/kotlin.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"438f-lcpbQBQjUD4rL5Uh26+8aCGg6ew\"",
    "mtime": "2025-12-15T04:12:25.981Z",
    "size": 17295,
    "path": "../public/shiki/languages/kotlin.tmLanguage.json"
  },
  "/shiki/languages/latex.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"16a9f-0NThUrJLtZDXvuCj9QCMQoDg/RE\"",
    "mtime": "2025-12-15T04:12:25.982Z",
    "size": 92831,
    "path": "../public/shiki/languages/latex.tmLanguage.json"
  },
  "/shiki/languages/less.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"2436e-DnK1YSpgvTVDFKT8t2deoS/sg9o\"",
    "mtime": "2025-12-15T04:12:25.983Z",
    "size": 148334,
    "path": "../public/shiki/languages/less.tmLanguage.json"
  },
  "/shiki/languages/liquid.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"5a94-mBdX9xhe8In64HuA/8uAGvB2duM\"",
    "mtime": "2025-12-15T04:12:25.983Z",
    "size": 23188,
    "path": "../public/shiki/languages/liquid.tmLanguage.json"
  },
  "/shiki/languages/lisp.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3993-YLNn95TlZuor9XyjHFINP8/AcCE\"",
    "mtime": "2025-12-15T04:12:25.983Z",
    "size": 14739,
    "path": "../public/shiki/languages/lisp.tmLanguage.json"
  },
  "/shiki/languages/logo.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"e2c-M6kux7Zm+V14VtyRSxx68/EYu0Y\"",
    "mtime": "2025-12-15T04:12:25.982Z",
    "size": 3628,
    "path": "../public/shiki/languages/logo.tmLanguage.json"
  },
  "/shiki/languages/lua.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"6943-wT7JxelGCJR14MmbAmRwDIAGIzc\"",
    "mtime": "2025-12-15T04:12:25.983Z",
    "size": 26947,
    "path": "../public/shiki/languages/lua.tmLanguage.json"
  },
  "/shiki/languages/make.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3ffb-zkeAZfEG1B3EhdR+KmLZAKnHeCo\"",
    "mtime": "2025-12-15T04:12:25.983Z",
    "size": 16379,
    "path": "../public/shiki/languages/make.tmLanguage.json"
  },
  "/shiki/languages/markdown.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"159fc-XjhZf73Bfdeb4SrswfoVBxDyrmY\"",
    "mtime": "2025-12-15T04:12:25.984Z",
    "size": 88572,
    "path": "../public/shiki/languages/markdown.tmLanguage.json"
  },
  "/shiki/languages/marko.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"8885-H0+7C+LpxIGjL7MAMRddDaYZbRY\"",
    "mtime": "2025-12-15T04:12:25.984Z",
    "size": 34949,
    "path": "../public/shiki/languages/marko.tmLanguage.json"
  },
  "/shiki/languages/matlab.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"908f-nkQsRZrm4aEKpxxGMheWk95IY2M\"",
    "mtime": "2025-12-15T04:12:25.984Z",
    "size": 37007,
    "path": "../public/shiki/languages/matlab.tmLanguage.json"
  },
  "/shiki/languages/mdx.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"52a-IQDs5RJr5P0uzr740TDOB2kORWY\"",
    "mtime": "2025-12-15T04:12:25.984Z",
    "size": 1322,
    "path": "../public/shiki/languages/mdx.tmLanguage.json"
  },
  "/shiki/languages/mermaid.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"eff7-NZeK9lZt898MspHLSDuPL+kB/YU\"",
    "mtime": "2025-12-15T04:12:25.984Z",
    "size": 61431,
    "path": "../public/shiki/languages/mermaid.tmLanguage.json"
  },
  "/shiki/languages/nginx.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"cf09-YFy3yGozK50glGTMDKn9O0XVO2o\"",
    "mtime": "2025-12-15T04:12:25.984Z",
    "size": 53001,
    "path": "../public/shiki/languages/nginx.tmLanguage.json"
  },
  "/shiki/languages/nim.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"9b2e-ff40nqth9Fzq5Qc/hdLZ59AbExc\"",
    "mtime": "2025-12-15T04:12:25.984Z",
    "size": 39726,
    "path": "../public/shiki/languages/nim.tmLanguage.json"
  },
  "/shiki/languages/nix.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"6de7-F8JgvefdzBp14Qv+WtDhvzS7Hx4\"",
    "mtime": "2025-12-15T04:12:25.985Z",
    "size": 28135,
    "path": "../public/shiki/languages/nix.tmLanguage.json"
  },
  "/shiki/languages/objective-c.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"27551-X2EGZrL9hP8dctD70xwbWhC8s8Y\"",
    "mtime": "2025-12-15T04:12:25.985Z",
    "size": 161105,
    "path": "../public/shiki/languages/objective-c.tmLanguage.json"
  },
  "/shiki/languages/objective-cpp.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"452f9-Hq5BGIdfHNNyJeI1xESKg8mQh7A\"",
    "mtime": "2025-12-15T04:12:25.985Z",
    "size": 283385,
    "path": "../public/shiki/languages/objective-cpp.tmLanguage.json"
  },
  "/shiki/languages/ocaml.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1825a-wP8+EEO0mHqDvbm+bCfkHQkAY0s\"",
    "mtime": "2025-12-15T04:12:25.986Z",
    "size": 98906,
    "path": "../public/shiki/languages/ocaml.tmLanguage.json"
  },
  "/shiki/languages/pascal.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1150-L+RotDUg2BHPOQO/YYHCVWPcx3M\"",
    "mtime": "2025-12-15T04:12:25.985Z",
    "size": 4432,
    "path": "../public/shiki/languages/pascal.tmLanguage.json"
  },
  "/shiki/languages/perl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"134d3-+g7nEB4jRkB3kLGvTzimximDgt8\"",
    "mtime": "2025-12-15T04:12:25.986Z",
    "size": 79059,
    "path": "../public/shiki/languages/perl.tmLanguage.json"
  },
  "/shiki/languages/php-html.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"a82-AY4gd7TIqtoB3TB132RCQh+e/mo\"",
    "mtime": "2025-12-15T04:12:25.986Z",
    "size": 2690,
    "path": "../public/shiki/languages/php-html.tmLanguage.json"
  },
  "/shiki/languages/php.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"26923-E4LrSUvDGZb1iNc+Ys/KKDN8rpA\"",
    "mtime": "2025-12-15T04:12:25.986Z",
    "size": 157987,
    "path": "../public/shiki/languages/php.tmLanguage.json"
  },
  "/shiki/languages/plsql.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"2687-Fo6F6PALtar2y4niYU/bREgBhmI\"",
    "mtime": "2025-12-15T04:12:25.986Z",
    "size": 9863,
    "path": "../public/shiki/languages/plsql.tmLanguage.json"
  },
  "/shiki/languages/postcss.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"23e2-2Sp96p8VpD3FodTaxNycF7XaH3U\"",
    "mtime": "2025-12-15T04:12:25.986Z",
    "size": 9186,
    "path": "../public/shiki/languages/postcss.tmLanguage.json"
  },
  "/shiki/languages/powershell.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"7f6a-xW1nCgH0gqNt3ZU8guj8jV0lgfs\"",
    "mtime": "2025-12-15T04:12:25.986Z",
    "size": 32618,
    "path": "../public/shiki/languages/powershell.tmLanguage.json"
  },
  "/shiki/languages/prisma.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"2731-1ZmHskOwFdIPhjERc/Chw71ilCw\"",
    "mtime": "2025-12-15T04:12:25.986Z",
    "size": 10033,
    "path": "../public/shiki/languages/prisma.tmLanguage.json"
  },
  "/shiki/languages/prolog.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3800-xwmuzq+iEfA/HRrKFe2KchBaG78\"",
    "mtime": "2025-12-15T04:12:25.986Z",
    "size": 14336,
    "path": "../public/shiki/languages/prolog.tmLanguage.json"
  },
  "/shiki/languages/pug.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"60a9-NF10Kv/Wrzq74Eqgll03tiooRZo\"",
    "mtime": "2025-12-15T04:12:25.986Z",
    "size": 24745,
    "path": "../public/shiki/languages/pug.tmLanguage.json"
  },
  "/shiki/languages/puppet.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"4a43-sKJsfU2BuIJnY7+qpAUhl0tMyVg\"",
    "mtime": "2025-12-15T04:12:25.986Z",
    "size": 19011,
    "path": "../public/shiki/languages/puppet.tmLanguage.json"
  },
  "/shiki/languages/purescript.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"6b39-P4EXDnlnYeeUjloPcTzfcYhibBs\"",
    "mtime": "2025-12-15T04:12:25.986Z",
    "size": 27449,
    "path": "../public/shiki/languages/purescript.tmLanguage.json"
  },
  "/shiki/languages/python.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1cee0-ygpiosr2tWRZP11lmwjPTtrEjGU\"",
    "mtime": "2025-12-15T04:12:25.988Z",
    "size": 118496,
    "path": "../public/shiki/languages/python.tmLanguage.json"
  },
  "/shiki/languages/r.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"a4ee-HIHNQcsnvrgVkBdHJr0IiAUPjTg\"",
    "mtime": "2025-12-15T04:12:25.988Z",
    "size": 42222,
    "path": "../public/shiki/languages/r.tmLanguage.json"
  },
  "/shiki/languages/raku.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"332c-qJJKSxTTPvUHXpmKNn+ioH0syLI\"",
    "mtime": "2025-12-15T04:12:25.987Z",
    "size": 13100,
    "path": "../public/shiki/languages/raku.tmLanguage.json"
  },
  "/shiki/languages/razor.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"88b5-evohVUpuOxK+xC/X7tsANqHw4dk\"",
    "mtime": "2025-12-15T04:12:25.988Z",
    "size": 34997,
    "path": "../public/shiki/languages/razor.tmLanguage.json"
  },
  "/shiki/languages/rel.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1457-tM1cclIIr1ImWGlOJYZMH8xLo24\"",
    "mtime": "2025-12-15T04:12:25.987Z",
    "size": 5207,
    "path": "../public/shiki/languages/rel.tmLanguage.json"
  },
  "/shiki/languages/riscv.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"2790-Q9x8m3A2dq7PsYSQcmUkojcsOTM\"",
    "mtime": "2025-12-15T04:12:25.987Z",
    "size": 10128,
    "path": "../public/shiki/languages/riscv.tmLanguage.json"
  },
  "/shiki/languages/rst.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3ff3-KBRa4x1GIXWo3IxqC5tKk+Azhb4\"",
    "mtime": "2025-12-15T04:12:25.988Z",
    "size": 16371,
    "path": "../public/shiki/languages/rst.tmLanguage.json"
  },
  "/shiki/languages/ruby.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"13420-TJhh5tqpWSuAfPNGi4z5d5Xcyrc\"",
    "mtime": "2025-12-15T04:12:25.988Z",
    "size": 78880,
    "path": "../public/shiki/languages/ruby.tmLanguage.json"
  },
  "/shiki/languages/rust.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"77d1-HPQBYuapWRgncviZ1rrIbsYfQ+Y\"",
    "mtime": "2025-12-15T04:12:25.988Z",
    "size": 30673,
    "path": "../public/shiki/languages/rust.tmLanguage.json"
  },
  "/shiki/languages/sas.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"30b4-bKN/8QSDm6v5VoQ2rUBd3xF3S1k\"",
    "mtime": "2025-12-15T04:12:25.989Z",
    "size": 12468,
    "path": "../public/shiki/languages/sas.tmLanguage.json"
  },
  "/shiki/languages/sass.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"36f1-nCPo0OrBLgEgkxdxhZQcIKASoFo\"",
    "mtime": "2025-12-15T04:12:25.989Z",
    "size": 14065,
    "path": "../public/shiki/languages/sass.tmLanguage.json"
  },
  "/shiki/languages/scala.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"97ce-Q+xjsFeuup12IgFy4OB3kw3iu2s\"",
    "mtime": "2025-12-15T04:12:25.988Z",
    "size": 38862,
    "path": "../public/shiki/languages/scala.tmLanguage.json"
  },
  "/shiki/languages/scheme.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3d17-ISzhSQGPeO0kxcq5zIr24P4t828\"",
    "mtime": "2025-12-15T04:12:25.989Z",
    "size": 15639,
    "path": "../public/shiki/languages/scheme.tmLanguage.json"
  },
  "/shiki/languages/scss.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"c49a-OZ+RzvQ0NpStDG1CUFcAAvglhfA\"",
    "mtime": "2025-12-15T04:12:25.989Z",
    "size": 50330,
    "path": "../public/shiki/languages/scss.tmLanguage.json"
  },
  "/shiki/languages/shaderlab.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1f5a-0w4dwoaoC7wy+QUVKN2pHTDKA0c\"",
    "mtime": "2025-12-15T04:12:25.989Z",
    "size": 8026,
    "path": "../public/shiki/languages/shaderlab.tmLanguage.json"
  },
  "/shiki/languages/shellscript.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1084f-5yXzPtB7p/R42tkZmdNmvX039Ms\"",
    "mtime": "2025-12-15T04:12:25.989Z",
    "size": 67663,
    "path": "../public/shiki/languages/shellscript.tmLanguage.json"
  },
  "/shiki/languages/smalltalk.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1884-9fcz8C17UasS7Gv7PeIG6Bt2yvc\"",
    "mtime": "2025-12-15T04:12:25.989Z",
    "size": 6276,
    "path": "../public/shiki/languages/smalltalk.tmLanguage.json"
  },
  "/shiki/languages/snippets.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"5c3ae-GwKSdaPdq733wIUNq5DH4/JWJr0\"",
    "mtime": "2025-12-15T04:12:25.990Z",
    "size": 377774,
    "path": "../public/shiki/languages/snippets.tmLanguage.json"
  },
  "/shiki/languages/solidity.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"6a79-by3IDcsj82r8sorZFh0sijToYCw\"",
    "mtime": "2025-12-15T04:12:25.990Z",
    "size": 27257,
    "path": "../public/shiki/languages/solidity.tmLanguage.json"
  },
  "/shiki/languages/sparql.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"60d-ik/RVh8tJ95hkCmX2MyY2bxEj3I\"",
    "mtime": "2025-12-15T04:12:25.990Z",
    "size": 1549,
    "path": "../public/shiki/languages/sparql.tmLanguage.json"
  },
  "/shiki/languages/sql.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"7570-vdZ8jA4lCnnXYL2nqXe8Wdp8hV8\"",
    "mtime": "2025-12-15T04:12:25.990Z",
    "size": 30064,
    "path": "../public/shiki/languages/sql.tmLanguage.json"
  },
  "/shiki/languages/ssh-config.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1078-J4Jin8DBCxmu1kHrlDvbzGLHpb4\"",
    "mtime": "2025-12-15T04:12:25.990Z",
    "size": 4216,
    "path": "../public/shiki/languages/ssh-config.tmLanguage.json"
  },
  "/shiki/languages/stata.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"181b7-9fcf6UpY8JR80h5EEpQe0wHmGaQ\"",
    "mtime": "2025-12-15T04:12:25.991Z",
    "size": 98743,
    "path": "../public/shiki/languages/stata.tmLanguage.json"
  },
  "/shiki/languages/stylus.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"ae96-I+iYJvcDzn2ZynbGO+e8bLlMMXk\"",
    "mtime": "2025-12-15T04:12:25.990Z",
    "size": 44694,
    "path": "../public/shiki/languages/stylus.tmLanguage.json"
  },
  "/shiki/languages/svelte.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"68ec-c5132fkA9W2S2uFf0WtWP84EuSA\"",
    "mtime": "2025-12-15T04:12:25.991Z",
    "size": 26860,
    "path": "../public/shiki/languages/svelte.tmLanguage.json"
  },
  "/shiki/languages/swift.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"24d39-WyDA4Wu60YRkRYbOFCMxteMv/8Y\"",
    "mtime": "2025-12-15T04:12:25.991Z",
    "size": 150841,
    "path": "../public/shiki/languages/swift.tmLanguage.json"
  },
  "/shiki/languages/system-verilog.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"7369-iclnY1G+G9vpA73VJ1enEGTXpzo\"",
    "mtime": "2025-12-15T04:12:25.991Z",
    "size": 29545,
    "path": "../public/shiki/languages/system-verilog.tmLanguage.json"
  },
  "/shiki/languages/tasl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"16c0-14CqPiyqJSVRxWWuyyFfMzehNsU\"",
    "mtime": "2025-12-15T04:12:25.991Z",
    "size": 5824,
    "path": "../public/shiki/languages/tasl.tmLanguage.json"
  },
  "/shiki/languages/tcl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1cea-HdRxRZo51ZlYf8fRA1aiAnKT+zc\"",
    "mtime": "2025-12-15T04:12:25.991Z",
    "size": 7402,
    "path": "../public/shiki/languages/tcl.tmLanguage.json"
  },
  "/shiki/languages/tex.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"324b-oDGM+2cqzMHEVa0Cz3x88bj0dCQ\"",
    "mtime": "2025-12-15T04:12:25.991Z",
    "size": 12875,
    "path": "../public/shiki/languages/tex.tmLanguage.json"
  },
  "/shiki/languages/toml.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"33b4-rBq1exUf93JH64/Dvnzj+khgfII\"",
    "mtime": "2025-12-15T04:12:25.991Z",
    "size": 13236,
    "path": "../public/shiki/languages/toml.tmLanguage.json"
  },
  "/shiki/languages/tsx.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3eca1-tvQHPKcKPK9XHtUuC3kklRaz8Yc\"",
    "mtime": "2025-12-15T04:12:25.992Z",
    "size": 257185,
    "path": "../public/shiki/languages/tsx.tmLanguage.json"
  },
  "/shiki/languages/turtle.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1635-OQ7UlIM59KwwUuq6Pad4LDYeauU\"",
    "mtime": "2025-12-15T04:12:25.992Z",
    "size": 5685,
    "path": "../public/shiki/languages/turtle.tmLanguage.json"
  },
  "/shiki/languages/twig.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"87b2-iel804dSrMyr8JtnGrkAY0pJZ+0\"",
    "mtime": "2025-12-15T04:12:25.992Z",
    "size": 34738,
    "path": "../public/shiki/languages/twig.tmLanguage.json"
  },
  "/shiki/languages/typescript.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3f6fd-+el7Vuep3/vntiSmiGY7OidFV/Q\"",
    "mtime": "2025-12-15T04:12:25.992Z",
    "size": 259837,
    "path": "../public/shiki/languages/typescript.tmLanguage.json"
  },
  "/shiki/languages/vb.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"20e4-SqeguNCxsvJO9WlxEHxOzsKMUOQ\"",
    "mtime": "2025-12-15T04:12:25.992Z",
    "size": 8420,
    "path": "../public/shiki/languages/vb.tmLanguage.json"
  },
  "/shiki/languages/verilog.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"236d-NXC3Y4iRL7fd2y0nInh4wmtcJtk\"",
    "mtime": "2025-12-15T04:12:25.992Z",
    "size": 9069,
    "path": "../public/shiki/languages/verilog.tmLanguage.json"
  },
  "/shiki/languages/vhdl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"c608-rAU/Ev037sEt3KOTd5sXpxySdzw\"",
    "mtime": "2025-12-15T04:12:25.993Z",
    "size": 50696,
    "path": "../public/shiki/languages/vhdl.tmLanguage.json"
  },
  "/shiki/languages/viml.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"628e-zyCfwrDOnxe7FDbSXuiy54uGLF0\"",
    "mtime": "2025-12-15T04:12:25.993Z",
    "size": 25230,
    "path": "../public/shiki/languages/viml.tmLanguage.json"
  },
  "/shiki/languages/vue-html.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3570-dJ36EQVw3Z3itfof8eGbINdJcGc\"",
    "mtime": "2025-12-15T04:12:25.994Z",
    "size": 13680,
    "path": "../public/shiki/languages/vue-html.tmLanguage.json"
  },
  "/shiki/languages/vue.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"769b-4dfQAjb/Ipr0I4TMvHkEE67n9gs\"",
    "mtime": "2025-12-15T04:12:25.993Z",
    "size": 30363,
    "path": "../public/shiki/languages/vue.tmLanguage.json"
  },
  "/shiki/languages/wasm.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"5dab-kWiEFcOLxJfx8Tm/jASyZZKc55g\"",
    "mtime": "2025-12-15T04:12:25.993Z",
    "size": 23979,
    "path": "../public/shiki/languages/wasm.tmLanguage.json"
  },
  "/shiki/languages/wenyan.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"cc3-sEoEJ6VDHr0YFUif6lx1u4d+MKs\"",
    "mtime": "2025-12-15T04:12:25.994Z",
    "size": 3267,
    "path": "../public/shiki/languages/wenyan.tmLanguage.json"
  },
  "/shiki/languages/xml.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"23d8-YGijHOIGfhXYGZAe3A6phkfpkrc\"",
    "mtime": "2025-12-15T04:12:25.993Z",
    "size": 9176,
    "path": "../public/shiki/languages/xml.tmLanguage.json"
  },
  "/shiki/languages/xsl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"98a-MxIT5UI8aIQ5HHA65+vSl7eXSEY\"",
    "mtime": "2025-12-15T04:12:25.993Z",
    "size": 2442,
    "path": "../public/shiki/languages/xsl.tmLanguage.json"
  },
  "/shiki/languages/yaml.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"5f7d-1Gm+EVk0Q2rWtKQwBYV5eiNiDSQ\"",
    "mtime": "2025-12-15T04:12:25.993Z",
    "size": 24445,
    "path": "../public/shiki/languages/yaml.tmLanguage.json"
  },
  "/shiki/languages/zenscript.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1a27-Rqautocryu+/+rSrMXczh6DQlBY\"",
    "mtime": "2025-12-15T04:12:25.993Z",
    "size": 6695,
    "path": "../public/shiki/languages/zenscript.tmLanguage.json"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-EO2tJlj17XT3FJDtT1OEZcXYQQo\"",
    "mtime": "2025-12-15T04:12:25.925Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/_nuxt/builds/meta/95a62e0f-0253-465d-bae3-8446c1f1edf5.json": {
    "type": "application/json",
    "etag": "\"8b-6/fE8cvElwTnjEalZ8whd9FcIa0\"",
    "mtime": "2025-12-15T04:12:25.922Z",
    "size": 139,
    "path": "../public/_nuxt/builds/meta/95a62e0f-0253-465d-bae3-8446c1f1edf5.json"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const _EXTNAME_RE = /.(\.[^./]+)$/;
const extname = function(p) {
  const match = _EXTNAME_RE.exec(normalizeWindowsPath(p));
  return match && match[1] || "";
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _XPSrkY = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
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
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const _SxA8c9 = defineEventHandler(() => {});

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
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
  return isTag(vnode, "text") || isTag(vnode, Symbol.for("v-txt"));
}
function nodeChildren(node) {
  if (Array.isArray(node.children) || typeof node.children === "string") {
    return node.children;
  }
  if (typeof node.children?.default === "function") {
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
    return node.children || node.value || "";
  }
  const children = nodeChildren(node);
  if (Array.isArray(children)) {
    return children.map(nodeTextContent).filter(Boolean).join("");
  }
  return "";
}

const useProcessorPlugins = async (processor, plugins = {}) => {
  const toUse = Object.entries(plugins).filter((p) => p[1] !== false);
  for (const plugin of toUse) {
    const instance = plugin[1].instance || await import(
      /* @vite-ignore */
      plugin[0]
    ).then((m) => m.default || m);
    processor.use(instance, plugin[1].options);
  }
};

function emphasis(state, node) {
  const result = {
    type: "element",
    tagName: "em",
    properties: node.attributes || {},
    children: state.all(node)
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

function parseThematicBlock(lang) {
  if (!lang?.trim()) {
    return {
      language: void 0,
      highlights: void 0,
      filename: void 0,
      meta: void 0
    };
  }
  const languageMatches = lang.replace(/[{|[](.+)/, "").match(/^[^ \t]+(?=[ \t]|$)/);
  const highlightTokensMatches = lang.match(/\{([^}]*)\}/);
  const filenameMatches = lang.match(/\[((\\\]|[^\]])*)\]/);
  const meta = lang.replace(languageMatches?.[0] ?? "", "").replace(highlightTokensMatches?.[0] ?? "", "").replace(filenameMatches?.[0] ?? "", "").trim();
  return {
    language: languageMatches?.[0] || void 0,
    highlights: parseHighlightedLines(highlightTokensMatches?.[1] || void 0),
    // https://github.com/nuxt/content/pull/2169
    filename: filenameMatches?.[1].replace(/\\\]/g, "]") || void 0,
    meta
  };
}
function parseHighlightedLines(lines) {
  const lineArray = String(lines || "").split(",").filter(Boolean).flatMap((line) => {
    const [start, end] = line.trim().split("-").map((a) => Number(a.trim()));
    return Array.from({ length: (end || start) - start + 1 }).map((_, i) => start + i);
  });
  return lineArray.length ? lineArray : void 0;
}
const TAG_NAME_REGEXP = /^<\/?([\w-]+)(\s[^>]*?)?\/?>/;
function getTagName(value) {
  const result = String(value).match(TAG_NAME_REGEXP);
  return result && result[1];
}

const code = (state, node) => {
  const lang = (node.lang || "") + " " + (node.meta || "");
  const { language, highlights, filename, meta } = parseThematicBlock(lang);
  const value = node.value ? detab(node.value + "\n") : "";
  let result = {
    type: "element",
    tagName: "code",
    properties: { __ignoreMap: "" },
    children: [{ type: "text", value }]
  };
  if (meta) {
    result.data = {
      meta
    };
  }
  state.patch(node, result);
  result = state.applyData(node, result);
  const properties = {
    language,
    filename,
    highlights,
    meta,
    code: value
  };
  if (language) {
    properties.className = ["language-" + language];
  }
  result = { type: "element", tagName: "pre", properties, children: [result] };
  state.patch(node, result);
  return result;
};

function html(state, node) {
  const tagName = getTagName(node.value);
  if (tagName && /[A-Z]/.test(tagName)) {
    node.value = node.value.replace(tagName, kebabCase(tagName));
  }
  if (state.dangerous || state.options?.allowDangerousHtml) {
    const result = { type: "raw", value: node.value };
    state.patch(node, result);
    return state.applyData(node, result);
  }
  return void 0;
}

function link(state, node) {
  const properties = {
    ...node.attributes || {},
    href: normalizeUri(node.url)
  };
  if (node.title !== null && node.title !== void 0) {
    properties.title = node.title;
  }
  const result = {
    type: "element",
    tagName: "a",
    properties,
    children: state.all(node)
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

function list(state, node) {
  const properties = {};
  const results = state.all(node);
  let index = -1;
  if (typeof node.start === "number" && node.start !== 1) {
    properties.start = node.start;
  }
  while (++index < results.length) {
    const child = results[index];
    if (child.type === "element" && child.tagName === "li" && child.properties && Array.isArray(child.properties.className) && child.properties.className.includes("task-list-item")) {
      properties.className = ["contains-task-list"];
      break;
    }
  }
  if ((node.children || []).some((child) => typeof child.checked === "boolean")) {
    properties.className = ["contains-task-list"];
  }
  const result = {
    type: "element",
    tagName: node.ordered ? "ol" : "ul",
    properties,
    children: state.wrap(results, true)
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

const htmlTags = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "math",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
];

function paragraph(state, node) {
  if (node.children && node.children[0] && node.children[0].type === "html") {
    const tagName = kebabCase(getTagName(node.children[0].value) || "div");
    if (!htmlTags.includes(tagName)) {
      return state.all(node);
    }
  }
  const result = {
    type: "element",
    tagName: "p",
    properties: {},
    children: state.all(node)
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

function image(state, node) {
  const properties = { ...node.attributes, src: normalizeUri(node.url) };
  if (node.alt !== null && node.alt !== void 0) {
    properties.alt = node.alt;
  }
  if (node.title !== null && node.title !== void 0) {
    properties.title = node.title;
  }
  const result = { type: "element", tagName: "img", properties, children: [] };
  state.patch(node, result);
  return state.applyData(node, result);
}

function strong(state, node) {
  const result = {
    type: "element",
    tagName: "strong",
    properties: node.attributes || {},
    children: state.all(node)
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

function inlineCode(state, node) {
  const language = node.attributes?.language || node.attributes?.lang;
  const text = { type: "text", value: node.value.replace(/\r?\n|\r/g, " ") };
  state.patch(node, text);
  const result = {
    type: "element",
    tagName: "code",
    properties: node.attributes || {},
    children: [text]
  };
  const classes = (result.properties.class || "").split(" ");
  delete result.properties.class;
  if (language) {
    result.properties.language = language;
    delete result.properties.lang;
    classes.push("language-" + language);
  }
  result.properties.className = classes.join(" ");
  state.patch(node, result);
  return state.applyData(node, result);
}

function containerComponent(state, node) {
  const result = {
    type: "element",
    tagName: node.name,
    properties: {
      ...node.attributes,
      ...node.data?.hProperties
    },
    children: state.all(node)
  };
  state.patch(node, result);
  result.attributes = node.attributes;
  result.fmAttributes = node.fmAttributes;
  return result;
}

const handlers$1 = {
  emphasis,
  code,
  link,
  paragraph,
  html,
  list,
  image,
  strong,
  inlineCode,
  containerComponent
};

const defaults = {
  remark: {
    plugins: {
      "remark-mdc": {
        instance: remarkMDC
      },
      "remark-gfm": {
        instance: remarkGFM
      }
    }
  },
  rehype: {
    options: {
      handlers: handlers$1,
      allowDangerousHtml: true
    },
    plugins: {
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
        options: {
          passThrough: ["element"]
        }
      }
    }
  },
  highlight: false,
  toc: {
    searchDepth: 2,
    depth: 2
  }
};

function flattenNodeText(node) {
  if (node.type === "comment") {
    return "";
  }
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

const unsafeLinkPrefix = [
  "javascript:",
  "data:text/html",
  "vbscript:",
  "data:text/javascript",
  "data:text/vbscript",
  "data:text/css",
  "data:text/plain",
  "data:text/xml"
];
const validateProp = (attribute, value) => {
  if (attribute.startsWith("on")) {
    return false;
  }
  if (attribute === "href" || attribute === "src") {
    return !unsafeLinkPrefix.some((prefix) => value.toLowerCase().startsWith(prefix));
  }
  return true;
};
const validateProps = (type, props) => {
  if (!props) {
    return {};
  }
  props = Object.fromEntries(
    Object.entries(props).filter(([name, value]) => {
      const isValid = validateProp(name, value);
      if (!isValid) {
        console.warn(`[@nuxtjs/mdc] removing unsafe attribute: ${name}="${value}"`);
      }
      return isValid;
    })
  );
  if (type === "pre") {
    if (typeof props.highlights === "string") {
      props.highlights = props.highlights.split(" ").map((i) => Number.parseInt(i));
    }
  }
  return props;
};

function compileHast(options = {}) {
  const slugs = new Slugger();
  function compileToJSON(node, parent) {
    if (node.type === "root") {
      return {
        type: "root",
        children: node.children.map((child) => compileToJSON(child, node)).filter(Boolean)
      };
    }
    if (node.type === "element") {
      if (node.tagName === "p" && node.children.every((child) => child.type === "text" && /^\s*$/.test(child.value))) {
        return null;
      }
      if (node.tagName === "li") {
        let hasPreviousParagraph = false;
        node.children = node.children?.flatMap((child) => {
          if (child.type === "element" && child.tagName === "p") {
            if (hasPreviousParagraph) {
              child.children.unshift({
                type: "element",
                tagName: "br",
                properties: {},
                children: []
              });
            }
            hasPreviousParagraph = true;
            return child.children;
          }
          return child;
        });
      }
      if (node.tagName?.match(/^h\d$/)) {
        node.properties = node.properties || {};
        node.properties.id = String(node.properties?.id || slugs.slug(toString(node))).replace(/-+/g, "-").replace(/^-|-$/g, "").replace(/^(\d)/, "_$1");
      }
      if (node.tagName === "component-slot") {
        node.tagName = "template";
      }
      const children = (node.tagName === "template" && node.content?.children.length ? node.content.children : node.children).map((child) => compileToJSON(child, node)).filter(Boolean);
      return {
        type: "element",
        tag: node.tagName,
        props: validateProps(node.tagName, node.properties),
        children
      };
    }
    if (node.type === "text") {
      if (!/^\n+$/.test(node.value || "") || parent?.properties?.emptyLinePlaceholder) {
        return {
          type: "text",
          value: node.value
        };
      }
    }
    if (options.keepComments && node.type === "comment") {
      return {
        type: "comment",
        value: node.value
      };
    }
    return null;
  }
  this.Compiler = (tree) => {
    const body = compileToJSON(tree);
    let excerpt = void 0;
    const excerptIndex = tree.children.findIndex((node) => node.type === "comment" && node.value?.trim() === "more");
    if (excerptIndex !== -1) {
      excerpt = compileToJSON({
        type: "root",
        children: tree.children.slice(0, excerptIndex)
      });
      if (excerpt.children.find((node) => node.type === "element" && node.tag === "pre")) {
        const lastChild = body.children[body.children.length - 1];
        if (lastChild.type === "element" && lastChild.tag === "style") {
          excerpt.children.push(lastChild);
        }
      }
    }
    body.children = (body.children || []).filter((child) => child.type !== "text");
    return {
      body,
      excerpt
    };
  };
}

let moduleOptions;
let generatedMdcConfigs;
const createMarkdownParser = async (inlineOptions = {}) => {
  if (!moduleOptions) {
    moduleOptions = await import(
      '../build/mdc-imports.mjs'
      /* @vite-ignore */
    ).catch(() => ({}));
  }
  if (!generatedMdcConfigs) {
    generatedMdcConfigs = await import(
      '../build/mdc-configs.mjs'
      /* @vite-ignore */
    ).then((r) => r.getMdcConfigs()).catch(() => []);
  }
  const mdcConfigs = [
    ...generatedMdcConfigs || [],
    ...inlineOptions.configs || []
  ];
  if (inlineOptions.highlight != null && inlineOptions.highlight != false && inlineOptions.highlight.highlighter !== void 0 && typeof inlineOptions.highlight.highlighter !== "function") {
    inlineOptions = {
      ...inlineOptions,
      highlight: {
        ...inlineOptions.highlight
      }
    };
    delete inlineOptions.highlight.highlighter;
  }
  const options = defu(inlineOptions, {
    remark: { plugins: moduleOptions?.remarkPlugins },
    rehype: { plugins: moduleOptions?.rehypePlugins },
    highlight: moduleOptions?.highlight
  }, defaults);
  if (options.rehype?.plugins?.highlight) {
    options.rehype.plugins.highlight.options = {
      ...options.rehype.plugins.highlight.options || {},
      ...options.highlight || {}
    };
  }
  let processor = unified();
  for (const config of mdcConfigs) {
    processor = await config.unified?.pre?.(processor) || processor;
  }
  processor.use(remarkParse);
  for (const config of mdcConfigs) {
    processor = await config.unified?.remark?.(processor) || processor;
  }
  await useProcessorPlugins(processor, options.remark?.plugins);
  processor.use(remark2rehype, options.rehype?.options);
  for (const config of mdcConfigs) {
    processor = await config.unified?.rehype?.(processor) || processor;
  }
  await useProcessorPlugins(processor, options.rehype?.plugins);
  processor.use(compileHast, options);
  for (const config of mdcConfigs) {
    processor = await config.unified?.post?.(processor) || processor;
  }
  return async function parse(md, { fileOptions } = {}) {
    const { content, data: frontmatter } = await parseFrontMatter(md);
    const processedFile = await processor.process({ ...fileOptions, value: content, data: frontmatter });
    const result = processedFile.result;
    const data = Object.assign(
      contentHeading(result.body),
      frontmatter,
      processedFile?.data || {}
    );
    let toc;
    if (data.toc !== false) {
      const tocOption = defu(data.toc || {}, options.toc);
      toc = generateToc(result.body, tocOption);
    }
    return {
      data,
      body: result.body,
      excerpt: result.excerpt,
      toc
    };
  };
};
const parseMarkdown = async (md, markdownParserOptions = {}, parseOptions = {}) => {
  const parser = await createMarkdownParser(markdownParserOptions);
  return parser(md, parseOptions);
};
function contentHeading(body) {
  let title = "";
  let description = "";
  const children = body.children.filter((node) => node.type === "element" && node.tag !== "hr");
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

const _HxsZt6 = defineEventHandler(async (event) => {
  const { getContentQuery } = await import('../_/query.mjs');
  const { serverQueryContent } = await import('../_/storage.mjs').then(function (n) { return n.s; });
  const query = getContentQuery(event);
  const { advanceQuery } = useRuntimeConfig().public.content.experimental;
  if (query.first) {
    let contentQuery = serverQueryContent(event, query);
    if (!advanceQuery) {
      contentQuery = contentQuery.withDirConfig();
    }
    const content = await contentQuery.findOne();
    const _result = advanceQuery ? content?.result : content;
    const missing = !_result && !content?.dirConfig?.navigation?.redirect && !content?._dir?.navigation?.redirect;
    if (missing) {
      throw createError$1({
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
  if (query.count) {
    return serverQueryContent(event, query).count();
  }
  return serverQueryContent(event, query).find();
});

const _cExcmq = defineEventHandler(async (event) => {
  const { getContentIndex } = await import('../_/storage.mjs').then(function (n) { return n.c; });
  const { cacheStorage, serverQueryContent } = await import('../_/storage.mjs').then(function (n) { return n.s; });
  const { content } = useRuntimeConfig();
  const now = Date.now();
  const contents = await serverQueryContent(event).find();
  await getContentIndex(event);
  const navigation = await $fetch(`${content.api.baseURL}/navigation`);
  await cacheStorage().setItem("content-navigation.json", navigation);
  return {
    generatedAt: now,
    generateTime: Date.now() - now,
    contents: content.experimental.cacheContents ? contents : [],
    navigation
  };
});

const isPreview = (event) => {
  const previewToken = getQuery(event).previewToken || getCookie(event, "previewToken");
  return !!previewToken;
};
const getPreview = (event) => {
  const key = getQuery(event).previewToken || getCookie(event, "previewToken");
  return { key };
};

const _PC42kZ = defineEventHandler(async (event) => {
  const { getContentQuery } = await import('../_/query.mjs');
  const { cacheStorage, serverQueryContent } = await import('../_/storage.mjs').then(function (n) { return n.s; });
  const { createNav } = await import('../_/navigation.mjs');
  const query = getContentQuery(event);
  if (!isPreview(event) && Object.keys(query).length === 0) {
    const cache = await cacheStorage().getItem("content-navigation.json");
    if (cache) {
      return cache;
    }
  }
  const contents = await serverQueryContent(event, query).where({
    /**
     * Partial contents are not included in the navigation
     * A partial content is a content that has `_` prefix in its path
     */
    _partial: false,
    /**
     * Exclude any pages which have opted out of navigation via frontmatter.
     */
    navigation: {
      $ne: false
    }
  }).find();
  const _locale = (query?.where || []).find((w) => w._locale)?._locale;
  const dirConfigs = await serverQueryContent(event, _locale ? { where: [{ _locale }] } : void 0).where({ _path: /\/_dir$/i, _partial: true }).find();
  const configs = (dirConfigs?.result || dirConfigs).reduce((configs2, conf) => {
    if (conf.title?.toLowerCase() === "dir") {
      conf.title = void 0;
    }
    const key = conf._path.split("/").slice(0, -1).join("/") || "/";
    configs2[key] = {
      ...conf,
      // Extract meta from body. (non MD files)
      ...conf.body
    };
    return configs2;
  }, {});
  return createNav(contents?.result || contents, configs);
});

const _lazy_y8Ixl8 = () => import('../routes/renderer.mjs');

const handlers = [
  { route: '', handler: _XPSrkY, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_y8Ixl8, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/api/_content/query/:qid/**:params', handler: _HxsZt6, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/query/:qid', handler: _HxsZt6, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/query', handler: _HxsZt6, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/cache.1765771934696.json', handler: _cExcmq, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/navigation/:qid/**:params', handler: _PC42kZ, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/navigation/:qid', handler: _PC42kZ, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/navigation', handler: _PC42kZ, lazy: false, middleware: false, method: "get" },
  { route: '/**', handler: _lazy_y8Ixl8, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { getResponseStatus as a, buildAssetsURL as b, getQuery as c, defineRenderHandler as d, createError$1 as e, getRouteRules as f, getResponseStatusText as g, useNitroApp as h, parseMarkdown as i, isRelative as j, destr as k, extname as l, camelCase as m, joinURL as n, isPreview as o, publicAssetsURL as p, withoutTrailingSlash as q, prefixStorage as r, useStorage as s, getPreview as t, useRuntimeConfig as u, defu as v, withLeadingSlash as w, pascalCase as x, nodeServer as y };
//# sourceMappingURL=nitro.mjs.map
