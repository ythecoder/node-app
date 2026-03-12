import fs from "fs";

fs.writeFileSync("notes.txt", "Node.js Notes");
fs.appendFileSync("notes.txt", "\nExtra info");
fs.readFile("notes.txt", "utf-8", (err, data) => console.log(data));
