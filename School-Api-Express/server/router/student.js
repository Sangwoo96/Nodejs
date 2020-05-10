var express = require("express");
var router = express.Router();
var config = require("../config");
var mysql = require("mysql");
var db = require("../components/db");
var student = require("../model/student");
var school = require("../model/school");
const JWT = require("../libs/jwt/index");
const crypto = require("../components/crypto");

//회원가입
router.post("/", async function(req, res) {
  const connection = await db.beginTransaction();
  try {
    const newStudent = req.body;
    console.log("newStudent : ", newStudent);
    const schoolResult = await school.getList({
      schoolName: newStudent.school
    });
    console.log("schoolResult : ", schoolResult);
    if (schoolResult.length == 0) {
      throw { status: 404, errorMessage: "School not found" };
    }
    const studentResult = await student.getList({ id: newStudent.id });
    if (studentResult.length != 0) {
      throw { status: 409, errorMessage: "Duplicate user id" };
    }

    const { salt, encodedPw } = crypto.createPasswordPbkdf2(newStudent.pwd);
    newStudent.salt = salt;
    newStudent.pwd = encodedPw;
    const results = await student.insert(connection, newStudent);
    console.log("result :", results);
    console.log("userIndex : ", results.insertId);
    const tokens = await JWT.createToken({
      idx: results.insertId,
      name: student.name
    });
    console.log("tokens : ", tokens);
    newStudent.token = tokens.accessToken;
    console.log("newStudent : ", newStudent);
    const updateResults = await student.update(connection, {
      options: newStudent,
      idx: results.insertId
    });

    await db.commit(connection);
    res.status(200).json({ result: updateResults });
  } catch (err) {
    console.log("err : ", err);
    await db.rollback(connection);
    next(err);
  }
});

//로그인
router.post("/signin", async function(req, res) {
  const connection = await db.beginTransaction();
  try {
    const newStudent = req.body;
    const result = await student.getList({
      id: newStudent.id
    });
    if (result.length == 0) {
      throw { status: 404, errorMessage: "User not found" };
    }
    const encodedPw = crypto.getPasswordPbkdf2(newStudent.pwd, result[0].salt);
    console.log("ecdpwd :", encodedPw);
    console.log("result.pwd :", result.pwd);
    if (result[0].pwd === encodedPw) {
      console.log("Authentication succedd");
    } else {
      throw { status: 401, errorMessage: "Authentication failed" };
    }
    console.log("result : ", result);
    let newResult = result[0];
    const tokens = await JWT.createToken({
      idx: newResult.idx,
      name: newResult.name
    });
    let options = {
      token: tokens.accessToken
    };
    console.log("newStudent.idx : ", newResult.idx);
    console.log("options : ", options);
    const results = await student.update(connection, {
      options: options,
      idx: newResult.idx
    });

    newResult.token = tokens.accessToken;
    await db.commit(connection);
    res.status(200).json({ result: newResult });
  } catch (err) {
    console.log("err : ", err);
    await db.rollback(connection);
    next(err);
  }
});

router.put("/", async function(req, res) {
  const connection = await db.beginTransaction();
  try {
    const jwtToken = await JWT.decodeToken(req.headers.authorization);
    req.idx = jwtToken.sub;
    let originStu = await student.getList({ idx: req.idx });
    const authorization = `Bearer ${originStu[0].token}`;
    if (authorization !== req.headers.authorization) {
      throw { status: 401, errorMessage: "Invalid token" };
    }
    const newStudent = req.body;
    const results = await student.update(connection, {
      options: newStudent,
      idx: req.idx
    });
    await db.commit(connection);
    if (results) {
      res.status(200).json({ result: results });
    }
  } catch (err) {
    console.log("err : ", err);
    await db.rollback(connection);
    next(err);
  }
});

router.delete("/", async function(req, res) {
  try {
    const json = req.body;
    const connection = await db.beginTransaction();
    const results = await student.delete(connection, json.idx);
    await db.commit(connection);
    res.status(200).json({ results: results });
  } catch (err) {
    console.log(err);
    await db.rollback(connection);
    next(err);
  }
});

router.get("/", async function(req, res) {
  const studentName = req.query.studentName;
  const results = await student.getList({ studentName: studentName });
  console.log("success");
  res.status(200).json({ result: results });
});

module.exports = router;
