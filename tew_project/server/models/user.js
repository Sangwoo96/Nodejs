const db = require("../components/db");

//user 추가
module.exports.insert = async (options, connection) => {
  try {
    return await db.query({
      connection: connection,
      sql: `INSERT INTO USER SET ?`,
      values: [options]
    });
  } catch (err) {
    throw new Error(err);
  }
};

//user getlist
module.exports.getList = async options => {
  try {
    let sql = `SELECT * FROM USER`;
    let value;
    if (options.idx) {
      sql += " WHERE idx = ?";
      value = options.idx;
    }
    if (options.id) {
      sql += " WHERE id = ?";
      value = options.id;
    }
    return await db.query({
      sql: sql,
      values: value
    });
  } catch (err) {
    throw new Error(err);
  }
};

//user 업데이트
module.exports.update = async (options, connection) => {
  try {
    return await db.query({
      connection: connection,
      sql: `UPDATE USER SET ? WHERE IDX = ?`,
      values: [options, options.IDX]
    });
  } catch (err) {
    throw new Error(err);
  }
};

//user 삭제
module.exports.delete = async (idx, connection) => {
  try {
    return await db.query({
      connection,
      sql: `DELETE FROM USER WHERE IDX = ?`,
      values: [idx]
    });
  } catch (err) {
    throw new Error(err);
  }
};
