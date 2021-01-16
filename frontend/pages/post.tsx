function post(url, body, callback) {
  fetch('http://167.99.181.60:5000' + url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(ret => ret.json()).then(callback);
}

export default post;