// Node.jsでexpressを読み込んでいる。expressはWebサーバー(HTTPサーバー)を簡単に作るためのフレームワーク
import express from "express";
// CORSを許可するミドルウェアを読み込む 他のオリジンからのリクエストを許可するため
import cors from "cors";

// expressアプリケーションのインスタンスを作成
const app = express();
//読み込んだcorsミドルウェアをアプリ全体に適応
app.use(cors());
// JSONボディをパースするミドルウェアを適応　POSTリクエストのbodyをJSONとして扱うために必要
app.use(express.json());

/* 投稿データを保存するための配列　この例ではメモリ保存（再起動で消えます）
実運用ではデータベースを用いる。*/
let posts = []; 

// 投稿一覧取得　Getリクエストに対して投稿データをJSON形式で返す
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
