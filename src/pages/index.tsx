import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "../elements/Layout";

const Index = () => {
  const files = [
    "/",
    "/documents/1",
    "/workers/tasks",
    "/writers/tasks",
    "/help",
    "/auth/signUp",
  ];
  const { data: session } = useSession();

  const router = useRouter();
  const signUp = () => {
    router.push("/auth/signUp");
  };

  const RECRUIT_WEBSITE = "ランサーズ";
  return (
    <article className="container mx-auto prose">
      <h2 className="font-bold text-2xl">調査の全体説明</h2>

      <p>
        本ウェブサイトは，{RECRUIT_WEBSITE}
        にて掲載している文書へのフィードバックタスクを行うためのサイトです．
        本タスクは，静岡大学情報学部で行っている文書編集に関するユーザ実験のために実施しています．
      </p>
      <p>
        タスクを開始するにあたって「{RECRUIT_WEBSITE}
        ID（ユーザ名）」と仮のパスワードを登録していただく必要があります．
        この登録は，本サイトで行ったタスクとランサーズでのタスクを紐付け，報酬支払いを行うために必要となります．
      </p>
      <p>
        本タスクでは，タスク中の文章改善フィードバックの結果を記録させていただきます．
        <br />
        記録した情報は匿名化され，学術研究活動以外の目的で使用することはありません．
      </p>
      <div className="">
        以上に同意していただける方は，以下の手順でユーザ登録およびログインを行ってください．
        ログインには、「ランサーズのアカウント名」「4文字以上のパスワード（ランサーズに登録しているパスワードではなく、本実験用サイトに登録する新しいパスワード）」の入力が必要となります。
        <ol>
          <li>
            「ユーザ登録」ボタンからユーザ登録を行う（登録後，自動でログインページに遷移します）
          </li>
          <li>
            ログイン用ページにて，登録したユーザ情報を入力してログインする（ログイン後，自動でトップページに遷移します）
          </li>
          <li>
            トップページに，「タスクの説明へ」と書かれたボタンが表示されるのでクリックする
          </li>
          <li>説明ページの内容に従い，タスクを開始する</li>
        </ol>
      </div>
      {session && (
        <div className="alert alert-success shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {session.user.crowdId}
              としてログインが完了しました．下記の「タスクの説明へ」ボタンをクリックして，タスクを開始してください．
            </span>
          </div>
        </div>
      )}
      <div className="mt-4">
        {session ? (
          <div className="mt-4">
            <button className="btn" onClick={() => signOut()}>
              ログアウト
            </button>
            <Link href="/workers/tasks/introduction">
              <button className="btn btn-primary ml-4">タスクの説明へ</button>
            </Link>
          </div>
        ) : (
          <div className="flex gap-x-4">
            <button className="btn mt-4" onClick={() => signIn()}>
              ログイン
            </button>
            <button className="btn btn-secondary mt-4" onClick={() => signUp()}>
              ユーザ登録
            </button>
          </div>
        )}
      </div>
      {process.env.NODE_ENV === "development" && (
        <ul className="mt-2">
          {files.map((file) => (
            <li key={file}>
              <Link href={file}>
                <a className="btn btn-ghost normal-case text-xl">{file}</a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};

Index.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
