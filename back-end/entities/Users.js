const db = require("../services/SetUpMySQL");

async function getUserIdByEmail(email) {
  const query = ` SELECT user_id
                  FROM user
                  WHERE email = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0].user_id);
        }
      }
    });
  });
}

async function getRole(email) {
  const query = ` SELECT role
                  FROM user
                  WHERE email = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0].role);
        }
      }
    });
  });
}

async function verifyAdmin(user_id) {
  const query = ` SELECT role
                  FROM user
                  WHERE user_id = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [user_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0].role === "admin");
        }
      }
    });
  });
}

async function updateUserDetails(user, user_id) {
  const query = ` UPDATE user
                  SET 
                    full_name = ?,
                    date_of_birth = ?,
                    phone_number = ?,
                    gender = ?
                  WHERE user_id = ?;`;

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        user.full_name,
        user.date_of_birth,
        user.phone_number,
        user.gender,
        user_id,
      ],
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

async function checkPassword(user_id, password) {
  const query = ` SELECT COUNT(*) AS count 
                  FROM user
                  WHERE 
                    user_id = ? AND
                    password = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [user_id, password], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].count > 0);
      }
    });
  });
}

async function changePassword(user_id, password, new_password) {
  const query = ` UPDATE user
                  SET password = ?
                  WHERE 
                    user_id = ? AND
                    password = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [new_password, user_id, password], (err, results) => {
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

async function createAddress(user_id, address, is_default) {
  const query = ` INSERT INTO address (
                    city,
                    district,
                    ward,
                    street,
                    house_number,
                    user_id,
                    is_default)
                  VALUES (?, ?, ?, ?, ?, ?, ?);`;

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        address.city,
        address.district,
        address.ward,
        address.street,
        address.house_number,
        user_id,
        is_default,
      ],
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

async function checkExistedAddress(user_id) {
  const query = ` SELECT COUNT(*) AS count 
                  FROM address
                  WHERE user_id = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [user_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].count > 0);
      }
    });
  });
}

async function deleteAddress(user_id, address_id) {
  const query = ` DELETE FROM address
                  WHERE 
                    user_id = ? AND
                    address_id = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [user_id, address_id], (err, results) => {
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

async function checkDefaultAddress(user_id, address_id) {
  const query = ` SELECT COUNT(*) AS count 
                  FROM address
                  WHERE 
                    user_id = ? AND
                    address_id = ? AND 
                    is_default = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [user_id, address_id, 1], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0].count > 0);
        }
      }
    });
  });
}

async function setDefaultAddress(user_id, address_id) {
  const updatePreviousDefaultQuery = `  UPDATE address 
                                        SET is_default = 0 
                                        WHERE 
                                          user_id = ? AND 
                                          is_default = 1;`;
  const setNewDefaultQuery = `  UPDATE address 
                                SET is_default = 1 
                                WHERE 
                                  user_id = ? AND   
                                  address_id = ?;`;

  return new Promise(async (resolve, reject) => {
    db.beginTransaction(async (err) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        await new Promise((resolve, reject) => {
          db.query(updatePreviousDefaultQuery, [user_id], (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results.affectedRows);
            }
          });
        });

        await new Promise((resolve, reject) => {
          db.query(
            setNewDefaultQuery,
            [user_id, address_id],
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results.affectedRows);
              }
            }
          );
        });

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

async function getUserInfos(user_id) {
  const query = ` SELECT 
                    full_name,
                    date_of_birth,
                    phone_number,
                    gender
                  FROM user 
                  WHERE user_id = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [user_id], (err, results) => {
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

async function checkAddress(user_id) {
  const query = `SELECT COUNT(*) AS count 
                            FROM address
                            WHERE user_id = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [user_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0].count);
        }
      }
    });
  });
}

module.exports = {
  getUserIdByEmail,
  getRole,
  verifyAdmin,
  updateUserDetails,
  checkPassword,
  changePassword,
  createAddress,
  checkExistedAddress,
  deleteAddress,
  checkDefaultAddress,
  setDefaultAddress,
  getUserInfos,
  checkAddress,
};
