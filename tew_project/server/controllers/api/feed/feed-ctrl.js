"use strict";
const handler = require("./feed-handler");
const userHandler = require("../user/user-handler");
const db = require("../../../components/db");
//const crypto = require("../../../components/crypto");
const util = require("../../../components/util");
const JWT = require("../../../libs/jwt/index");

//등록
//input -> header : token -> getlist : token.idx
//        body : feed에 넣을 이미지경로(imagepath), title, content
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
    const newFeed = req.options;
    newFeed.user_idx = req.idx;
    newFeed.register_date = util.getCurrentTime();
    newFeed.update_date = util.getCurrentTime();
    console.log("newFeed : ", newFeed);
    const result = await handler.insert(newFeed, connection);

    await db.commit(connection);
    res.status(200).json({ c: result });
  } catch (err) {
    await db.rollback(connection);
    next(err);
  }
};

module.exports.getList = async (req, res, next) => {
  try {
    const params = req.options;
    const result = await handler.getList(params);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

//업데이트
//input -> header : token -> getlist : token.idx
//         query : feed.idx
//user_idx로 접근권한을 얻고 idx로 어떤 feed를 수정할 것인지 알려줌
//         body : title, content, imagepath
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
    let newFeed = req.options;
    newFeed.UPDATE_DATE = util.getCurrentTime(); //updatdate -> 현재시간
    console.log("feed : ", newFeed);
    const result = await handler.update(newFeed, connection);
    await db.commit(connection);
    res.status(200).json({ result: result });
  } catch (err) {
    await db.rollback(connection);
    next(err);
  }
};

//삭제
//input -> header : token -> getlist : token.idx
//         query : feed.idx
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
    const result = await handler.delete({ IDX: req.options.IDX }, connection);
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
