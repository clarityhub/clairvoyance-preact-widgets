const path = require('path');
const fs = require('fs');
const url = require('url');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(path.join(__dirname, '../'));
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl = envPublicUrl ||
    (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

// config after eject: we're in ./config/
module.exports = {
  servedPath: getServedPath(resolveApp('package.json')),
  root: resolveApp('.'),
  dotenv: resolveApp('.env'),
  entries: {
    chat: resolveApp('chat-button/index.js'),
    'chat/index': resolveApp('chat-app/index.js'),
    reg: resolveApp('reg/index.js'),
  },
  chatSrc: resolveApp('chat'),
  regSrc: resolveApp('reg'),
  themeSrc: resolveApp('node_modules/theme-claire/src'),
  designSrc: resolveApp('node_modules/design/sass'),
  output: resolveApp('build'),
  emailSrc: resolveApp('node_modules/isemail/lib'),
  appHtml: resolveApp('public/chat/index.html'),
};
