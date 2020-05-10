const db = require("../components/db");

//REPLY 추가
module.exports.insert = async (options, connection) => {
  try {
    return await db.query({
      connection: connection,
      sql: `INSERT INTO REPLY SET ?`,
      values: [options]
    });
  } catch (err) {
    throw new Error(err);
  }
};

//REPLY getlist
module.exports.getList = async options => {
  // condition filter
  try {
    let sql = `SELECT * FROM REPLY`;
    let value;
    if (options.feed_idx) {
      sql += " WHERE feed_idx = ?";
      value = options.feed_idx;
    }
    return await db.query({
      sql: sql,
      values: value
    });
  } catch (err) {
    throw new Error(err);
  }
};

//REPLY 업데이트
module.exports.update = async (options, connection) => {
  try {
    return await db.query({
      connection: connection,
      sql: `UPDATE REPLY SET ? WHERE idx = ?`,
      values: [options, options.IDX]
    });
  } catch (err) {
    throw new Error(err);
  }
};

//REPLY 삭제
module.exports.delete = async (options, connection) => {
  try {
    return await db.query({
      connection,
      sql: `DELETE FROM REPLY WHERE idx = ?`,
      values: [options]
    });
  } catch (err) {
    throw new Error(err);
  }
};
