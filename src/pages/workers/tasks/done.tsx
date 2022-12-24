import { useSession } from "next-auth/react";
import { RECRUIT_WEBSITE } from "../../../../constants";
import { Layout } from "../../../elements/Layout";

const TasksDone = () => {
  const { data: session } = useSession();

  const userId = session?.user.id;
  const enqueteUrl = `https://docs.google.com/forms/d/e/1FAIpQLSc2MyxLRUUtyh1Ig8_4hRlXPngHsUJS-kQH02RPo5NGQzBWEw/viewform?usp=pp_url&entry.704465899=${userId}`;

  return (
    <div className="container mx-auto prose">
      <h2 className="font-bold text-2xl">評価タスク終了ページ</h2>
      <div>
        <progress className="progress progress-success" value={1} max={1} />
        <p className="mt-4">
          お疲れさまでした．評価タスクを終了しました．
          最後にアンケートの実施をお願いいたします．下のリンクをクリックすると，アンケート画面へ遷移します．
        </p>
        <a href={enqueteUrl} target="_blank" rel="noreferrer">
          アンケートページへのリンク
        </a>
        <p>
          アンケート回答終了後，報酬受け取りのための完了コードが表示されます．
          表示された完了コードを，{RECRUIT_WEBSITE.name}にてご提示ください．
        </p>
      </div>
    </div>
  );
};

TasksDone.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
export default TasksDone;
