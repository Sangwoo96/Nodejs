"use strict";

const profileModel = require("../../../models/profile");

module.exports.uploadProfileImg = async (options, connection) => {
  try {
    return await profileModel.insert(options, connection);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.getProfileImg = async idx => {
  try {
    console.log("getProfileImg");
    const result = await profileModel.getList(idx);
    return result;
    // return results.map(result => {
    //   delete result.password;
    //   return result;
    // });
  } catch (e) {
    throw new Error(e);
  }
};

module.exports.updateProfileImg = async (options, connection) => {
  try {
    return await profileModel.update(options, connection);
  } catch (e) {
    // throw new Error(e)
    console.log(e);
  }
};

module.exports.deleteProfileImg = async (options, connection) => {
  try {
    return await profileModel.delete(options.user_idx, connection);
  } catch (e) {
    throw new Error(e);
  }
};
