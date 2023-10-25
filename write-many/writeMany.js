const fs = require("node:fs/promises");

(async () => {
  const filehandle = await fs.open("test.txt", "w");
  const stream = filehandle.createWriteStream();

  // const buff = Buffer.alloc(123456, "");
  // stream.write(buff);
  // console.log(stream.write(buff));
  // stream.on("drain", () => {
  //   console.log("Buffer is emptied");
  //   // stream.write(buff);
  // });

  let i = 0;
  console.time("Start");

  const writeMany = () => {
    while (i < 1000000) {
      console.log("hello");
      const buff = Buffer.from(` ${i} `, "utf-16le");
      console.log(stream.write(buff));
      if (!stream.write(buff)) break;
      stream.write(buff);
      console.log(stream.write(buff));
      i++;
    }
  };
  writeMany();

  stream.on("drain", () => {
    writeMany();
  });
  // for (let i = 0; i < 100000; i++) {
  //   const buff = Buffer.from(`${i}`, "utf-16le");
  //   stream.write(buff);
  //   console.log(stream.write(buff));
  // }
  console.timeEnd("Start");
})();

// const fs = require("node:fs");

// (async () => {
//   console.time("callback");
//   fs.open("./test.txt", "w", (err, fd) => {
//     for (let i = 0; i < 100000; i++) {
//       fs.write(fd, ` ${i} `, () => {});
//     }
//     console.timeEnd("callback");
//   });
// })();
