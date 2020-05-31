"use strict";

const userModel = require("../../../models/user");

module.exports.insert = async (options, connection) => {
  try {
    return await userModel.insert(options, connection);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.getList = async options => {
  try {
    console.log("getList");
    const result = await userModel.getList(options);
    return result;
    // return result.map(result => {
    //   delete result.pwd;
    //   delete result.update_date;
    //   delete result.register_date;
    //   return result;
    //});
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.update = async (options, connection) => {
  try {
    return await userModel.update(options, connection);
  } catch (e) {
    // throw new Error(e)
    console.log(e);
  }
};

module.exports.delete = async (options, connection) => {
  try {
    return await userModel.delete(options.idx, connection);
  } catch (e) {
    throw new Error(e);
  }
};
