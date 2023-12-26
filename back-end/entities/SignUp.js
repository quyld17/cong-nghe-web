const db = require("../services/SetUpMySQL");

async function signUp(email, password, role) {
  const query = ` INSERT INTO user (
                    email,
                    password, 
                    role) 
                  VALUES (?, ?, ?);`;

  return new Promise((resolve, reject) => {
    db.query(query, [email, password, role], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.affectedRows > 0);
      }
    });
  });
}

async function isUserAlreadyRegistered(email) {
  const query = ` SELECT COUNT(*) AS count 
                  FROM user   
                  WHERE email = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].count > 0);
      }
    });
  });
}

module.exports = {
  isUserAlreadyRegistered,
  signUp,
};
