import { fromStringToBytes, fromBytesToString, b64encode, b64decode } from './utils';

const CAN_EXTRACT = true;
const CANNOT_EXTRACT = false;

async function getUserMasterKey(username, password) {
  let salt = await deriveBitsFromUsername(username);

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

  console.log("READY TO DO STUFF")

  return window.crypto.subtle.importKey(
    "raw",
    bytes,
    "AES-GCM",
    CAN_EXTRACT,
    [ 'encrypt', 'decrypt' ]
  );
}

async function prepareMasterKeyForLogin(master_key) {
  let bytes = await window.crypto.subtle.exportKey("raw", master_key);
  let byte_string = fromBytesToString(bytes);
  let key = await importPBKDF2key(byte_string);

  let sending_key = await pbkdf2_deriveKey(
    key,
    fromStringToBytes('preparation'),
    100
  );

  bytes = await window.crypto.subtle.exportKey("raw", sending_key);

  byte_string = fromBytesToString(bytes);

  return b64encode(byte_string);
}

async function deriveBitsFromUsername(username) {
  let key = await importPBKDF2key(username);

  return window.crypto.subtle.deriveBits(
    {
      name : "PBKDF2",
      salt : fromStringToBytes('username'),
      iterations : 100,
      hash : "SHA-256"
    },
    key,
    256
  );
}

async function deriveKeyFromPasswordAndSalt(password, salt) {
  let key = await importPBKDF2key(password);

  return pbkdf2_deriveKey(
    key, salt, 10000
  );
}

async function pbkdf2_deriveKey(key, salt, iterations) {
  return window.crypto.subtle.deriveKey(
    {
      name : "PBKDF2",
      salt : salt,
      iterations : iterations,
      hash : "SHA-256"
    },
    key,
    { name : "AES-GCM", length : 256 },
    CAN_EXTRACT,
    [ 'encrypt', 'decrypt' ]
  );
}

async function importPBKDF2key(key_material) {
  return window.crypto.subtle.importKey(
    "raw",
    fromStringToBytes(key_material),
    "PBKDF2",
    CANNOT_EXTRACT,
    ["deriveBits", "deriveKey"]
  );
}

export { getUserMasterKey, exportMasterKeyForStorage, importMasterKeyFromStorage, prepareMasterKeyForLogin };
