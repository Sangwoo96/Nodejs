"use strict";

const AccountModel = require("../../../models/infoAccount");

module.exports.findOneByIdx = async idx => {
  try {
    return await AccountModel.findOneByIdx(idx);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.insert = async (options, connection) => {
  try {
    return await AccountModel.insert(options, connection);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.getList = async options => {
  try {
    console.log("getList");
    const result = await AccountModel.getList(options);
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
    return await AccountModel.update(options, connection);
  } catch (e) {
    // throw new Error(e)
    console.log(e);
  }
};

module.exports.delete = async (options, connection) => {
  try {
    return await AccountModel.delete(options.idx, connection);
  } catch (e) {
    throw new Error(e);
  }
};
