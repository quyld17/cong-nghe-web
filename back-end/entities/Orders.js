const db = require("../services/SetUpMySQL");

async function updateOrderStatus(status, order_id) {
  const query = ` UPDATE \`order\` 
                  SET status = ? 
                  WHERE order_id = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [status, order_id], (err, results) => {
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

async function placeOrder(
  user_id,
  payment_method,
  address_id,
  products,
  in_cart
) {
  const insertOrderQuery = `INSERT INTO \`order\` (
                              user_id,
                              total_price,
                              payment_method,
                              status,
                              address_id) 
                            VALUES (?, ?, ?, ?, ?);`;

  const insertOrderProductsQuery = `INSERT INTO order_products (
                                      order_id,
                                      product_id,
                                      product_name,
                                      quantity,
                                      price) 
                                    VALUES (?, ?, ?, ?, ?);`;

  const deleteFromCartQuery = ` DELETE FROM cart_product 
                                WHERE 
                                  user_id = ? AND 
                                  product_id = ?;`;

  const updateProductQuantityQuery = `UPDATE product
                                      SET in_stock_quantity = in_stock_quantity - ?
                                      WHERE product_id = ?;`;

  return new Promise(async (resolve, reject) => {
    db.beginTransaction(async (err) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const totalPrice = await calculateTotalPrice(products);
        const orderResult = await new Promise((resolve, reject) => {
          db.query(
            insertOrderQuery,
            [user_id, totalPrice, payment_method, "Pending", address_id],
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results);
              }
            }
          );
        });

        const orderId = orderResult.insertId;
        for (const product of products) {
          const productInfo = await getProductInfo(product.product_id);

          await new Promise((resolve, reject) => {
            db.query(
              insertOrderProductsQuery,
              [
                orderId,
                product.product_id,
                productInfo.product_name,
                product.quantity,
                productInfo.price,
              ],
              (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(results);
                }
              }
            );
          });

          await new Promise((resolve, reject) => {
            db.query(
              updateProductQuantityQuery,
              [product.quantity, product.product_id],
              (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }

        if (in_cart === 1) {
          for (const product of products) {
            await new Promise((resolve, reject) => {
              db.query(
                deleteFromCartQuery,
                [user_id, product.product_id],
                (err, results) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(results);
                  }
                }
              );
            });
          }
        }

        db.commit((err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      } catch (error) {
        db.rollback(() => {
          reject(error);
        });
      }
    });
  });
}

async function getProductInfo(product_id) {
  const selectProductQuery = `SELECT 
                                product_name,
                                price
                              FROM product 
                              WHERE product_id = ?;`;

  return new Promise((resolve, reject) => {
    db.query(selectProductQuery, [product_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        const productInfo = results[0];
        resolve(productInfo);
      }
    });
  });
}

async function calculateTotalPrice(products) {
  const getPriceQuery = ` SELECT price 
                          FROM product
                          WHERE product_id = ?;`;

  const pricePromises = products.map((product) => {
    return new Promise((resolve, reject) => {
      db.query(getPriceQuery, [product.product_id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          const price = parseFloat(results[0].price);
          resolve(price * product.quantity);
        }
      });
    });
  });

  try {
    const prices = await Promise.all(pricePromises);
    const totalPrice = prices.reduce((sum, price) => sum + price, 0);
    return totalPrice;
  } catch (error) {
    throw error;
  }
}

async function checkValidProductQuantity(products) {
  const query = ` SELECT 
                    product_name, 
                    in_stock_quantity
                  FROM product
                  WHERE product_id = ?;`;

  for (const product of products) {
    return new Promise((resolve, reject) => {
      db.query(query, [product.product_id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (product.quantity > results[0].in_stock_quantity) {
            resolve(results[0].product_name);
          }
          resolve(null);
        }
      });
    });
  }
}

module.exports = {
  updateOrderStatus,
  placeOrder,
  checkValidProductQuantity,
};
