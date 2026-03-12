import fs from "fs";

fs.readFile("image.jpg", (err, data) => {
  if (err) throw err;

  console.log(data);           // <Buffer 89 50 4e 47 ...>
  console.log(data.length);    // file size in bytes
});