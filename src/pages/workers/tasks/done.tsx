import { Layout } from "../../../elements/Layout";

const TasksDone = () => {
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
