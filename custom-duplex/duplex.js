const { Duplex } = require("node:stream");
const fs = require("node:fs");

class DuplexStream extends Duplex {
  constructor({
    readHighWaterMark,
    writeHighWaterMark,
    readFileName,
    writeFileName,
  }) {
    super({ readHighWaterMark, writeHighWaterMark });
    this.readFileName = readFileName;
    this.writeFileName = writeFileName;
    this.readFd = null;
    this.writeFd = null;
    this.chunks = [];
    this.chunkSize = 0;
  }

  _construct(callback) {
    fs.open(this.readFileName, "r", (err, readFd) => {
      if (err) return callback(err);
      this.readFd = readFd;
      fs.open(this.writeFileName, "w", (err, writeFd) => {
        if (err) return callback(err);
        this.writeFd = writeFd;
        callback();
      });
    });
  }

  _read(size) {
    const buffer = Buffer.alloc(size);
    fs.read(this.readFd, buffer, 0, size, null, (err, bytesRead) => {
      if (err) {
        return this.destroy(err);
      }
      this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);
    });
  }
  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;
    if (this.chunkSize > this.writableHighWaterMark) {
      fs.write(this.writeFd, Buffer.concat(this.chunks), (err, callback) => {
        if (err) {
          callback(err);
        }
        this.chunks = [];
        this.chunkSize = 0;
        callback();
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
      if (err) {
        callback(err);
      }
      this.chunks = [];
      callback();
    });
  }
  _destroy(err, callback) {
    callback(err);
  }
}

const stream = new DuplexStream({
  readFileName: "read.txt",
  writeFileName: "write.txt",
});

stream.write(Buffer.from("HI we are nct 127"));

stream.end(Buffer.from("end of write"));

stream.on("data", (chunk) => {
  console.log(chunk.toString("utf-8"));
});
