import Link from "next/link";

const Done = () => {
  return (
    <div className="container mx-auto prose my-8">
      <h2>評価タスクを終了しました</h2>
      <p>以下のボタンでタスクトップページヘ戻ります．</p>
      <Link href={`/teachers/tasks/top`}>
        <button className="btn">タスクトップページへ戻る</button>
      </Link>
    </div>
  );
};

export default Done;
