"use strict";

const feedModel = require("../../../models/feed");

module.exports.insert = async (options, connection) => {
  try {
    return await feedModel.insert(options, connection);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.getList = async options => {
  try {
    console.log("getList");
    const result = await feedModel.getList(options);
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
    return await feedModel.update(options, connection);
  } catch (e) {
    // throw new Error(e)
    console.log(e);
  }
};

module.exports.delete = async (options, connection) => {
  try {
    return await feedModel.delete(options, connection);
  } catch (e) {
    throw new Error(e);
  }
};
