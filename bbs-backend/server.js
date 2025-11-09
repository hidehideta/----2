// server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let posts = []; // この例ではメモリ保存（再起動で消えます）

// 投稿一覧取得
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// 投稿追加
app.post("/api/posts", (req, res) => {
  const { name, message } = req.body;
  const newPost = {
    id: Date.now().toString(),
    name: name || "名無し",
    message,
    createdAt: new Date().toISOString()
  };
  posts.unshift(newPost); // 新しいものを先頭に
  res.status(201).json(newPost);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ バックエンド起動: http://localhost:${PORT}`);
});
