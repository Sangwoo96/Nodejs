const db = require("../components/db");

module.exports.getList = async options => {
  console.log("options : ", options);
  let query = "SELECT * FROM comments";
  let value;
  if (options.schoolsIdx) {
    query += " WHERE schoolsidx = ?";
    value = options.schoolsIdx;
  }
  return await db.query({
    query: query,
    value: value
  });
};

module.exports.insert = async (connection, options) => {
  console.log("options : ", options);
  return await db.query({
    connection: connection,
    query: "INSERT INTO comments SET ?",
    value: options
  });
};

module.exports.update = async (connection, options) => {
  console.log("options : ", options);
  return await db.query({
    connection: connection,
    query: "UPDATE comments SET ? WHERE idx = ?",
    value: [options.options, options.idx]
  });
};

module.exports.delete = async (connection, options) => {
  console.log("options : ", options);
  return await db.query({
    connection: connection,
    query: "DELETE FROM comments WHERE idx = ?",
    value: [options]
  });
};
