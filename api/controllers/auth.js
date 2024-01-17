const db = require("../connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = (req, res) => {
  // TODO: CHECK USER IF EXIST
  const query = `SELECT * FROM users WHERE username = ?`;
  db.query(query, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists");

    // TODO: CREATE NEW USER
    // * HASH THE PASSWORD
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(req.body.password, salt);

    const q = `INSERT INTO users(username, email, password, name) VALUES (?)`;
    const values = [
      req.body.username,
      req.body.email,
      hashedPass,
      req.body.name,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created");
    });
  });
};

const login = (req, res) => {
  // TODO: LOGIN
  // * CHECK USER IF EXIST
  const query = `SELECT * FROM users WHERE username = ?`;
  db.query(query, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found");

    const checkPass = bcrypt.compareSync(req.body.password, data[0].password);
    if (!checkPass) return res.status(400).json("Wrong password or username");

    const token = jwt.sign(
      { id: JSON.parse(JSON.stringify(data[0].userId)) },
      "secretkey"
    );
    console.log(JSON.parse(JSON.stringify(data[0].userId)));

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out");
};

module.exports = {
  login,
  register,
  logout,
};
