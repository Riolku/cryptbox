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

async function decryptContent(requestData, master_key, iv) {
    let raw_data = loadBytesFromResponse(requestData);

    return decryptRawContent(raw_data, master_key, iv);
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

async function decryptRawContent(raw_data, key, iv) {
    return window.crypto.subtle.decrypt(
        {
        name : "AES-GCM",
        iv : iv
        },
        key,
        raw_data
    );
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

export { newDirectory, encryptContent, decryptContent, newIV, loadIVfromResponse, prepareIVforSending, prepareBytesForSending, loadBytesFromResponse };
