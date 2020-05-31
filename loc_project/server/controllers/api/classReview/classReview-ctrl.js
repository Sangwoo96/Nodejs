"use strict";
const handler = require("./classReview-handler");
const db = require("../../../components/db");
const crypto = require("../../../components/crypto");
const util = require("../../../components/util");

//리뷰 등록
//input -> USER_IDX, TABLE_NAME, TABLE_IDX, TITLE, CONTENT, SCORE
////TABLE_IDX, TABLE_NAME이 같으면 동일한 강의
module.exports.register = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    const newReview = req.body;
    const Review = await handler.findOneByOne({
      TABLE_IDX: newReview.TABLE_IDX,
      TABLE_NAME: newReview.TABLE_NAME,
      USER_IDX: newReview.USER_IDX
    });
    //USER_IDX ,TABLE_IDX, TABLE_NAME으로 중복처리, 동일한 유저가 같은 강의 리뷰를 두번이상 못하게하기위함
    //1번유저, CLASSEVERYWHERE, 3 리뷰가 등록되었으면 1번유저가 동일한 강의리뷰를 못하게함
    console.log("Review : ", Review);
    if (Review) {
      throw { status: 409, errorMessage: "Duplicate Review" };
    }
    newReview.REGISTER_DATE = util.getCurrentTime(); //등록시간 -> 현재시간
    newReview.UPDATE_DATE = util.getCurrentTime(); //업데이트 시간 -> 현재시간
    console.log("newReview : ", newReview);
    const result = await handler.insert(newReview, connection);

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

//리뷰 수정
//input -> IDX, TITLE, CONTENT, SCORE
//리뷰를 수정할 때 TITLE, CONTENT, SCORE만 수정함, 강의(TABLE_IDX, TABLE_NAME)에 대한 정보는 수정X
module.exports.update = async (req, res, next) => {
  const connection = await db.beginTransaction();
  try {
    let newReview = req.options;
    const Review = await handler.findOneByIdx(newReview.IDX); //IDX를 확인해 업데이트하려는 강의가 존재하는지 체크
    console.log("Review : ", Review);
    if (!Review) {
      throw { status: 404, errorMessage: "1.Review(IDX) not found" };
    }

    newReview.TABLE_IDX = Review.TABLE_IDX; //TABLE_IDX 수정 불가능
    newReview.TABLE_NAME = Review.TABLE_NAME; //TABLE_NAME 수정 불가능
    newReview.USER_IDX = Review.USER_IDX; //USER_IDX 수정 불가능
    newReview.REGISTER_DATE = Review.REGISTER_DATE; //registerdate 수정 불가능
    newReview.UPDATE_DATE = util.getCurrentTime(); //updatdate -> 현재시간
    console.log("Review : ", newReview);

    const result = await handler.update(newReview, connection);
    if (result === 0)
      throw { status: 404, errorMessage: "2.Review(IDX) not found" };

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
