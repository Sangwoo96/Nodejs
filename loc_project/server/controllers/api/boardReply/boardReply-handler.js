"use strict";

const boardModel = require("../../../models/boardReply");

module.exports.findOneByIdx = async idx => {
  try {
    return await boardModel.findOneByIdx(idx);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.insert = async (options, connection) => {
  try {
    return await boardModel.insert(options, connection);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.getList = async options => {
  try {
    console.log("getList");
    const result = await boardModel.getList(options);
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
    return await boardModel.update(options, connection);
  } catch (e) {
    // throw new Error(e)
    console.log(e);
  }
};

module.exports.delete = async (options, connection) => {
  try {
    return await boardModel.delete(options.idx, connection);
  } catch (e) {
    throw new Error(e);
  }
};
