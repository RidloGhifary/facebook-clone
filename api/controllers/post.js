const moment = require("moment/moment");
const db = require("../connect");
const jwt = require("jsonwebtoken");

const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      userId !== "undefined"
        ? `SELECT p.*, u.userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.userId = p.userId) WHERE p.userId = ? ORDER BY p.created_date DESC`
        : `SELECT p.*, u.userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.userId = p.userId)
        LEFT JOIN relationship AS r ON (p.userId = r.followedUserId)
        WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.created_date DESC`;
    db.query(
      q,
      [userId !== "undefined" ? userId : userInfo.id, userInfo.id],
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      }
    );
  });
};

const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q =
      "INSERT INTO posts (`description`, `img`, `created_date`,`userId`) VALUES (?)";
    const values = [
      req.body.description,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created");
    });
  });
};

const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted");
      return res.status(403).json("You can only delete your post");
    });
  });
};

module.exports = { getPosts, addPost, deletePost };
