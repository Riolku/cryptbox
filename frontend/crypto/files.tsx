import { fromStringToBytes, fromBytesToString, b64encode, b64decode } from './utils';

if(process.browser) {
  var encoder = new TextEncoder();
}

async function newDirectory(name, master_key) {
  let iv = await newIV();

  return {
    encrypted_name : await encryptContent(name, master_key, iv),
    iv : await prepareIVforSending(iv)
  };
}

async function encryptContent(data, key, iv) {
  let encoded_data = encoder.encode(data);

  return window.crypto.subtle.encrypt(
    {
      name : "AES-GCM",
      iv : iv
    },
    key,
    encoded_data
  );
}

async function newIV() {
  return window.crypto.getRandomValues(new Uint8Array(12));
}

function loadIVfromResponse(iv) {
  return fromStringToBytes(b64decode(iv));
}

function prepareIVforSending(iv) {
  return b64encode(fromBytesToString(iv));
}

export { newDirectory, encryptContent, newIV, loadIVfromResponse, prepareIVforSending };
