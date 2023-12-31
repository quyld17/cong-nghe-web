const db = require("../services/SetUpMySQL");

async function signIn(account) {
  const query = ` SELECT COUNT(*) AS count 
                  FROM user 
                  WHERE 
                    email = ? AND 
                    password = ?;`;

  return new Promise((resolve, reject) => {
    db.query(query, [account.email, account.password], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].count > 0);
      }
    });
  });
}

module.exports = {
  signIn,
};
