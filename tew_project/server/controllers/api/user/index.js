"use strict";

const ApiRouter = require("../../default").ApiRouter;
const ctrl = require("./user-ctrl");

module.exports.register = new ApiRouter({
  name: "",
  method: "post",
  summary: "회원가입",
  schema: "UserRegister",
  tags: ["User"],
  description: "body : name, id, pwd",
  isPublic: true,
  responses: {
    200: { description: "success" }
    //404: { description: "Duplicate board" }
    //409: { description: "Duplicate board" }
  },
  handler: ctrl.register
});

module.exports.login = new ApiRouter({
  name: "login",
  method: "post",
  summary: "로그인",
  schema: "UserLogin",
  tags: ["User"],
  description: "body : id, pwd || 로그인 성공 시 토큰 리턴",
  isPublic: true,
  responses: {
    200: { description: "success" },
    401: { description: "Invalid password" },
    404: { description: "Invalid id" }
  },
  handler: ctrl.login
});

module.exports.getList = new ApiRouter({
  name: "",
  method: "get",
  summary: "유저 정보 불러오기",
  schema: "",
  description: "header : token",
  tags: ["User"],
  isPublic: true,
  responses: {
    200: { description: "Success" }
    //400: { description: "Invalid data" }
  },
  handler: ctrl.getList
});

module.exports.update = new ApiRouter({
  name: "",
  method: "put",
  summary: "유저 정보 수정하기",
  schema: "UserUpdate",
  tags: ["User"],
  description: "header : token, body : pwd",
  isPublic: true,
  responses: {
    200: { description: "Success" },
    401: { description: "Invalid token" }
  },
  handler: ctrl.update
});

module.exports.delete = new ApiRouter({
  name: "",
  method: "delete",
  summary: "유저 삭제하기",
  schema: "",
  tags: ["User"],
  description: "header : token",
  isPublic: true,
  responses: {
    200: { description: "Success" },
    401: { description: "Invalid token" }
    // 409: { description: "Already removed" }
  },
  handler: ctrl.delete
});
