const db = require("../services/SetUpMySQL");

async function getProducts() {
  const query = ` SELECT *
                    FROM product;`;
  return new Promise((resolve, reject) => {
    db.query(query, [], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results);
        }
      }
    });
  });
}

async function getProductDetails(product_id) {
  const query = ` SELECT *
                  FROM product
                  WHERE product_id = ?;`;
  return new Promise((resolve, reject) => {
    db.query(query, [product_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0]);
        }
      }
    });
  });
}

module.exports = {
  getProducts,
  getProductDetails,
};
