if(process.browser) {
  var decoder = new TextDecoder();
  var encoder = new TextEncoder();
}

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
      res += String.fromCharCode(first_eight_bits(codeUnits[i]));
      res += String.fromCharCode(last_eight_bits(codeUnits[i]));
  }

  return res;
}

function first_eight_bits(int16) {
  return int16 >> 8;
}

function last_eight_bits(int16) {
  return int16 & 255;
}

function fromByteStringToString(binary) {
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  let res = '';
  for(let i=0; i<bytes.length; i+=2)
      res += String.fromCharCode(combine_int8s(bytes[i], bytes[i + 1]));

  return res;
}

function combine_int8s(int8_a, int8_b) {
  return (int8_a << 8) | int8_b;
}

export { decoder, encoder, fromStringToBytes, fromBytesToString, b64encode, b64decode };
