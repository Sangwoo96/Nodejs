"use strict";

const classOffModel = require("../../../models/classOffDetail");

module.exports.findOneByOne = async options => {
  try {
    return await classOffModel.findOneByOne(options);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.findOneByIdx = async idx => {
  try {
    return await classOffModel.findOneByIdx(idx);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.insert = async (options, connection) => {
  try {
    return await classOffModel.insert(options, connection);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.getList = async options => {
  try {
    console.log("getList");
    const result = await classOffModel.getList(options);
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
    return await classOffModel.update(options, connection);
  } catch (e) {
    // throw new Error(e)
    console.log(e);
  }
};

module.exports.delete = async (options, connection) => {
  try {
    return await classOffModel.delete(options.idx, connection);
  } catch (e) {
    throw new Error(e);
  }
};
