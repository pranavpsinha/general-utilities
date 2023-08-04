function URLUtil () {}

// binds base & relative url into one
URLUtil.prototype.makeAbsolute = function (relativeUrl, baseUrl) {
  const url = new URL(relativeUrl, baseUrl);
  return url.href;
}

URLUtil.prototype.encodeURI = function (text) {
  if(!text) return '';
  
  return Buffer.from(text).toString('base64');
}

URLUtil.prototype.decodeURI = function (text) {
  if(!text) return '';

  return String(Buffer.from(text, 'base64'));
}

module.exports = new URLUtil();