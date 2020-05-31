"use strict";
const handler = require("./classOffDetail-handler");
const db = require("../../../components/db");
const crypto = require("../../../components/crypto");
const util = require("../../../components/util");

//등록
//input -> TABLE_NAME, TABLE_IDX, MAP_LINK, LOCATION, START_DATE, END_DATE
//TABLE_NAME, TABLE_IDX가 동일한 것은 같은 강의
module.exports.register = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const newlec = req.body;
    const lec = await handler.findOneByOne({
      IDX: newlec.TABLE_IDX,
      TABLE_NAME: newlec.TABLE_NAME
    }); //TABLE_IDX, TABLE_NAME으로 중복처리, 동일한 강의가 두번이상 등록X
    console.log("lec : ", lec);
    if (lec) {
      throw { status: 409, errorMessage: "Duplicate Lecture" };
    }
    newlec.REGISTER_DATE = util.getCurrentTime(); //등록시간 -> 현재시간
    newlec.UPDATE_DATE = util.getCurrentTime(); //업데이트 시간 -> 현재시간
    console.log("newlec : ", newlec);
    const result = await handler.insert(newlec, connection);

    await db.commit(connection);
    res.status(200).json({ c: result });
  } catch (err) {
    await db.rollback(connection);
    next(err);
  }
};

module.exports.getList = async (req, res, next) => {
  try {
    const params = req.body;

    const result = await handler.getList(params);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

//강의 업데이트
//input -> IDX, TABLE_NAME, TABLE_IDX, MAP_LINK, LOCATION, START_DATE, END_DATE
module.exports.update = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    let newlec = req.options;
    const lec = await handler.findOneByIdx(newlec.IDX); //IDX를 확인해 업데이트하려는 강의가 존재하는지 체크
    console.log("lec : ", lec);
    if (!lec) {
      throw { status: 404, errorMessage: "1.lecture(IDX) not found" };
    }

    newlec.REGISTER_DATE = lec.REGISTER_DATE; //registerdate 변경x
    newlec.UPDATE_DATE = util.getCurrentTime(); //updatdate -> 현재시간으
    console.log("lecture : ", newlec);

    const result = await handler.update(newlec, connection);
    if (result === 0)
      throw { status: 404, errorMessage: "2.lecture(IDX) not found" };

    await db.commit(connection);
    res.status(200).json({ result: true });
  } catch (err) {
    await db.rollback(connection);
    next(err);
  }
};

//삭제
//input -> IDX
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
