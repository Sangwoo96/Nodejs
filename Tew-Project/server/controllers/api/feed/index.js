"use strict";

const ApiRouter = require("../../default").ApiRouter;
const ctrl = require("./feed-ctrl");

module.exports.register = new ApiRouter({
  name: "",
  method: "post",
  summary: "feed register",
  schema: "FeedRegister",
  tags: ["Feed"],
  description: "header : token, body : imagepath, title, content",
  isPublic: true,
  responses: {
    200: { description: "success" }
    //404: { description: "Duplicate board" }
    //409: { description: "Duplicate board" }
  },
  handler: ctrl.register
});

module.exports.getList = new ApiRouter({
  name: "",
  method: "get",
  summary: "feed getList",
  schema: "",
  description: "",
  tags: ["Feed"],
  isPublic: true,
  responses: {
    200: { description: "Success" }
    //400: { description: "Invalid data" }
  },
  handler: ctrl.getList
});

module.exports.update = new ApiRouter({
  name: ":IDX",
  method: "put",
  summary: "feed update",
  schema: "",
  tags: ["Feed"],
  description:
    "header : token, query : idx(feed), body : title, content, imagepath ",
  isPublic: true,
  responses: {
    200: { description: "Success" },
    404: { description: "Invalid data" }
  },
  handler: ctrl.update
});

module.exports.delete = new ApiRouter({
  name: ":IDX",
  method: "delete",
  summary: "feed delete",
  schema: "",
  description: "header : token, query : idx",
  tags: ["Feed"],
  isPublic: true,
  responses: {
    200: { description: "Success" }
    // 400: { description: "Invalid data" },
    // 409: { description: "Already removed" }
  },
  handler: ctrl.delete
});
