const db = require("../services/SetUpMySQL");

function getUserId(user_name) {
  const query = "SELECT user_id FROM users WHERE user_name = ?;";
  return new Promise((resolve, reject) => {
    db.query(query, [user_name], (err, results) => {
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

async function getUserNameAndImage(mail) {
  const query = "SELECT user_name, image FROM users WHERE mail = ?;";
  return new Promise((resolve, reject) => {
    db.query(query, [mail], (err, results) => {
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

async function verifyAdmin(user_id) {
  const query = ` SELECT role 
                  FROM users 
                  WHERE user_id = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [user_id], (err, results) => {
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

async function getUserDetails(user_id) {
  const query = ` SELECT 
                    user_id,
                    user_name,
                    mail,
                    image
                  FROM users
                  WHERE user_id = ?`;

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

module.exports = {
  getUserId,
  getUserNameAndImage,
  verifyAdmin,
  getUserDetails,
};
