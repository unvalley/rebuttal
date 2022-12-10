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
    <div className="m-4">
      <div className="mt-4">
        <h2 className="font-bold text-2xl">トップページ</h2>
        <article className="mt-4">
          <p>
            本ウェブサイトは，{RECRUIT_WEBSITE}
            にて掲載している文書へのフィードバックタスクを行うためのサイトです．
            <br />
            本タスクは，静岡大学情報学部で行っている文書編集に関するユーザ実験のために実施しています．
          </p>
          <p>
            タスクを開始するにあたって「{RECRUIT_WEBSITE}
            ID（ユーザ名）」と仮のパスワードを登録していただく必要があります．
            <br />
            この登録は，本サイトで行ったタスクとランサーズでのタスクを紐付け，報酬支払いを行うために必要となります．
          </p>
          <p>
            なお本タスクでは，タスク中のウェブ文章編集・閲覧行動を記録させていただきます．
            <br />
            記録したログ情報は匿名化されており，学術研究活動以外の目的で使用することはありません．
          </p>
          <div className="mt-4">
            {session ? (
              <p className="font-bold text-lg">
                ログインが完了しました。
                下記の「タスクを開始する」ボタンをクリックして、タスクを開始してください。
              </p>
            ) : (
              <>
                <p className="font-bold text-lg">
                  以上に同意していただける方は、「ユーザ登録」ボタンからユーザ登録を行い、その後ログインを行ってください。
                  （ユーザ登録後、ログイン用画面へ遷移します。そこで、ユーザ登録時の情報を入力してください。）
                </p>
                <p className="font-bold text-lg">
                  ユーザ登録を行い、ログインが完了すると、「タスクの説明へ」と書かれたボタンがクリック可能になります。
                  ユーザ登録とログインの完了後、「タスクの説明へ」ボタンをクリックして、タスクを開始してください。
                </p>
              </>
            )}
          </div>
          {session?.user && (
            <div className="mt-4">
              {session.user.crowdId}としてログイン中です。 役割は、
              {session.user.roleKind}です。
            </div>
          )}
        </article>
      </div>
      <div className="mt-4">
        {session ? (
          <div>
            <div className="mt-4">
              <button className="btn" onClick={() => signOut()}>
                ログアウト
              </button>
              <Link href="/workers/tasks/introduction">
                <button className="btn btn-primary ml-4">タスクの説明へ</button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex gap-x-4">
              <button className="btn mt-4" onClick={() => signIn()}>
                ログイン
              </button>
              <button
                className="btn btn-secondary mt-4"
                onClick={() => signUp()}
              >
                ユーザ登録
              </button>
            </div>
            <div className="mt-4">
              ログインには、「ランサーズのアカウント名」「4文字以上のパスワード（ランサーズに登録しているパスワードではなく、本実験用サイトに登録する新しいパスワード）」の入力が必要となります。
            </div>
          </div>
        )}
      </div>
      {process.env.NODE_ENV === "development" && (
        <ul className="mt-14">
          {files.map((file) => (
            <li key={file}>
              <Link href={file}>
                <a className="btn btn-ghost normal-case text-xl">{file}</a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

Index.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
