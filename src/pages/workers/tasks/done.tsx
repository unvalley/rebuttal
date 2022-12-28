import { useSession } from "next-auth/react";
import { RECRUIT_WEBSITE } from "../../../../constants";
import { useBeforeUnload } from "../../../elements/Microtasks/hooks/useBeforeUnload";

const TasksDone = () => {
  const { data: session } = useSession();
  useBeforeUnload(
    "ページを離脱すると，タスク実施は最初からやり直しとなります．本当にページを離脱しますか？"
  );

  const userId = session?.user.id;
  const enqueteUrl = `https://docs.google.com/forms/d/e/1FAIpQLSc2MyxLRUUtyh1Ig8_4hRlXPngHsUJS-kQH02RPo5NGQzBWEw/viewform?usp=pp_url&entry.704465899=${userId}`;

  return (
    <div className="container mx-auto prose my-8">
      <h2 className="font-bold text-2xl">評価タスク終了ページ</h2>
      <div>
        <progress className="progress progress-success" value={1} max={1} />
        <p className="mt-4">
          評価タスクを終了しました． 最後にアンケートの実施をお願いいたします．
          アンケート回答終了後，報酬受け取りのための完了コードが表示されます．
          表示された完了コードを{RECRUIT_WEBSITE.name}
          の作業コード欄に貼り付けてください．
        </p>
        <p>下のリンクをクリックすると，アンケート画面へ遷移します．</p>
        <a
          href={enqueteUrl}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600"
        >
          アンケートページへのリンク
        </a>
        <p>アンケート回答終了後，このページは閉じていただいて構いません．</p>
      </div>
    </div>
  );
};

export default TasksDone;
