// index.js (ES Module)
import fs from "fs";

fs.readFile("sample.txt", "utf-8", (err, data) => {
  if (err) console.error(err);
  else console.log("File Content:", data);
});

console.log("Reading file asynchronously...");
