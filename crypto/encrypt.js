const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Encrypt extends Transform {
  _transform(chunk, encoding, callback) {
    console.log(chunk);
    for (let i = 0; i < chunk.length; i++) {
      if (i !== 255) {
        console.log(i);
        chunk[i] = chunk[i] + 1;
      }
    }
    this.push(chunk);
  }
}

(async () => {
  const fileHandleRead = await fs.open("read.txt", "r");
  const fileHandleWrite = await fs.open("write.txt", "w");

  const readStream = fileHandleRead.createReadStream();
  const writeStream = fileHandleWrite.createWriteStream();
  const encrypt = new Encrypt();

  readStream.pipe(encrypt).pipe(writeStream);
})();
