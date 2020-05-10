const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync(`${__dirname}/private.pem`);
//__dirname 현재 경로를 의미
const publicKey = fs.readFileSync(`${__dirname}/public.pem`);

module.exports.createToken = async data => {
  try {
    const payload = {
      aud: data.name,
      sub: data.idx
    };
    const accessToken = await generateToken(payload, privateKey);
    return { accessToken };
  } catch (err) {
    throw err;
  }
};

async function generateToken(payload, isRefresh) {
  try {
    return await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: 60 * 60 * 24
    });
  } catch (err) {
    throw err;
  }
}

module.exports.decodeToken = async token => {
  try {
    if (token && token.split(" ")[0] === "Bearer") {
      return await jwt.verify(token.split(" ")[1], publicKey, {
        algorithms: "RS256"
      });
    } else {
      throw "AccessToken is empty";
    }
  } catch (err) {
    throw { status: 401, errorMessage: err };
  }
};
