"use strict";
const handler = require("./class-handler");
const db = require("../../../components/db");
const crypto = require("../../../components/crypto");
const util = require("../../../components/util");

//등록
//input -> title, imagePath, classType, curriculumIdx, targetCategory, categoryIdx, subject, desc, beginDate,
//         endDate, academy, tutorIdx, keyword, likeCount, price, authorized, courseLength

module.exports.register = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const newClass = req.options;
    console.log("newClass : ", newClass);
    const result = await handler.insert(newClass, connection);

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
//input -> title, imagePath, classType, curriculumIdx, targetCategory, categoryIdx, subject, desc, beginDate,
//         endDate, academy, tutorIdx, keyword, likeCount, price, authorized, courseLength
module.exports.update = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    let newClass = req.options;
    const originClass = await handler.findOneByIdx(newClass.IDX);
    console.log("originClass : ", originClass);
    if (!originClass) {
      throw { status: 404, errorMessage: "class(IDX) not found" };
    }

    console.log("class : ", newClass);
    const result = await handler.update(newClass, connection);
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
