const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "short-db.json");

// Load DB
function loadDB() {
  if (!fs.existsSync(DB_FILE)) return {};
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

// Save DB
function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

const base62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Random 6-character ID
function generateID() {
  let id = "";
  for (let i = 0; i < 6; i++) {
    id += base62[Math.floor(Math.random() * 62)];
  }
  return id;
}

// ENCRYPT (store and return code)
function encode(url) {
  const db = loadDB();

  // Check if already exists
  let existing = Object.keys(db).find(key => db[key] === url);
  if (existing) return existing;

  let id;
  do {
    id = generateID();
  } while (db[id]); // ensure no collision

  db[id] = url;
  saveDB(db);

  return id;
}

// DECRYPT (lookup code)
function decode(id) {
  const db = loadDB();
  return db[id] || null;
}


let code = encode("TEEEEEEEEEEEEEEEEEEEEEEEE-fred.trycloudflare");
console.log("Code:", code);

let original = decode(code);
console.log("Original:", original);


// Export
// module.exports = { encode, decode };
