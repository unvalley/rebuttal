import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "../elements/Layout";

const Index = () => {
  const files = [
    "/",
    "/workers/documents/1",
    "/workers/tasks",
    "/writers/documents/1",
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
            にて掲載している文章編集タスクを行うためのサイトです．
            <br />
            本タスクは，静岡大学情報学部で行っている文章編集に関するユーザ実験のために実施しています．
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
          {!session && (
            <p className="font-weight-bold">
              以上に同意していただける方のみ，下記SIGN
              UPボタンをクリックしてユーザ登録を行い，タスクを開始してください．
            </p>
          )}
        </article>
      </div>
      <div className="mt-4">
        {session ? (
          <div>
            {session.user && (
              <div>
                {session.user.crowdId}としてサインイン中です。 役割は、
                {session.user.roleKind}です。
              </div>
            )}
            <div className="mt-4">
              <button className="btn" onClick={() => signOut()}>
                Sign Out
              </button>
              <Link href="/workers/tasks">
                <button className="btn btn-primary ml-4">タスクへ</button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mt-4">
              タスクの実施には、サインアップおよびサインインが必要です。
              アカウントを登録済みでない方はサインアップから開始してください．
            </div>
            <div className="flex gap-x-4">
              <button className="btn mt-4" onClick={() => signIn()}>
                Sign In
              </button>
              <button
                className="btn btn-secondary mt-4"
                onClick={() => signUp()}
              >
                Sign Up
              </button>
            </div>
            <div className="mt-4">
              サインインには、「ランサーズのアカウント名」「4文字以上のパスワード（ランサーズに登録しているパスワードではなく、本実験用サイトに登録する新しいパスワード）」の入力が必要となります。
            </div>
          </div>
        )}
      </div>
      {process.env.NODE_ENV === "development" && (
        <ul className="mt-14">
          {files.map((file) => {
            return (
              <li key={file}>
                <Link href={file}>
                  <a className="btn btn-ghost normal-case text-xl">{file}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

Index.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
