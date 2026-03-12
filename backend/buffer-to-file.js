import fs from "fs";

const buffer = Buffer.from("Hello File System");

fs.writeFile("demo.txt", buffer, () => {
  console.log("File written using Buffer");
});