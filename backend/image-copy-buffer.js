import fs from "fs";

const imageBuffer = fs.readFileSync("image.jpg");

fs.writeFileSync("output.jpg", imageBuffer);

console.log("Image copied successfully");