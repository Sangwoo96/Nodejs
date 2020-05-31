"use strict";
const handler = require("./classCurriculum-handler");
const db = require("../../../components/db");
const crypto = require("../../../components/crypto");
//const util = require("../../components/util");

//등록
//input -> title, desc
module.exports.register = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const newCurriculum = req.options;
    console.log("newCurriculum : ", newCurriculum);
    const result = await handler.insert(newCurriculum, connection);

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
//input -> title, desc
module.exports.update = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    let newCurriculum = req.options;
    const curriculum = await handler.findOneByIdx(newCurriculum.IDX);
    console.log("curriculum : ", curriculum);
    if (!curriculum) {
      throw { status: 404, errorMessage: "curriculum(IDX) not found" };
    }

    console.log("curriculum : ", newCurriculum);
    const result = await handler.update(newCurriculum, connection);
    if (result === 0) throw { status: 404, errorMessage: "Invalid data" };

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
