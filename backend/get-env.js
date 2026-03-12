// npm install dotenv

import dotenv from "dotenv";  
// Import the 'dotenv' package so we can load environment variables from a .env file

dotenv.config();  
// Load the variables from the .env file into process.env
// After this, all keys in .env are accessible as process.env.KEY_NAME

console.log(process.env.PORT);  
// Print the value of PORT from the .env file
// e.g., if PORT=5000, it will print 5000

console.log(process.env.DB_URL);  
// Print the value of DB_URL from the .env file
// e.g., if DB_URL=mongodb://localhost:27017/mern, it will print that URL

//Notes:
// dotenv.config() should run before you use any environment variables.
// process.env is a Node.js global object that stores environment variables.
// .env is not JavaScript, it’s just a plain text file with KEY=VALUE pairs.