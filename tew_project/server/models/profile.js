const db = require("../components/db");

//PROFILE_IMG 추가
module.exports.insert = async (options, connection) => {
  try {
    const { insert } = await db.query({
      connection: connection,
      sql: `INSERT INTO PROFILE_IMG SET ?`,
      values: [options]
    });
    return insert;
  } catch (err) {
    throw new Error(err);
  }
};

//GET PROFILE_IMG
module.exports.getList = async idx => {
  try {
    let query = `SELECT * FROM PROFILE_IMG WHERE user_idx = ?`;
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

//PROFILE_IMG 업데이트
module.exports.update = async (options, connection) => {
  try {
    const { insert } = await db.query({
      connection: connection,
      sql: `UPDATE PROFILE_IMG SET ? WHERE user_idx = ?`,
      values: [options, options.user_idx]
    });
    return insert;
  } catch (err) {
    throw new Error(err);
  }
};

//PROFILE_IMG 삭제
module.exports.delete = async (user_idx, connection) => {
  try {
    return await db.query({
      connection,
      sql: `DELETE FROM PROFILE_IMG WHERE user_idx = ?`,
      values: [user_idx]
    });
  } catch (err) {
    throw new Error(err);
  }
};
