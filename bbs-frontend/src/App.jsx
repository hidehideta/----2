// Reactを使うための基本的なインポート
import React, { useState, useEffect } from "react";
// CSSファイルを読み込んで、デザインを適用
import "./App.css";

function App() {
  /* 投稿一覧を入れるための「状態（state）」を定義。最初は空の配列。
posts(今の状態)にsetPosts(新たな状態)が入るという意味。useStateは黒板のようなもの。
すぐ下のname,setNameもcontest,setContestも同じ */
   const [posts, setPosts] = useState([]);

  // 名前入力用のstate（初期値は空文字）
  const [name, setName] = useState("");   

  // 投稿内容（本文）入力用のstate（初期値は空文字）した
  const [content, setContent] = useState("");



  // 画面が表示されたタイミング（最初の1回だけ）で投稿データをサーバーから取得する
  useEffect(() => {
    // fetch関数で、バックエンドのAPIから投稿データを取ってくる
    fetch("http://localhost:3000/api/posts")
      /* 取得したデータをJSON形式に変換　なぜなら、fetch関数でとってきたものをJavaScriptとして
      使用できるデータに変える必要があるから*/
      .then((res) => res.json())
      // 投稿データをstate（posts）にセット
      .then((data) => setPosts(data))
      // エラーが出た場合はコンソールに表示　consoleはJSにおいて表示されるコード,Pythonだったらprintと同じ
      .catch((err) => console.error("Failed to fetch posts:", err));
  }, []); // [] は「最初の1回だけ実行」という意味


  /*投稿ボタンを押したときの処理　
  const handleSubmitで関数を定義している
  ここでの「e」はイベントオブジェクトの略
  async(e)というのは、非同期処理が使えるということ 
  待っている間もほかの処理を進めるという意味
  e.preventDefault()は投稿ボタンを押した先に、ページがリロードしないようにしている
  メリットとして、いったんこちら側で確認できるから。*/
  const handleSubmit = async (e) => {
    e.preventDefault(); // ページがリロードされるのを防ぐ


    /*投稿内容が空なら何もしない
    trim()は文字列の前後の空白を取り除くメソッド
    !といのは、「not(否定)」を意味する
    !content.trim()というのは、中身が空ならtrue 中身があればfalse
    returnだけ書いているので、「ここで処理をストップして関数を終わる」という意味になる*/
    if (!content.trim()) return;

    // サーバーに新しい投稿データを送る
    //await fetchによって「投稿データを送り終えて、サーバーがOKって言うまでちょっと待つ」
    const res = await fetch("http://localhost:3000/api/posts", {
      method: "POST", // データを送る（POSTリクエスト）
      headers: { "Content-Type": "application/json" }, // JSON形式で送るよ、という指定
      body: JSON.stringify({ name, message: content }), /* 送るデータをサーバー側が理解できるJSONに変換 ここが大事!bodyには文字列
しか送れないから JSON.stringify()で文字列に変えている　これにより、サーバー側がJSON形式の投稿が来たなと理解できる。*/
  
    });


    /*もし送信に失敗したらエラーを表示して処理を止める
    上で定めたresがokじゃなかったら(！という否定によるもの)
    errorとして「投稿失敗:400」(400はres.statusのスタータスコード)を出す
   */
  if (!res.ok) {
      console.error("投稿失敗:", res.status);
      return;
    }


    // サーバーから返ってきた新しい投稿データをJavaScriptで使える形として受け取る
    const newPost = await res.json();

    // 新しい投稿（newPost）を一番上に追加して、画面の投稿一覧（posts）を最新状態にする
    setPosts([newPost, ...posts]);

    // 入力欄を空にする　上でのsetPostで更新したため
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
          value={name} // 入力欄の値をstateと連動させる reactコンポーネントは見た目(UI)をstateで管理しているため　更新しなくても勝手に変わる仕組みの元
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
          <div key={post.id} className="post">  {/*key は Reactがどの要素が変わったかを判断するための識別子 これがあると、表示の差分更新が高速になります*/}
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
