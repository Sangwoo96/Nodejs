"use strict";

const ApiRouter = require("../../default").ApiRouter;
const ctrl = require("./infoAccount-ctrl");

module.exports.register = new ApiRouter({
  name: "",
  method: "post",
  summary: "Register",
  schema: "PostInfoAccount",
  tags: ["infoAccount"],
  description: "",
  isPublic: true,
  responses: {
    200: { description: "success" }
    //404: { description: "Invalid data" },
    //409: { description: "Duplicate lecture" }
  },
  handler: ctrl.register
});

module.exports.getList = new ApiRouter({
  name: "",
  method: "get",
  summary: "GetList",
  schema: "GetInfoAccount",
  description: "",
  tags: ["infoAccount"],
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
  summary: "update",
  schema: "UpdateInfoAccount",
  tags: ["infoAccount"],
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
  schema: "DeleteInfoAccount",
  tags: ["infoAccount"],
  isPublic: true,
  responses: {
    200: { description: "Success" }
    // 400: { description: "Invalid data" },
    // 409: { description: "Already removed" }
  },
  handler: ctrl.delete
});
