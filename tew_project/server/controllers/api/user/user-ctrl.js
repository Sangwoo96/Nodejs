"use strict";
const handler = require("./user-handler");
const db = require("../../../components/db");
const crypto = require("../../../components/crypto");
const util = require("../../../components/util");
const JWT = require("../../../libs/jwt/index");

//회원가입
module.exports.register = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const newUser = req.options;
    //비밀번호 암호화
    const { salt, encodedPw } = crypto.createPasswordPbkdf2(newUser.pwd);
    newUser.salt = salt;
    newUser.pwd = encodedPw;
    newUser.register_date = util.getCurrentTime();
    newUser.update_date = util.getCurrentTime();
    console.log("newUser : ", newUser);
    const result = await handler.insert(newUser, connection);
    //console.log("userIndex : ", result.insertId);
    const token = await JWT.createToken({
      idx: result.insertId,
      name: newUser.id
    });
    console.log("token :", token);
    newUser.token = token.accessToken;
    newUser.IDX = result.insertId;
    const updateResult = await handler.update(newUser, connection);
    await db.commit(connection);
    res.status(200).json({ result: updateResult });
  } catch (err) {
    await db.rollback(connection);
    next(err);
  }
};

//input -> id, pwd
//output -> token
module.exports.login = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const user = req.options;
    const result = await handler.getList({
      id: user.id
    });
    if (result.length == 0) {
      throw { status: 404, errorMessage: "Invalid id" };
    }
    //console.log("userpwd : ", user.pwd);
    const encodedPw = crypto.getPasswordPbkdf2(user.pwd, result[0].salt);
    console.log("ecdpwd :", encodedPw);
    console.log("result.pwd :", result.pwd);
    if (result[0].pwd === encodedPw) {
      console.log("password successed");
    } else {
      throw { status: 401, errorMessage: "Invalid password" };
    }
    console.log("result : ", result);
    let newResult = result[0];
    const tokens = await JWT.createToken({
      idx: newResult.idx,
      name: newResult.id
    });
    console.log("token : ", tokens);
    newResult.token = tokens.accessToken;
    newResult.IDX = newResult.idx;
    console.log("newResult : ", newResult);
    const updateResult = await handler.update(newResult, connection);
    await db.commit(connection);
    res.status(200).json({ result: updateResult });
  } catch (err) {
    await db.rollback(connection);
    next(err);
  }
};

//input -> header : token  token.idx로 getList or id로 getList
module.exports.getList = async (req, res, next) => {
  try {
    const jwtToken = await JWT.decodeToken(req.headers.authorization);
    req.idx = jwtToken.sub;
    let originUser = await handler.getList({ idx: req.idx });
    const authorization = `Bearer ${originUser[0].token}`;
    if (authorization !== req.headers.authorization) {
      throw { status: 401, errorMessage: "Invalid token" };
    }
    delete originUser[0].token;
    delete originUser[0].salt;
    delete originUser[0].pwd;
    res.status(200).json(originUser[0]);
  } catch (err) {
    next(err);
  }
};

//업데이트
//input -> header : token -> getlist : token.idx
//         body : pwd
module.exports.update = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const jwtToken = await JWT.decodeToken(req.headers.authorization);
    req.idx = jwtToken.sub;
    let originUser = await handler.getList({ idx: req.idx });
    const authorization = `Bearer ${originUser[0].token}`;
    if (authorization !== req.headers.authorization) {
      throw { status: 401, errorMessage: "Invalid token" };
    }
    let newUser = req.options;
    //비밀번호 재암호화
    const { salt, encodedPw } = crypto.createPasswordPbkdf2(newUser.pwd);
    newUser.salt = salt;
    newUser.pwd = encodedPw;
    newUser.IDX = req.idx;
    newUser.UPDATE_DATE = util.getCurrentTime(); //updatdate -> 현재시간
    const result = await handler.update(newUser, connection);
    console.log("result : ", result);
    await db.commit(connection);
    res.status(200).json({ result: result });
  } catch (err) {
    await db.rollback(connection);
    next(err);
  }
};

//삭제
//input -> header : token -> getlist : token.idx
module.exports.delete = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const jwtToken = await JWT.decodeToken(req.headers.authorization);
    //console.log("token : ", jwtToken);
    req.idx = jwtToken.sub;
    let originUser = await handler.getList({ idx: req.idx });
    const authorization = `Bearer ${originUser[0].token}`;
    if (authorization !== req.headers.authorization) {
      throw { status: 401, errorMessage: "Invalid token" };
    }
    const result = await handler.delete({ idx: req.idx }, connection);
    await db.commit(connection);
    let returnValue = false;
    if (result.affectedRows === 1) {
      returnValue = true;
    }
    res.status(200).json({ result: returnValue });
  } catch (err) {
    await db.rollback(connection);
    next(err);
  }
};
