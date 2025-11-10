// Reactを使うための基本的なインポート
import React, { useState, useEffect } from "react";
// CSSファイルを読み込んで、デザインを適用
import "./App.css";

function App() {
  // 投稿一覧を入れるための「状態（state）」を定義。最初は空の配列。
  const [posts, setPosts] = useState([]);

  // 名前入力用のstate（初期値は空文字）
  const [name, setName] = useState("");

  // 投稿内容（本文）入力用のstate（初期値は空文字）
  const [content, setContent] = useState("");

  // 画面が表示されたタイミング（最初の1回だけ）で投稿データをサーバーから取得する
  useEffect(() => {
    // fetch関数で、バックエンドのAPIから投稿データを取ってくる
    fetch("http://localhost:3000/api/posts")
      // 取得したデータをJSON形式に変換
      .then((res) => res.json())
      // 投稿データをstate（posts）にセット
      .then((data) => setPosts(data))
      // エラーが出た場合はコンソールに表示
      .catch((err) => console.error("Failed to fetch posts:", err));
  }, []); // [] は「最初の1回だけ実行」という意味

  // 投稿ボタンを押したときの処理
  const handleSubmit = async (e) => {
    e.preventDefault(); // ページがリロードされるのを防ぐ

    // 投稿内容が空なら何もしない
    if (!content.trim()) return;

    // サーバーに新しい投稿データを送る
    const res = await fetch("http://localhost:3000/api/posts", {
      method: "POST", // データを送る（POSTリクエスト）
      headers: { "Content-Type": "application/json" }, // JSON形式で送るよ、という指定
      body: JSON.stringify({ name, message: content }), // 送るデータをJSONに変換
    });

    // もし送信に失敗したらエラーを表示して処理を止める
    if (!res.ok) {
      console.error("投稿失敗:", res.status);
      return;
    }

    // サーバーから返ってきた新しい投稿データを受け取る
    const newPost = await res.json();

    // 新しい投稿を先頭に追加して、投稿一覧を更新する
    setPosts([newPost, ...posts]);

    // 入力欄を空にする
    setName("");
    setContent("");
  };

  // 実際に画面に表示する部分（JSX）
  return (
    <div className="container">
      <h1>掲示板（サブゼミ2）</h1>

      {/* 投稿フォーム部分 */}
      <form onSubmit={handleSubmit}>
        {/* 名前入力欄 */}
        <input
          type="text"
          placeholder="名前（省略可）"
          value={name}
          onChange={(e) => setName(e.target.value)} // 入力されるたびにstateを更新
        />

        {/* 投稿内容入力欄 */}
        <textarea
          placeholder="投稿内容を入力"
          value={content}
          onChange={(e) => setContent(e.target.value)} // 入力されるたびにstateを更新
        />

        {/* 投稿ボタン */}
        <button type="submit">投稿</button>
      </form>

      {/* 投稿一覧の表示部分 */}
      <div className="posts">
        {/* postsの配列を1つずつ取り出して表示 */}
        {posts.map((post) => (
          <div key={post.id} className="post">
            <p className="meta">
              {/* 名前がなければ「名無し」と表示 */}
              <strong>{post.name || "名無し"}</strong>{" "}
              {/* 投稿日時をわかりやすい形式に変換して表示 */}
              <small>{new Date(post.createdAt).toLocaleString()}</small>
            </p>

            {/* 投稿内容を表示（messageまたはcontentどちらかが存在） */}
            <p className="body">{post.message || post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 他のファイルからこのコンポーネントを使えるようにする
export default App;
