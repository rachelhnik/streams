const { Readable } = require("node:stream");
const fs = require("node:fs");

class ReadFileStream extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.fileName, "r", (err, fd) => {
      console.log(this.fileName);
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _read(size) {
    const buffer = Buffer.alloc(size);
    fs.read(this.fd, buffer, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);
      this.push(bytesRead > 0 ? buffer.subarray(0, 12) : null);
    });
  }

  _destroy(error, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => {
        if (err) callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

const stream = new ReadFileStream({ fileName: "text.txt" });

stream.on("data", (chunk) => {
  console.log(chunk.length);
  console.log(chunk.toString("utf-8"));
});

stream.on("end", () => {
  console.log("Stream is done writing");
});
