"use strict";

const classReviewModel = require("../../../models/classReview");

module.exports.findOneByOne = async options => {
  try {
    return await classReviewModel.findOneByOne(options);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.findOneByIdx = async idx => {
  try {
    return await classReviewModel.findOneByIdx(idx);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.insert = async (options, connection) => {
  try {
    return await classReviewModel.insert(options, connection);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.getList = async options => {
  try {
    console.log("getList");
    const result = await classReviewModel.getList(options);
    // return results.map(result => {
    //   delete result.password;
    return result;
    // });
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.update = async (options, connection) => {
  try {
    return await classReviewModel.update(options, connection);
  } catch (e) {
    // throw new Error(e)
    console.log(e);
  }
};

module.exports.delete = async (options, connection) => {
  try {
    return await classReviewModel.delete(options.idx, connection);
  } catch (e) {
    throw new Error(e);
  }
};
