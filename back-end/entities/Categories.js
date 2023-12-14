const db = require("../services/SetUpMySQL");

async function createCategory(category_name) {
  const query = ` INSERT INTO category
                    (category_name)
                  VALUES (?);`;

  return new Promise((resolve, reject) => {
    db.query(query, [category_name], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results.affectedRows > 0);
        }
      }
    });
  });
}

async function checkCategoryExist(category_name) {
  const query = ` SELECT COUNT(*) AS count 
                  FROM category 
                  WHERE category_name = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [category_name], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].count > 0);
      }
    });
  });
}

module.exports = {
  createCategory,
  checkCategoryExist,
};
