"use strict";

const ApiRouter = require("../../default").ApiRouter;
const ctrl = require("./common-ctrl");

module.exports.profileUploadUrl = new ApiRouter({
  name: "profile/url",
  method: "get",
  summary: "Get a s3 pre-signed url",
  schema: "GetImagePreSignedUrl",
  description: "input : mimetype, extension, filename || output : uploadUrl",
  tags: ["Common"],
  isPublic: "true",
  responses: {
    200: { description: "Success" },
    400: { description: "Invalid data" }
  },
  handler: ctrl.profileUploadUrl
});

module.exports.getExtension = new ApiRouter({
  name: "file/extension",
  method: "get",
  summary: "Get a file extension",
  schema: "",
  tags: ["Common"],
  description: "input : 업로드 할 파일 || output : extension",
  isPublic: "true",
  responses: {
    200: { description: "Success" },
    400: { description: "Invalid data" }
  },
  handler: ctrl.getExtension
});

module.exports.uploadView = new ApiRouter({
  name: "",
  method: "get",
  summary: "fileUpload view(server test)",
  schema: "",
  tags: ["Common"],
  isPublic: "true",
  //responses: {},
  handler: ctrl.uploadView
});

module.exports.uploadProfileImg = new ApiRouter({
  name: "profile",
  method: "post",
  summary: "upload profileurl to database(profile_img)",
  schema: "UploadProfileImg",
  tags: ["Common"],
  description: "header : token, body : path",
  isPublic: "true",
  responses: {
    200: { description: "Success" },
    400: { description: "Invalid data" }
  },
  handler: ctrl.uploadProfileImg
});

module.exports.getProfileImg = new ApiRouter({
  name: "profile",
  method: "get",
  summary: "get profileImg",
  schema: "GetProfileImg",
  tags: ["Common"],
  description: "header : token",
  isPublic: "true",
  responses: {
    200: { description: "Success" },
    400: { description: "Invalid data" }
  },
  handler: ctrl.getProfileImg
});

module.exports.deleteProfileImg = new ApiRouter({
  name: "profile",
  method: "delete",
  summary: "profileImg delete",
  schema: "",
  description: "header : token",
  tags: ["Common"],
  isPublic: "true",
  responses: {
    200: { description: "Success" },
    400: { description: "Invalid data" }
  },
  handler: ctrl.deleteProfileImg
});

module.exports.updateProfileImg = new ApiRouter({
  name: "profile",
  method: "put",
  summary: "profileImg update",
  schema: "UpdateProfileImg",
  tags: ["Common"],
  description: "header : token, body : path",
  isPublic: "true",
  responses: {
    200: { description: "Success" },
    400: { description: "Invalid data" }
  },
  handler: ctrl.updateProfileImg
});
