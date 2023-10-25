const fs = require("fs/promises");

(async () => {
  const srcFile = await fs.open("pipe.txt", "r");
  const destFile = await fs.open("copyText.txt", "w");
  const bytesRead = (await srcFile.read()).bytesRead;
  if (bytesRead !== 16384) {
    console.log(bytesRead);
  }
  destFile.write((await srcFile.read()).buffer);
})();
