import fs from "fs";

const readStream = fs.createReadStream("chunks.txt", "utf-8");
readStream.on("data", chunk => console.log("Chunk:", chunk));