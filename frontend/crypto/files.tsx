import { decoder, encoder, fromStringToBytes, fromBytesToString, b64encode, b64decode } from './utils';

async function newDirectory(name, master_key) {
  let iv = newIV();

  return {
    encrypted_name : encryptContent(name, master_key, iv),
    iv : prepareIVforSending(iv)
  };
}

async function encryptContent(data, key, iv) {
  let encoded_data = encoder.encode(data);

  return await window.crypto.subtle.encrypt(
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

async function loadIVfromResponse(iv) {
  return fromStringToBytes(b64decode(iv));
}

async function prepareIVforSending(iv) {
  return b64encode(fromBytesToString(iv));
}

export { newDirectory, encryptContent, newIV, loadIVfromResponse, prepareIVforSending };