var express = require("express");
var router = express.Router();
var config = require("../config");
var mysql = require("mysql");
var db = require("../components/db");
var school = require("../model/school");

router.post("/", async function(req, res) {
  try {
    const json = req.body;
    const connection = await db.beginTransaction();
    const newSchool = {
      name: json.name,
      address: json.address,
      type: json.type
    };
    const results = await school.insert(connection, newSchool);
    await db.commit(connection);
    res.status(200).json({ result: results });
  } catch (err) {
    console.log(err);
    await db.rollback(connection);
    next(err);
  }
});

router.put("/", async function(req, res) {
  try {
    const json = req.body;
    const newSchool = {
      name: json.name,
      address: json.address,
      type: json.type
    };
    const connection = await db.beginTransaction();
    const results = await school.update(connection, {
      options: newSchool,
      idx: json.idx
    });
    await db.commit(connection);
    res.status(200).json({ results: results });
  } catch (err) {
    console.log(err);
    await db.rollback(connection);
    next(err);
  }
});

router.delete("/", async function(req, res) {
  try {
    const json = req.body;
    const connection = await db.beginTransaction();
    const results = await school.delete(connection, json.idx);
    await db.commit(connection);
    res.status(200).json({ results: results });
  } catch (err) {
    console.log(err);
    await db.rollback(connection);
    next(err);
  }
});

router.get("/", async function(req, res) {
  const schoolName = req.query.schoolName;
  const results = await school.getList({ schoolName: schoolName });
  console.log("success");
  res.status(200).json({ result: results });
});

module.exports = router;
