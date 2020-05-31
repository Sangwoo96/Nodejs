"use strict";
const handler = require("./reply-handler");
const userHandler = require("../user/user-handler");
const db = require("../../../components/db");
//const crypto = require("../../../components/crypto");
const util = require("../../../components/util");
const JWT = require("../../../libs/jwt/index");

//등록
//input -> header : token -> getlist : token.idx
//         body : content, feed_idx
module.exports.register = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const jwtToken = await JWT.decodeToken(req.headers.authorization);
    req.idx = jwtToken.sub;
    let user = await userHandler.getList({ idx: req.idx });
    const authorization = `Bearer ${user[0].token}`;
    if (authorization !== req.headers.authorization) {
      throw { status: 401, errorMessage: "Invalid token" };
    }
    const reply = req.options;
    reply.user_idx = req.idx;
    reply.register_date = util.getCurrentTime();
    reply.update_date = util.getCurrentTime();
    console.log("reply : ", reply);
    const result = await handler.insert(reply, connection);

    await db.commit(connection);
    res.status(200).json({ c: result });
  } catch (err) {
    await db.rollback(connection);
    next(err);
  }
};

// query : feed_idx
module.exports.getList = async (req, res, next) => {
  try {
    const result = await handler.getList({ feed_idx: req.options.IDX });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

//업데이트
//input -> header : token -> getlist : token.idx
//         query : idx
//         body : content
module.exports.update = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const jwtToken = await JWT.decodeToken(req.headers.authorization);
    req.idx = jwtToken.sub;
    let user = await userHandler.getList({ idx: req.idx });
    const authorization = `Bearer ${user[0].token}`;
    if (authorization !== req.headers.authorization) {
      throw { status: 401, errorMessage: "Invalid token" };
    }
    let newreply = req.options;
    newreply.UPDATE_DATE = util.getCurrentTime(); //updatdate -> 현재시간
    console.log("reply : ", newreply);
    const result = await handler.update(newreply, connection);
    await db.commit(connection);
    res.status(200).json({ result: result });
  } catch (err) {
    await db.rollback(connection);
    next(err);
  }
};

//삭제
//input -> header : token -> getlist : token.idx
//         query : reply.idx
//user_idx로 접근권한을 얻고 idx로 어떤 feed를 삭제할 것인지 알려줌
module.exports.delete = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const jwtToken = await JWT.decodeToken(req.headers.authorization);
    req.idx = jwtToken.sub;
    let user = await userHandler.getList({ idx: req.idx });
    const authorization = `Bearer ${user[0].token}`;
    if (authorization !== req.headers.authorization) {
      throw { status: 401, errorMessage: "Invalid token" };
    }
    const result = await handler.delete(req.options.IDX, connection);
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
