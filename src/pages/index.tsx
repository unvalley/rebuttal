import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { Layout } from "../elements/Layout";

const Index = () => {
  const files = [
    "/",
    "====[workers]=====",
    "/workers/documents/1",
    "/workers/tasks",
    "====[writers]=====",
    "/writers/documents/1",
    "/writers/tasks",
    "====[help]=====",
    "/help",
    "====[auth]=====",
    "/auth/signUp",
  ];
  const { data: session } = useSession();

  return (
    <div className="m-4">
      <div className="mt-4">
        <h2 className="font-bold text-2xl">トップページ</h2>
        <h3 className="font-bold text-xl">実験の説明</h3>
        <p>これは実験用サイトです。ここに説明を書きます。</p>
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
            <button className="btn" onClick={() => signOut()}>
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <div className="mt-4">
              タスクの実施には、サインイン（ログイン）が必要です。
              下記のボタンを押すと、サインインページに移動します。
            </div>
            <button className="btn" onClick={() => signIn()}>
              Sign In
            </button>
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
