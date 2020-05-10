"use strict";

const replymodel = require("../../../models/reply");

module.exports.insert = async (options, connection) => {
  try {
    return await replymodel.insert(options, connection);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.getList = async options => {
  try {
    console.log("getList");
    const result = await replymodel.getList(options);
    return result;
    // return results.map(result => {
    //   delete result.password;
    //   return result;
    // });
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.update = async (options, connection) => {
  try {
    return await replymodel.update(options, connection);
  } catch (e) {
    // throw new Error(e)
    console.log(e);
  }
};

module.exports.delete = async (options, connection) => {
  try {
    return await replymodel.delete(options, connection);
  } catch (e) {
    throw new Error(e);
  }
};
