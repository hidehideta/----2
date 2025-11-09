import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Failed to fetch posts:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const res = await fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message: content }),
    });

    if (!res.ok) {
      console.error("投稿失敗:", res.status);
      return;
    }

    const newPost = await res.json();
    setPosts([newPost, ...posts]);
    setName("");
    setContent("");
  };

  return (
    <div className="container">
      <h1>掲示板（サブゼミ2）</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名前（省略可）"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="投稿内容を入力"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">投稿</button>
      </form>

      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <p className="meta">
              <strong>{post.name || "名無し"}</strong>{" "}
              <small>{new Date(post.createdAt).toLocaleString()}</small>
            </p>
            <p className="body">{post.message || post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
