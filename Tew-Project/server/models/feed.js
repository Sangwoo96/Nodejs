const db = require("../components/db");

//FEED 추가
module.exports.insert = async (options, connection) => {
  try {
    return await db.query({
      connection: connection,
      sql: `INSERT INTO FEED SET ?`,
      values: [options]
    });
  } catch (err) {
    throw new Error(err);
  }
};

//FEED getlist
module.exports.getList = async options => {
  // condition filter
  try {
    let sql = `SELECT * FROM FEED`;
    let value;
    if (options.user_idx) {
      sql += " WHERE user_idx = ?";
      value = options.user_idx;
    }
    return await db.query({
      sql: sql,
      values: value
    });
  } catch (err) {
    throw new Error(err);
  }
};

//FEED 업데이트
module.exports.update = async (options, connection) => {
  try {
    return await db.query({
      connection: connection,
      sql: `UPDATE FEED SET ? WHERE idx = ?`,
      values: [options, options.IDX]
    });
  } catch (err) {
    throw new Error(err);
  }
};

//FEED 삭제
module.exports.delete = async (options, connection) => {
  try {
    return await db.query({
      connection,
      sql: `DELETE FROM FEED WHERE idx = ?`,
      values: [options.IDX]
    });
  } catch (err) {
    throw new Error(err);
  }
};
