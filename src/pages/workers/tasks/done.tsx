import { RECRUIT_WEBSITE } from "../../../../constants";
import { Layout } from "../../../elements/Layout";

const TasksDone = () => {
  return (
    <div className="container mx-auto prose">
      <h2 className="font-bold text-2xl">フィードバックタスク終了ページ</h2>
      <div>
        <progress className="progress progress-success" value={1} max={1} />
        <p className="mt-4">
          お疲れさまでした．フィードバックタスクを終了しました．
          最後にアンケートの実施をお願いいたします．下のリンクをクリックすると，アンケート画面へ遷移します．
        </p>
        <a href="https://google.com">https://google.com</a>
        <p>
          アンケート回答終了後，報酬受け取りのための完了コードが表示されます．
          表示された完了コードを，{RECRUIT_WEBSITE}にてご提示ください．
        </p>
      </div>
    </div>
  );
};

TasksDone.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
export default TasksDone;
