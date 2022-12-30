import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { RECRUIT_WEBSITE } from "../../constants";
import { Layout } from "../elements/Layout";
import { Alert } from "../elements/Parts/Alert";
import { isMobile } from "react-device-detect";
import { useState, useEffect } from "react";

const Index = () => {
  const { data: session } = useSession();

  const router = useRouter();
  const signUp = () => {
    router.push("/auth/signUp");
  };

  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setMobile(true);
    }
  }, []);

  if (mobile) {
    return (
      <div className="container">
        <p className="my-8 font-weight text-2xl">
          本ウェブサイトの利用には，ブラウザ版GoogleChromeを使っていただくよう，ご協力お願いいたします．
        </p>
      </div>
    );
  }

  return (
    <article className="container mx-auto prose">
      <h2 className="font-bold text-2xl">タスクの全体説明</h2>
      <p>
        本ウェブサイトは，{RECRUIT_WEBSITE.name}
        にて掲載している文書への評価タスクを行うためのサイトです．
      </p>
      <p>
        タスクを開始するにあたって「{RECRUIT_WEBSITE.name}の
        {RECRUIT_WEBSITE.identifier}
        」と「仮のパスワード（使い捨てで構いません）」を登録していただく必要があります．
        この登録は，本サイトで行ったタスクと{RECRUIT_WEBSITE.name}
        でのタスクを紐付け，報酬支払いを行うために必要となります．
      </p>
      <div className="">
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
        <Alert
          message={`${session.user.crowdId}としてログインが完了しました．下記の「タスクの説明へ」ボタンをクリックして，タスクを開始してください．`}
          alertClass="alert-success"
        />
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
    </article>
  );
};

Index.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
