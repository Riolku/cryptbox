import { fromStringToBytes, fromBytesToString, b64encode, b64decode } from './utils';

async function getUserMasterKey(username, password) {
  let salt = deriveBitsFromUsername(username);

  return deriveKeyFromPasswordAndSalt(password, salt);
}

async function exportMasterKeyForStorage(master_key) {
  let bytes = await window.crypto.subtle.exportKey("raw", master_key);

  let byte_string = fromBytesToString(bytes);

  return b64encode(byte_string);
}

async function importMasterKeyFromStorage(storage_string) {
  let decoded_string = b64decode(storage_string);

  let bytes = fromStringToBytes(decoded_string);

  return window.crypto.subtle.importKey("raw", bytes);
}

async function prepareMasterKeyForLogin(master_key) {
  let sending_key = await pbkdf2_deriveKey(
    master_key,
    fromStringToBytes('preparation'),
    1000
  );

  let bytes = await window.crypto.subtle.exportKey("raw", sending_key);

  let byte_string = fromBytesToString(bytes);

  return b64encode(bytes);
}

async function deriveBitsFromUsername(username) {
  let key = await importPBKDF2key(username);

  console.log(key);

  return window.crypto.subtle.deriveBits(
    {
      name : "PBKDF2",
      salt : fromStringToBytes('username'),
      iterations : 1000,
      hash : "SHA-256"
    },
    key,
    256
  );
}

async function deriveKeyFromPasswordAndSalt(password, salt) {
  let key = await importPBKDF2key(password);

  return pbkdf2_deriveKey(
    key, salt, 100000
  );
}

async function pbkdf2_deriveKey(key, salt, iterations) {
  console.log(key);
  console.log(salt);
  console.log(iterations);

  return window.crypto.subtle.deriveKey(
    {
      name : "PBKDF2",
      salt : salt,
      iterations : iterations,
      hash : "SHA-256"
    },
    key,
    { name : "AES-GCM", length : 256 },
    true,
    [ 'encrypt', 'decrypt', 'wrapKey', 'unwrapKey' ]
  );
}

async function importPBKDF2key(key_material) {
  return window.crypto.subtle.importKey(
    "raw",
    fromStringToBytes(key_material),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
}

export { getUserMasterKey, exportMasterKeyForStorage, importMasterKeyFromStorage, prepareMasterKeyForLogin };
