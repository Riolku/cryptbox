import * from './utils';

async function newDirectory(name, master_key) {
  iv = newIV();

  return {
    encryptedName : encryptContent(name, master_key),
    iv : prepareIVforSending(iv)
  };
}

async function encryptContent(data, key, iv) {
  let encoded_data = encoder.encode(data);

  return await subtle.encrypt(
    {
      name : "AES-GCM",
      iv : iv
    },
    key,
    encoded_data
  );
}

async function newIV() {
  return window.cryto.getRandomValues(new Uint8Array(12));
}

async function loadIVfromResponse(iv) {
  return fromStringToBytes(b64decode(iv));
}

async function prepareIVforSending(iv) {
  return b64encode(fromBytesToString(iv));
}
