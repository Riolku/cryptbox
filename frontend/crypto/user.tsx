import { subtle, decoder, encoder, fromStringToBytes, fromBytesToString, b64encode, b64decode } from './utils';

async function getUserMasterKey(username, password) {
  let salt = deriveBitsFromUsername(username);

  return deriveKeyFromPasswordAndSalt(password, salt);
}

async function exportMasterKeyForStorage(master_key) {
  let bytes = await subtle.exportKey("raw", master_key);

  let byte_string = fromBytesToString(bytes);

  return b64encode(byte_string);
}

async function importMasterKeyFromStorage(storage_string) {
  let decoded_string = b64decode(storage_string);

  let bytes = fromStringToBytes(decoded_string);

  return await subtle.importKey("raw", bytes);
}

async function prepareMasterKeyForLogin(master_key) {
  let sending_key = pbkdf2_deriveKey(
    master_key,
    encoder.encode('preparation'),
    1000
  );

  let bytes = await subtle.exportKey("raw", sending_key);

  let byte_string = fromBytesToString(bytes);

  return b64encode(bytes);
}

function importPBKDF2key() {
  return await subtle.importKey(
    "raw",
    fromStringToBytes(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
}

async function pbkdf2_deriveKey(key, salt, iterations) {
  return await subtle.deriveKey(
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

async function deriveBitsFromUsername(username) {
  let key = importPBKDF2key(salt);

  return await subtle.deriveBits(
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
  let key = importPBKDF2key(password);

  return pbkdf2_deriveKey(
    key, salt, 100000
  );
}

export { getUserMasterKey, exportMasterKeyForStorage, importMasterKeyFromStorage, prepareMasterKeyForLogin };