import { fromStringToBytes, fromBytesToString, b64encode, b64decode } from './utils';

if(process.browser) {
  var encoder = new TextEncoder();
}

async function newDirectory(name, master_key) {
  let iv = await newIV();

  return {
    encrypted_name : prepareBytesForSending(await encryptContent(name, master_key, iv)),
    iv : await prepareIVforSending(iv)
  };
}

async function encryptContent(data, key, iv) {
  let encoded_data = encoder.encode(data);

  let encrypted_content = window.crypto.subtle.encrypt(
    {
      name : "AES-GCM",
      iv : iv
    },
    key,
    encoded_data
  );

  return encrypted_content
}

async function newIV() {
  return window.crypto.getRandomValues(new Uint8Array(12));
}

function loadIVfromResponse(iv) {
  return loadBytesFromResponse(iv);
}

function loadBytesFromResponse(response_text) {
  return fromStringToBytes(b64decode(response_text));
}

function prepareIVforSending(iv) {
  return prepareBytesForSending(iv);
}

function prepareBytesForSending(bytes) {
  return b64encode(fromBytesToString(bytes));
}

export { newDirectory, encryptContent, newIV, loadIVfromResponse, prepareIVforSending, prepareBytesForSending, loadBytesFromResponse };
