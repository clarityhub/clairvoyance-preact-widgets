function parseQuery(q) {
  const query = q.slice(1);
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

export default () => {
  const params = parseQuery(window.location.search);

  return params.API_KEY;
};
