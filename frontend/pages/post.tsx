function post(url, body, callback) {
  fetch('https://api.cryptbox.kgugeler.ca' + url, {
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