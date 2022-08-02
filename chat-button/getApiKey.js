function parseQuery(query) {
  var params = {};
  if (!query) return params; // return empty object
  var pairs = query.split(/[;&]/);
  for (var i = 0; i < pairs.length; i++) {
    var keyVal = pairs[i].split('=');
    if (!keyVal || keyVal.length !== 2) continue;
    var key = unescape(keyVal[0]);
    var val = unescape(keyVal[1]);
    val = val.replace(/\+/g, ' ');
    params[key] = val;
  }
  return params;
}

export default function getApiKey() {
  const scripts = Array.prototype.slice.call(document.getElementsByTagName('script'))
    .filter(s => /.*:\/\/widgets.*\.clarityhub\..*scripts.*/.test(s.src));

  if (scripts.length > 0) {
    const script = scripts[0];

    const queryString = script.src.replace(/^[^?]+\??/, '');
    const params = parseQuery(queryString);

    return params.API_KEY;
  } else {
    console.log('Couldn\'t find an API KEY');
  }
};
