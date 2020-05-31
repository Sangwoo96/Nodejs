const db = require("../components/db");

//오프라인 일정 추가
module.exports.insert = async (options, connection) => {
  try {
    const { insertOff } = await db.query({
      connection: connection,
      sql: `INSERT INTO CLASS_REVIEW SET ?`,
      values: [options]
    });
    return insertOff;
  } catch (err) {
    throw new Error(err);
  }
};

//오프라인 일정 getlist
module.exports.getList = async option => {
  // condition filter
  try {
    let sql = `SELECT * FROM CLASS_REVIEW`;

    // return await db.query(sql)
    return await db.query({
      sql: sql
    });
  } catch (err) {
    throw new Error(err);
  }
};

//오프라인 일정 업데이트
module.exports.update = async (options, connection) => {
  try {
    const { updateOff } = await db.query({
      connection: connection,
      sql: `UPDATE CLASS_REVIEW SET ? WHERE IDX = ?`,
      values: [options, options.IDX]
    });
    return updateOff;
  } catch (err) {
    throw new Error(err);
  }
};

//오프라인 일정 삭제
module.exports.delete = async (idx, connection) => {
  try {
    return await db.query({
      connection,
      sql: `DELETE FROM CLASS_REVIEW WHERE IDX = ?`,
      values: [idx]
    });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports.findOneByOne = async options => {
  try {
    let query = `SELECT * FROM CLASS_REVIEW WHERE TABLE_IDX = ? AND TABLE_NAME = ? AND USER_IDX = ?`;
    // return await db.query(sql, [id])
    console.log("query : ", query);
    const result = await db.query({
      sql: query,
      values: [options.TABLE_IDX, options.TABLE_NAME, options.USER_IDX]
    });
    return result[0];
  } catch (err) {
    throw new Error(err);
  }
};

module.exports.findOneByIdx = async idx => {
  try {
    let query = `SELECT * FROM CLASS_REVIEW WHERE IDX = ?`;
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
