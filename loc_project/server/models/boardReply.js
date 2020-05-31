const db = require("../components/db");

//boardReply 추가
module.exports.insert = async (options, connection) => {
  try {
    const { insertBoard } = await db.query({
      connection: connection,
      sql: `INSERT INTO BOARD_REPLY SET ?`,
      values: [options]
    });
    return insertBoard;
  } catch (err) {
    throw new Error(err);
  }
};

//boardReply getlist
module.exports.getList = async option => {
  // condition filter
  try {
    let sql = `SELECT * FROM BOARD_REPLY`;

    // return await db.query(sql)
    return await db.query({
      sql: sql
    });
  } catch (err) {
    throw new Error(err);
  }
};

//boardReply 업데이트
module.exports.update = async (options, connection) => {
  try {
    const { updateBoard } = await db.query({
      connection: connection,
      sql: `UPDATE BOARD_REPLY SET ? WHERE IDX = ?`,
      values: [options, options.IDX]
    });
    return updateBoard;
  } catch (err) {
    throw new Error(err);
  }
};

//boardReply 삭제
module.exports.delete = async (idx, connection) => {
  try {
    return await db.query({
      connection,
      sql: `DELETE FROM BOARD_REPLY WHERE IDX = ?`,
      values: [idx]
    });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports.findOneByIdx = async idx => {
  try {
    let query = `SELECT * FROM BOARD_REPLY WHERE IDX = ?`;
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
