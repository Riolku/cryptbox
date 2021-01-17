function b64encode(bytes) {
  let str = "";

  let arr = new Uint8Array(bytes);

  for(let i = 0; i < arr.length; i++) {
    str += String.fromCharCode(arr[i]);
  }

  return btoa(str);
}

function b64decode(string) {
  let byte_string = atob(string);

  let ret = new Uint8Array(byte_string.length);

  for(let i = 0; i < byte_string.length; i++) {
    ret[i] = byte_string.charCodeAt(i);
  }

  return ret;
}

function fromStringToBytes(string) {
  const codeUnits = new Uint16Array(string.length);

  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }

  let res = new Uint8Array(2 * string.length);
  for(let i=0; i<codeUnits.length; i++){
      res[2 * i] = String.fromCharCode(first_eight_bits(codeUnits[i]));
      res[2 * i + 1] = String.fromCharCode(last_eight_bits(codeUnits[i]));
  }

  return res;
}

function first_eight_bits(int16) {
  return int16 >> 8;
}

function last_eight_bits(int16) {
  return int16 & 255;
}

function fromBytesToString(binary) {
  let res = '';
  for(let i=0; i<bytes.length; i+=2)
      res += String.fromCharCode(combine_int8s(binary[i], binary[i + 1]));

  return res;
}

function combine_int8s(int8_a, int8_b) {
  return (int8_a << 8) | int8_b;
}

export { fromStringToBytes, fromBytesToString, b64encode, b64decode };
