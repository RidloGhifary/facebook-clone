const express = require("express");
const userRoutes = require("./routes/users.js");
const postsRoutes = require("./routes/posts.js");
const likesRoutes = require("./routes/likes.js");
const commentsRoutes = require("./routes/comments.js");
const relationshipRoutes = require("./routes/relationships.js");
const authRoutes = require("./routes/auth.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const app = express();

// * MIDDLEWARE
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/relationship", relationshipRoutes);

app.listen(8800, () => {
  console.log("listening on port 8800");
});
