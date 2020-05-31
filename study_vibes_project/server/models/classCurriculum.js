const db = require("../components/db");

//curriculum 추가
module.exports.insert = async (options, connection) => {
  try {
    const { insertCurriculum } = await db.query({
      connection: connection,
      sql: `INSERT INTO ClassCurriculum SET ?`,
      values: [options]
    });
    return insertCurriculum;
  } catch (err) {
    throw new Error(err);
  }
};

//curriculum getlist
module.exports.getList = async option => {
  // condition filter
  try {
    let sql = `SELECT * FROM ClassCurriculum`;

    // return await db.query(sql)
    return await db.query({
      sql: sql
    });
  } catch (err) {
    throw new Error(err);
  }
};

//curriculum 업데이트
module.exports.update = async (options, connection) => {
  try {
    const { curriculumModel } = await db.query({
      connection: connection,
      sql: `UPDATE ClassCurriculum SET ? WHERE IDX = ?`,
      values: [options, options.IDX]
    });
    return curriculumModel;
  } catch (err) {
    throw new Error(err);
  }
};

//curriculum 삭제
module.exports.delete = async (idx, connection) => {
  try {
    return await db.query({
      connection,
      sql: `DELETE FROM ClassCurriculum WHERE IDX = ?`,
      values: [idx]
    });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports.findOneByIdx = async idx => {
  try {
    let query = `SELECT * FROM ClassCurriculum WHERE IDX = ?`;
    // return await db.query(sql, [id])
    console.log("query : ", query);
    const result = await db.query({
      sql: query,
      values: [idx]
    });
    return result[0];
  } catch (err) {
    throw new Error(err);
  }
};
