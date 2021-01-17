function postreq(url, body, callback) {
  request("POST", url, body, callback);
}

function patchreq(url, body, callback) {
  request("PATCH", url, body, callback);
}

function deletereq(url, body, callback) {
  request("DELETE", url, body, callback);
}

function request(method, url, body, callback) {
  fetch('https://api.cryptbox.kgugeler.ca' + url, {
    method: method,
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(ret => ret.json()).then(callback);
}

function getreq(url, callback) {
  fetch("https://api.cryptbox.kgugeler.ca" + url, {
    method: "GET",
    credentials : "include",
    headers: {
      'Accept': 'application/json'
    }
  }).then(ret => ret.json()).then(callback);
}

export { getreq, postreq, patchreq, deletereq, request };
