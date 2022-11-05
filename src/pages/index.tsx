import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { Layout } from "../elements/Layout";

const Index = () => {
  const files = [
    "/",
    "/workers/documents/1",
    "/workers/tasks",
    "/writers/documents/1",
    "/writers/tasks/1",
    "/help",
    "/auth/login",
  ];
  const { data: session } = useSession();

  return (
    <div>
      <div className="m-4">
        {session ? (
          <div>
            {session.user && (
              <div>{session.user.name}としてサインイン中です。</div>
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
            <button className="btn mt-4" onClick={() => signIn()}>
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
