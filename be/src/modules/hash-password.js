// hash-password.js
const bcrypt = require("bcrypt");

const password = "1234567890";
bcrypt.hash(password, 10).then((hash) => {
  console.log("Hashed password:", hash);
});