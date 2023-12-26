const db = require("../services/SetUpMySQL");

async function addProductToCart(user_id, product) {
  const query = ` INSERT INTO cart_product (
                    user_id, 
                    product_id,
                    quantity)
                  VALUES (?, ?, ?);`;

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [user_id, product.product_id, product.quantity],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length === 0) {
            resolve(null);
          } else {
            resolve(results.affectedRows > 0);
          }
        }
      }
    );
  });
}

async function deleteProductFromCart(user_id, product_id) {
  const query = ` DELETE FROM cart_product 
                  WHERE 
                    user_id = ? AND
                    product_id = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [user_id, product_id], (err, results) => {
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

module.exports = {
  addProductToCart,
  deleteProductFromCart,
};
