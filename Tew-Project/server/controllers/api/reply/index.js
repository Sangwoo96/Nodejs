"use strict";

const ApiRouter = require("../../default").ApiRouter;
const ctrl = require("./reply-ctrl");

module.exports.register = new ApiRouter({
  name: "",
  method: "post",
  summary: "reply register",
  schema: "",
  tags: ["Reply"],
  description: "header : token, body : content, feed_idx",
  isPublic: true,
  responses: {
    200: { description: "success" }
    //404: { description: "Duplicate board" }
    //409: { description: "Duplicate board" }
  },
  handler: ctrl.register
});

module.exports.getList = new ApiRouter({
  name: ":IDX",
  method: "get",
  summary: "reply getList",
  schema: "",
  description: "query : feed_idx",
  tags: ["Reply"],
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
  summary: "reply update",
  schema: "",
  tags: ["Reply"],
  description: "header : token, query : idx, body : content",
  isPublic: true,
  responses: {
    200: { description: "Success" },
    401: { description: "Invalid token" }
  },
  handler: ctrl.update
});

module.exports.delete = new ApiRouter({
  name: ":IDX",
  method: "delete",
  summary: "reply delete",
  schema: "",
  description: "header : token, query : reply_idx",
  tags: ["Reply"],
  isPublic: true,
  responses: {
    200: { description: "Success" }
    // 400: { description: "Invalid data" },
    // 409: { description: "Already removed" }
  },
  handler: ctrl.delete
});
