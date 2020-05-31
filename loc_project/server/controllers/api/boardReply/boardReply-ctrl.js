"use strict";
const handler = require("./boardReply-handler");
const db = require("../../../components/db");
const crypto = require("../../../components/crypto");
const util = require("../../../components/util");

//등록
//input -> USER_IDX, GROUP,GROUP_ORDER, DEPTH, TITLE, CONTENT
module.exports.register = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const newBoard = req.options;
    newBoard.REGISTER_DATE = util.getCurrentTime(); //등록시간 -> 현재시간
    newBoard.UPDATE_DATE = util.getCurrentTime(); //업데이트 시간 -> 현재시간
    console.log("newBoard : ", newBoard);
    const result = await handler.insert(newBoard, connection);

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
//input -> USER_IDX, GROUP, GROUP_ORDER, DEPTH, TITLE, CONTENT
module.exports.update = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    let newBoard = req.options;
    const board = await handler.findOneByIdx(newBoard.IDX);
    console.log("board : ", board);
    if (!board) {
      throw { status: 404, errorMessage: "1.board(IDX) not found" };
    }

    newBoard.UPDATE_DATE = util.getCurrentTime(); //updatdate -> 현재시간
    console.log("board : ", newBoard);

    const result = await handler.update(newBoard, connection);
    if (result === 0)
      throw { status: 404, errorMessage: "2.board(IDX) not found" };

    await db.commit(connection);
    res.status(200).json({ result: true });
  } catch (err) {
    await db.rollback(connection);
    next(err);
  }
};

//삭제
module.exports.delete = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const result = await handler.delete({ idx: req.options.IDX }, connection);
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
