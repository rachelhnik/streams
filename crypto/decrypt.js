const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Decrypt extends Transform {
  _transform(chunk, encoding, callback) {
    console.log(chunk);
    for (let i = 0; i < chunk.length; i++) {
      if (chunk !== 255) {
        chunk[i] = chunk[i] - 1;
      }
    }
    this.push(chunk);
  }
}

(async () => {
  const fileHandleRead = await fs.open("write.txt", "r");
  const fileHandleWrite = await fs.open("decryptedText.txt", "w");

  const readStream = fileHandleRead.createReadStream();
  const writeStream = fileHandleWrite.createWriteStream();
  const decrypt = new Decrypt();
  readStream.pipe(decrypt).pipe(writeStream);
})();
