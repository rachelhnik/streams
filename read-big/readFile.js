const fs = require("node:fs/promises");

(async () => {
  const fileHandleRead = await fs.open(
    "/Users/rachelhnik/desktop/streams/write-many/test.txt",
    "r"
  );
  const fileHandleWrite = await fs.open("../write-many/test.txt", "w");
  console.log((await fileHandleRead.readFile()).toString());

  //   const readStream = fileHandleRead.createReadStream({
  //     highWaterMark: 64 * 1024,
  //   });
  //   const writeStream = fileHandleWrite.createWriteStream();
  //   readStream.on("data", (chunk) => {
  //     if (!writeStream.write(chunk)) {
  //       readStream.pause();
  //     }
  //     writeStream.on("drain", () => {
  //       readStream.resume();
  //     });
  //   });
  fileHandleRead.close();
})();
