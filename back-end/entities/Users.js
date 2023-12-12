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

// async function verifyAdmin(user_id) {
//   const query = ` SELECT role
//                   FROM users
//                   WHERE user_id = ?;`;

//   return new Promise((resolve, reject) => {
//     db.query(query, [user_id], (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         if (results.length === 0) {
//           resolve(null);
//         } else {
//           resolve(results[0].role);
//         }
//       }
//     });
//   });
// }

// async function getUserDetails(user_id) {
//   const query = ` SELECT
//                     user_id,
//                     full_name,
//                     mail,
//                     image
//                   FROM users
//                   WHERE user_id = ?`;

//   return new Promise((resolve, reject) => {
//     db.query(query, [user_id], (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         if (results.length === 0) {
//           resolve(null);
//         } else {
//           resolve(results[0]);
//         }
//       }
//     });
//   });
// }

module.exports = {
  getUserIdByEmail,
  getRole,
  // verifyAdmin,
  // getUserDetails,
};
