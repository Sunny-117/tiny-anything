

export function getUrlFromOptions(options) {
  //const params = options.params || {};
  return options.url;
}
export function getInitFromOptions(options) {
  const method = options.method || 'GET';
  const headers = options.headers || {};
  const isJSONBody = headers['Content-Type'] === 'application/json';
  let body = options.data;
  if (body && Object.keys(body).length > 0) {
    if (isJSONBody) {
      body = JSON.stringify(body)
    } else {
      body = new URLSearchParams(body);
    }
  }
  const credentials = options.credentials || 'omit';//omit include same-origin
  return {
    method,
    headers,
    body,
    credentials
  };
}