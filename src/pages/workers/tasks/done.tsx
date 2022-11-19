import { useEffect } from "react";
import { Layout } from "../../../elements/Layout";

const TasksDone = () => {
  // アサインされているタスクが完了しているか確認
  // 完了していなければアクセスを禁止
  // 完了していれば，タスクアサインを全て外す
  useEffect(() => {}, []);

  return (
    <div>
      <h2 className="font-bold text-2xl">タスク終了ページ</h2>
      <div className="text-xl">タスクを終了しました</div>
    </div>
  );
};

TasksDone.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
export default TasksDone;
