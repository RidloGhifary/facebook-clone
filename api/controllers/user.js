const db = require("../connect");
const jwt = require("jsonwebtoken");

const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = `SELECT * FROM users WHERE userId = ?`;

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...other } = data[0];
    return res.json(other);
  });
};

const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q =
      "UPDATE users SET `name`=?, `city`=?, `website`=? , `profilePic`=?, `coverPic`=? WHERE userId = ?";
    const values = [
      req.body.name,
      req.body.city,
      req.body.website,
      req.body.profilePic,
      req.body.coverPic,
      userInfo.id,
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err.response);
      if (data.affectedRows > 0)
        return res.status(200).json("Account has been updated");
      return res.status(403).json("You can update only your account!");
    });
  });
};

module.exports = { getUser, updateUser };
