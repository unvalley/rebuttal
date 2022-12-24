import Link from "next/link";
import { Layout } from "../../../elements/Layout";
import { useSession } from "next-auth/react";
import { trpc } from "../../../lib/trpc";
import { ScreenLoading } from "../../../elements/Parts/Loading";
import { RECRUIT_WEBSITE } from "../../../../constants";
import { existsTaksToWork } from "../../../utils";

const Introduction = () => {
  const { data: session } = useSession();
  const microtasksQuery = trpc.microtasks.findMicrotasksToAssign.useQuery(
    {
      userId: session?.user.id as number,
      assignCount: 3,
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  if (microtasksQuery.isError) {
    return (
      <article className="container mxa-auto prose">
        <h2>実行対象のタスクがありません．</h2>
        <p>全てのタスクが実施完了されました．大変申し訳ございません．</p>
      </article>
    );
  }

  if (microtasksQuery.isLoading) {
    return <ScreenLoading />;
  }

  const { data: assignedMicrotasks } = microtasksQuery;

  if (!existsTaksToWork(assignedMicrotasks)) {
    return (
      <article className="container mxa-auto prose">
        <h2>実行対象のタスクがありません．</h2>
        <p>全てのタスクが実施完了されました．大変申し訳ございません．</p>
        <p>{RECRUIT_WEBSITE.name}にてタスクを閉じる予定です．</p>
      </article>
    );
  }

  return (
    <article className="container mx-auto prose">
      <h2 className="font-bold text-2xl">実施いただくタスクの説明</h2>
      <p>
        このページでは実施していただくタスクについて説明します．内容を一読してからタスクに望んでいただくよう，ご協力お願いいたします．タスク全体の所要時間は10分程度を想定しています．
      </p>
      <p>以下の2つのタスクを実施していただきます．</p>
      <ul>
        <li>文章評価タスクの実施（実施件数はランダム）</li>
        <li>文章評価タスクに関するアンケートの実施（Google Formでの回答）</li>
      </ul>
      <p>それぞれについて説明いたします．</p>

      <h3 className="font-bold text-xl">文章評価タスク</h3>
      <p>
        この調査では，あるレポートから切り出した文章への評価（文章評価タスク）を行っていただきます．
        文章評価タスクには，以下の3つの種類があります．
      </p>
      <ol>
        <li>ある文が，意見か事実か区別するタスク（選択解答）</li>
        <li>
          ある文に書かれた事実に，根拠が付与されているかどうか確認するタスク（選択解答）
        </li>
        <li>
          ある文に書かれた意見に対して，その意見を支える根拠となる事実情報が文の前後に書かれているか確認するタスク（選択解答
          + 記述回答）
        </li>
      </ol>
      <p>
        本ページ下部にある「タスクを開始する」ボタンをクリックすると，上記のうちのいずれか，または複数種類のタスクが割り振られます．
        実施するタスクの種類と件数を選ぶことはできません．
      </p>
      <p>割り当てられたすべての文章評価タスクを完了してください．</p>

      <h3 className="font-bold text-xl">
        文章評価タスクに関するアンケート回答
      </h3>
      <p>
        本ウェブサイトで，文章評価タスクを実施いただいた後に，文章評価タスクに関するアンケートにご回答いただきます．アンケートはGoogle
        Formで作成されています．
      </p>
      <p>
        割り振られたすべての文章評価タスクの実施後，タスク終了ページへ画面が遷移し，そこでアンケートページへのリンクが表示されます．タスク終了ページの案内に沿って，アンケート回答ページへ遷移し，アンケート回答を行ってください．
      </p>
      <p>
        アンケート回答終了後，報酬受け取りのための完了コードが表示されます．
      </p>

      <h3 className="font-bold text-xl">タスク開始前の注意事項</h3>
      <ul>
        <li>
          「タスクを開始する」ボタンをクリックすると，いくつかのタスクが割り振られます．
        </li>
        <li>タスクの制限時間はありません．</li>
        <li>
          タスクを早く終わらせるために，適当に実施することはご遠慮ください．
        </li>
      </ul>

      <Link href="/workers/tasks">
        <button className="btn btn-primary">タスクを開始する</button>
      </Link>
    </article>
  );
};

Introduction.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Introduction;
