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

module.exports = {
  updateOrderStatus,
};
