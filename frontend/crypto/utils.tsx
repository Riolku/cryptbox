var subtle = window.crypto.subtle;

var decoder = new TextDecoder();
var encoder = new TextEncoder();

function fromStringToBytes(string) {
  return encoder.encode(string);
}

function fromBytesToString(binary) {
  return decoder.decode(string);
}

function b64encode(string) {
  byte_string = fromStringToByteString(string);

  return btoa(byte_string);
}

function b64decode(string) {
  byte_string = atob(string);

  return fromByteStringToString(byte_string);
}

function fromStringToByteString(string) {
  const codeUnits = new Uint16Array(string.length);

  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }

  console.log(codeUnits);

  return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
}

function fromByteStringToString(binary) {
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return String.fromCharCode(...new Uint16Array(bytes.buffer));
}
