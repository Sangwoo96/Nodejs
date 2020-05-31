const db = require("../components/db");

//Account 추가
module.exports.insert = async (options, connection) => {
  try {
    const { insertAccount } = await db.query({
      connection: connection,
      sql: `INSERT INTO INFO_ACCOUNT SET ?`,
      values: [options]
    });
    return insertAccount;
  } catch (err) {
    throw new Error(err);
  }
};

//Account getlist
module.exports.getList = async option => {
  // condition filter
  try {
    let sql = `SELECT * FROM INFO_ACCOUNT`;

    // return await db.query(sql)
    return await db.query({
      sql: sql
    });
  } catch (err) {
    throw new Error(err);
  }
};

//Account 업데이트
module.exports.update = async (options, connection) => {
  try {
    const { updateAccount } = await db.query({
      connection: connection,
      sql: `UPDATE INFO_ACCOUNT SET ? WHERE IDX = ?`,
      values: [options, options.IDX]
    });
    return updateAccount;
  } catch (err) {
    throw new Error(err);
  }
};

//Account 삭제
module.exports.delete = async (idx, connection) => {
  try {
    return await db.query({
      connection,
      sql: `DELETE FROM INFO_ACCOUNT WHERE IDX = ?`,
      values: [idx]
    });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports.findOneByIdx = async idx => {
  try {
    let query = `SELECT * FROM INFO_ACCOUNT WHERE IDX = ?`;
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
