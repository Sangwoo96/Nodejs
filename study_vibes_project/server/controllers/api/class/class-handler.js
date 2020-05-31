"use strict";

const classModel = require("../../../models/class");

module.exports.findOneByIdx = async idx => {
  try {
    return await classModel.findOneByIdx(idx);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.insert = async (options, connection) => {
  try {
    return await classModel.insert(options, connection);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.getList = async options => {
  try {
    console.log("getList");
    const result = await classModel.getList(options);
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
    return await classModel.update(options, connection);
  } catch (e) {
    // throw new Error(e)
    console.log(e);
  }
};

module.exports.delete = async (options, connection) => {
  try {
    return await classModel.delete(options.idx, connection);
  } catch (e) {
    throw new Error(e);
  }
};
