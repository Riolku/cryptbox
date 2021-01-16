var subtle = window.crypto.subtle;

let enc = new TextEncoder();

function importPBKDF2key() {
  return subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
}

async function pbkdf2_deriveKey(key, salt, iterations) {
  return subtle.deriveKey(
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
  let key = await importPBKDF2key(salt);

  return subtle.deriveBits(
    {
      name : "PBKDF2",
      salt : enc.encode('username'),
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

async function getUserMasterKey(username, password) {
  let salt = await deriveBitsFromUsername(username);

  return deriveKeyFromPasswordAndSalt(password, salt);
}

async function prepareMasterKeyForLogin(master_key) {
  let sending_key = pbkdf2_deriveKey(
    master_key,
    enc.encode('preparation'),
    1000
  );

  return subtle.exportKey("jwk", sending_key);
}
