const db = require("../components/db");

//class 추가
module.exports.insert = async (options, connection) => {
  try {
    const { insertClass } = await db.query({
      connection: connection,
      sql: `INSERT INTO Class SET ?`,
      values: [options]
    });
    return insertClass;
  } catch (err) {
    throw new Error(err);
  }
};

//class getlist
module.exports.getList = async option => {
  // condition filter
  try {
    let sql = `SELECT * FROM Class`;

    // return await db.query(sql)
    return await db.query({
      sql: sql
    });
  } catch (err) {
    throw new Error(err);
  }
};

//class 업데이트
module.exports.update = async (options, connection) => {
  try {
    const { classModel } = await db.query({
      connection: connection,
      sql: `UPDATE Class SET ? WHERE IDX = ?`,
      values: [options, options.IDX]
    });
    return classModel;
  } catch (err) {
    throw new Error(err);
  }
};

//class 삭제
module.exports.delete = async (idx, connection) => {
  try {
    return await db.query({
      connection,
      sql: `DELETE FROM Class WHERE IDX = ?`,
      values: [idx]
    });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports.findOneByIdx = async idx => {
  try {
    let query = `SELECT * FROM Class WHERE IDX = ?`;
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
