"use strict";
const handler = require("./infoAccount-handler");
const db = require("../../../components/db");
const crypto = require("../../../components/crypto");
const util = require("../../../components/util");

//등록
//input -> USER_IDX, BANK, ACCOUNT_NUM
module.exports.register = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const newAccount = req.body;
    newAccount.REGISTER_DATE = util.getCurrentTime(); //등록시간 -> 현재시간
    newAccount.UPDATE_DATE = util.getCurrentTime(); //업데이트 시간 -> 현재시간
    console.log("newAccount : ", newAccount);
    const result = await handler.insert(newAccount, connection);

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
//input -> BANK, ACCOUNT_NUM
module.exports.update = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    let newAccount = req.options;
    const account = await handler.findOneByIdx(newAccount.IDX);
    console.log("account : ", account);
    if (!account) {
      throw { status: 404, errorMessage: "1.Account(IDX) not found" };
    }

    newAccount.UPDATE_DATE = util.getCurrentTime(); //updatdate -> 현재시간
    console.log("Account : ", newAccount);

    const result = await handler.update(newAccount, connection);
    if (result === 0)
      throw { status: 404, errorMessage: "2.Account(IDX) not found" };

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
