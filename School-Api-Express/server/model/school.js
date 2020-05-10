const db = require("../components/db");

module.exports.getList = async options => {
  console.log("options : ", options);
  let query = "SELECT * FROM schools";
  let value;
  if (options.idx) {
    query += " WHERE idx = ?";
    value = options.idx;
  }
  if (options.schoolName) {
    query += " WHERE name = ?";
    value = options.schoolName;
  }
  return await db.query({
    query: query,
    value: value
  });
};

module.exports.insert = async (connection, options) => {
  return await db.query({
    connection: connection,
    query: "INSERT INTO schools SET ?",
    value: options
  });
};

module.exports.update = async (connection, options) => {
  // console.log("options : ", options);
  return await db.query({
    connection: connection,
    query: "UPDATE schools SET ? WHERE idx = ?",
    value: [options.options, options.idx]
  });
};

module.exports.delete = async (connection, options) => {
  // console.log("option :", options);
  return await db.query({
    connection: connection,
    query: "DELETE FROM schools WHERE idx = ?",
    value: [options]
  });
};
