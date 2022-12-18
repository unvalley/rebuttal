import Link from "next/link";
import { Layout } from "../../../elements/Layout";

const Introduction = () => {
  return (
    <article className="container mx-auto prose">
      <h2 className="font-bold text-2xl">実施いただくタスクの説明</h2>
      <p>
        このページでは実施していただくタスクについて説明します．内容を一読してからタスクに望んでいただくよう，ご協力お願いいたします．タスク全体の所要時間は10分程度を想定しています．
      </p>
      <p>以下の2つのタスクを実施していただきます．</p>
      <ul>
        <li>文章フィードバックタスクの実施（実施件数はランダム）</li>
        <li>
          文章フィードバックタスクに関するアンケートの実施（Google
          Formでの回答）
        </li>
      </ul>
      <p>それぞれについて説明いたします．</p>

      <h3 className="font-bold text-xl">文章フィードバックタスク</h3>
      <p>
        この調査では，文章フィードバックに関するタスク（文章フィードバックタスク）を行っていただきます．
        文章フィードバックタスクには，以下の3つの種類があります．
      </p>
      <ol>
        <li>ある文が，意見か事実か区別するタスク</li>
        <li>
          ある事実文に書かれた事実に，文献情報が付与されているかどうか確認するタスク
        </li>
        <li>
          ある意見文に書かれた意見に対して，その意見を支える根拠となる事実情報が文の前後に書かれているか確認するタスク
        </li>
      </ol>
      <p>
        本ページ下部にある「タスクを開始する」ボタンをクリックすると，上記のうちのどれか，もしくは複数のタスクが割り振られます．
      </p>
      <p>
        文章フィードバックタスク（1）/
        （2）は，選択回答になります．文章フィードバックタスク（3）は選択および記述式回答になります．
      </p>
      <p>
        参加者によって，割り振られるタスクの件数と種類は異なります．割り振りの例として，以下のようなケースがあげられます．
      </p>
      <ul>
        <li>ケース1：文章フィードバックタスク（1）が8件割り振られる</li>
        <li>ケース2：文章フィードバックタスク（2）が6件割り振られる</li>
        <li>
          ケース3：文章フィードバックタスク（2）が2件，文章フィードバックタスク（3）が3件割り振られる
        </li>
      </ul>
      <p>
        実施するタスクの種類と件数を選ぶことはできません．割り当てられたすべての文章フィードバックタスクを完了してください．
      </p>
      {/* <h3 className="font-bold text-xl">タスク実施ページの使い方</h3>
      <ul>
        <li></li>
      </ul> */}
      <h3 className="font-bold text-xl">
        文章フィードバックタスクに関するアンケート回答
      </h3>
      <p>
        本ウェブサイトで，文章フィードバックタスクを実施いただいた後に，文章フィードバックタスクに関するアンケートにご回答いただきます．アンケートはGoogle
        Formで作成されています．
      </p>
      <p>
        割り振られたすべての文章フィードバックタスクの実施後，タスク終了ページへ画面が遷移し，そこでアンケートページへのリンクが表示されます．タスク終了ページの案内に沿って，アンケート回答ページへ遷移し，アンケート回答を行ってください．
      </p>
      <p>
        アンケート回答終了後，報酬受け取りのための完了コードが表示されます．
      </p>

      <h3 className="font-bold text-xl">開始しましょう</h3>
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
