import { useEffect } from "react";
import { Layout } from "../../../elements/Layout";

const COMPELTED_CODE = "JRI4HSJI$#";

const TasksDone = () => {
  // アサインされているタスクが完了しているか確認
  // 完了していなければアクセスを禁止
  // 完了していれば，タスクアサインを全て外す
  useEffect(() => {}, []);

  return (
    <div className="container m-4">
      <h2 className="font-bold text-2xl">タスク終了ページ</h2>
      <div>
        <p className="">お疲れさまでした．タスクを終了しました．</p>
        <p className="mt-4">
          最後にアンケートの実施をお願いいたします．下のリンクをクリックすると，アンケート画面へ遷移します．．
        </p>
        <a href="https://google.com">https://google.com</a>
        {/* <p>
          完了コードは
          <span className="text-xl">「{COMPELTED_CODE}」</span>
          です．
        </p> */}
      </div>
      <div className="mt-4">
        <p className="">
          TODO:
          マイクロタスクが残っていれば，実験に再度参加できることを伝える．残っていなければ案内なし．
        </p>
      </div>
    </div>
  );
};

TasksDone.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
export default TasksDone;
