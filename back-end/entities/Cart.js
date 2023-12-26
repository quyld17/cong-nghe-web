const db = require("../services/SetUpMySQL");

async function addProductToCart(user_id, product) {
  const query = ` INSERT INTO cart_product (
                    user_id, 
                    product_id,
                    quantity,
                    selected)
                  JOIN product_image
                  WHERE 
                    product.product_id = product_image.product_id;`;

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

module.exports = {
  addProductToCart,
};
