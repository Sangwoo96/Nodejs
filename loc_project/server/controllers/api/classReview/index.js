"use strict";

const ApiRouter = require("../../default").ApiRouter;
const ctrl = require("./classReview-ctrl");

module.exports.register = new ApiRouter({
  name: "",
  method: "post",
  summary: "Register",
  schema: "PostClassReview",
  tags: ["classReview"],
  description: "",
  isPublic: true,
  responses: {
    200: { description: "success" },
    404: { description: "Invalid data" },
    409: { description: "Duplicate Review" }
  },
  handler: ctrl.register
});

module.exports.getList = new ApiRouter({
  name: "",
  method: "get",
  summary: "GetList",
  schema: "GetClassReview",
  description: "",
  tags: ["classReview"],
  isPublic: true,
  responses: {
    200: { description: "Success" }
    //400: { description: "Invalid dataReview,
  },
  handler: ctrl.getList
});

module.exports.update = new ApiRouter({
  name: ":IDX",
  method: "put",
  summary: "update",
  schema: "UpdateClassReview",
  tags: ["classReview"],
  description: "",
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
  summary: "Delete",
  schema: "DeleteClassReview",
  tags: ["classReview"],
  isPublic: true,
  responses: {
    200: { description: "Success" }
    // 400: { description: "Invalid data" },
    // 409: { description: "Already removeReview},
  },
  handler: ctrl.delete
});
