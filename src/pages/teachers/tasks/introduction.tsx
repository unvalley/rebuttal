import Link from "next/link";
import { Layout } from "../../../elements/Layout";

const Introduction = () => {
  return (
    <article className="container mx-auto prose">
      <h2 className="font-bold text-2xl">実施いただくタスクの説明</h2>
      <p>
        このページでは実施していただくタスクについて説明します．内容を一読してからタスクに望んでいただくよう，ご協力お願いいたします．タスク全体の所要時間は15分程度を想定しています．
      </p>
      <p>以下の2つのタスクを実施していただきます．</p>
      <ul>
        <li>文章評価タスクの実施</li>
        <li>文章評価タスクに関するアンケートの実施（Google Formでの回答）</li>
      </ul>
      <p>それぞれについて説明いたします．</p>

      <h3 className="font-bold text-xl">文章評価タスク</h3>
      <p>
        この調査では，ある大学生の授業のレポートの「文の評価」（文章評価タスク）を行っていただきます．
        文章評価タスクには，以下の3つの種類があります．
      </p>
      <ol>
        <li>ある文が，意見か事実か区別するタスク（選択解答）</li>
        <li>
          ある文に書かれた事実に対して，根拠となる情報（文献情報）が周囲に書かれているかチェックするタスク（選択解答）
        </li>
        <li>
          ある文に書かれた意見に対して，その意見を支える根拠となる情報が周囲に書かれているかチェックするタスク（選択解答
          + 記述回答）
        </li>
      </ol>
      <p>
        本ページ下部にある「タスクを開始する」ボタンをクリックすると，上記のうちのいずれか，または複数種類のタスクが割り振られます．
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
          「タスクを開始する」ボタンをクリックすると，タスクが開始されます．
        </li>
        <li>タスクの制限時間はありません．</li>
        <li>
          タスクを早く終わらせるために，適当に実施することはご遠慮ください．
        </li>
      </ul>

      <Link href="/teachers/tasks/top">
        <button className="btn btn-primary">タスクを開始する</button>
      </Link>
    </article>
  );
};

Introduction.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Introduction;
