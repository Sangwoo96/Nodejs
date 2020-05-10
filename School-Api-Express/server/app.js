const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var path = require("path");

//const mysql = require("mysql");
//미들웨어 를 통해서 body-paser가 post를 통해 전달된
//내용을 사용할 수 있게 해준다.

let routerSchool = require("./router/school.js");
let routerStudent = require("./router/student.js");
var routerCommon = require("./router/common");
var indexRouter = require("./router/index");
var routerComments = require("./router/comments");

var cors = require("cors");

app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", indexRouter);
app.use("/school", routerSchool); //urlpath, module
app.use("/student", routerStudent);
app.use("/common", routerCommon);
app.use("/comments", routerComments);

app.listen(3000, () => {
  console.log("Express App on port 3000!");
});
