const crypto = require("crypto");

function generateHash(data, previousHash) {

  const stringData = JSON.stringify(data) + previousHash;

  const hash = crypto
    .createHash("sha256")
    .update(stringData)
    .digest("hex");

  return hash;
}

module.exports = generateHash;