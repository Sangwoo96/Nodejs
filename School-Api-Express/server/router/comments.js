const express = require("express");
const router = express.Router();
const school = require("../model/school");
const student = require("../model/student");
const comment = require("../model/comments");
const db = require("../components/db");
const util = require("../components/util");

router.post("/", async function(req, res) {
  const connection = await db.beginTransaction();
  try {
    const newComment = req.body;
    console.log("newComment : ", newComment);

    const schoolResult = await school.getList({ idx: newComment.schoolsidx });
    if (schoolResult.length == 0) {
      throw { status: 404, errorMessage: "School not found" };
    }
    const studentResult = await student.getList({
      idx: newComment.studentsIDx
    });
    if (studentResult.length == 0) {
      throw { status: 404, errorMessage: "Student not found" };
    }
    newComment.date = util.getCurrentTime();
    const results = await comment.insert(connection, newComment);
    await db.commit(connection);
    res.status(200).json({ result: results });
  } catch (err) {
    console.log("err : ", err);
    await db.rollback(connection);
    next(err);
  }
});

router.get("/", async function(req, res) {
  let schoolsIdx = req.query.schoolsIdx;
  try {
    let result = await comment.getList({ schoolsIdx: schoolsIdx });
    if (result.length == 0) {
      throw { status: 404, errorMessage: "Comments not found" };
    }
    res.status(200).json({ result: result });
  } catch (err) {
    console.log("err : ", err);
    next(err);
  }
});

module.exports = router;
