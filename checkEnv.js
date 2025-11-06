require("dotenv").config({ path: __dirname + "/.env" });
console.log("Loaded .env path:", __dirname + "/.env");
console.log("FACEBOOK_CLIENT_ID =", process.env.FACEBOOK_CLIENT_ID);
console.log("FACEBOOK_CLIENT_SECRET =", process.env.FACEBOOK_CLIENT_SECRET);
