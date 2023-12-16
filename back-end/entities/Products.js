const db = require("../services/SetUpMySQL");

async function getProducts() {
  const query = ` SELECT 
                    product.*, 
                    product_image.image_url
                  FROM product
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

async function getProductDetails(product_id) {
  const query = ` SELECT product.*
                  FROM product
                  WHERE product.product_id = ?;`;

  const queryImgs = ` SELECT image_url
                      FROM product_image
                      WHERE product_id = ?;`;

  return new Promise((resolve, reject) => {
    Promise.all([
      new Promise((resolveQuery, rejectQuery) => {
        db.query(query, [product_id], (err, results) => {
          if (err) {
            rejectQuery(err);
          } else {
            if (results.length === 0) {
              resolveQuery(null);
            } else {
              resolveQuery(results[0]);
            }
          }
        });
      }),

      new Promise((resolveQueryImgs, rejectQueryImgs) => {
        db.query(queryImgs, [product_id], (err, resultsImgs) => {
          if (err) {
            rejectQueryImgs(err);
          } else {
            const imageUrls = resultsImgs.map((result) => result.image_url);
            resolveQueryImgs(imageUrls);
          }
        });
      }),
    ])
      .then(([productDetails, imageUrls]) => {
        const result = {
          productDetails: {
            ...productDetails,
            imageUrls: imageUrls,
          },
        };
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function deleteProduct(product_id) {
  const deleteProductQuery = `DELETE FROM product
                              WHERE product_id = ?;`;

  const deleteImageQuery = `DELETE FROM product_image
                            WHERE product_id = ?;`;

  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) {
        reject(err);
        return;
      }
      db.query(deleteImageQuery, [product_id], (err, imageResults) => {
        if (err) {
          return db.rollback(() => reject(err));
        }

        db.query(deleteProductQuery, [product_id], (err, productResults) => {
          if (err) {
            return db.rollback(() => reject(err));
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => reject(err));
            }

            resolve(productResults.affectedRows > 0);
          });
        });
      });
    });
  });
}

async function createProduct(product) {
  const insertProductQuery = `INSERT INTO product (
                                category_id, 
                                product_name, 
                                price, 
                                in_stock_quantity
                              ) VALUES (?, ?, ?, ?);`;

  const insertImageQuery = `INSERT INTO product_image (
                              product_id,
                              image_url,
                              is_thumbnail
                            ) VALUES (?, ?, ?);`;

  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) {
        reject(err);
        return;
      }
      db.query(
        insertProductQuery,
        [
          product.category_id,
          product.product_name,
          product.price,
          product.in_stock_quantity,
        ],
        (err, results) => {
          if (err) {
            return db.rollback(() => reject(err));
          }

          const product_id = results.insertId;
          db.query(
            insertImageQuery,
            [product_id, product.image_url, 1],
            (err, imageResults) => {
              if (err) {
                return db.rollback(() => reject(err));
              }

              db.commit((err) => {
                if (err) {
                  return db.rollback(() => reject(err));
                }

                resolve(results);
              });
            }
          );
        }
      );
    });
  });
}

async function updateProduct(product) {
  const updateProductQuery = `UPDATE product
                              SET
                                category_id = ?,
                                product_name = ?,
                                price = ?,
                                in_stock_quantity = ?
                              WHERE product_id = ?;`;

  const updateImageQuery = `UPDATE product_image
                            SET image_url = ?
                            WHERE product_id = ?;`;

  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) {
        reject(err);
        return;
      }
      db.query(
        updateProductQuery,
        [
          product.category_id,
          product.product_name,
          product.price,
          product.in_stock_quantity,
          product.product_id,
        ],
        (err, productResults) => {
          if (err) {
            return db.rollback(() => reject(err));
          }
          db.query(
            updateImageQuery,
            [product.image_url, product.product_id],
            (err, imageResults) => {
              if (err) {
                return db.rollback(() => reject(err));
              }
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => reject(err));
                }
                resolve(
                  productResults.affectedRows > 0 &&
                    imageResults.affectedRows > 0
                );
              });
            }
          );
        }
      );
    });
  });
}

module.exports = {
  getProducts,
  getProductDetails,
  deleteProduct,
  createProduct,
  updateProduct,
};
