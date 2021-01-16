if(process.browser) {
  var subtle = window.crypto.subtle;
}

var decoder = new TextDecoder();
var encoder = new TextEncoder();

function fromStringToBytes(string) {
  return encoder.encode(string);
}

function fromBytesToString(string) {
  return decoder.decode(string);
}

function b64encode(string) {
  let byte_string = fromStringToByteString(string);

  return btoa(byte_string);
}

function b64decode(string) {
  let byte_string = atob(string);

  return fromByteStringToString(byte_string);
}

function fromStringToByteString(string) {
  const codeUnits = new Uint16Array(string.length);

  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }

  let res = '';
  for(let i=0; i<codeUnits.length; i++){
      res += String.fromCharCode(codeUnits[i]>>8);
      res += String.fromCharCode(codeUnits[i]&((1<<8)-1));
  }

  return res;
}

function fromByteStringToString(binary) {
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  let res = '';
  for(let i=0; i<bytes.length; i+=2)
      res += String.fromCharCode((bytes[i]<<1)|bytes[i+1]);

  return res;
}

export { decoder, encoder, fromStringToBytes, fromBytesToString, b64encode, b64decode };
