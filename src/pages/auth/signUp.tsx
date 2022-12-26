import { useSession } from "next-auth/react";
import { Layout } from "../../elements/Layout";

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RoleKind } from ".prisma/client";
import { trpc } from "../../lib/trpc";
import { useRouter } from "next/router";
import { RECRUIT_WEBSITE } from "../../../constants";

type SignUpFormValues = {
  crowdId: string;
  password: string;
};

const SignUp = () => {
  const { data: session } = useSession();

  const mutation = trpc.users.create.useMutation();
  const { register, handleSubmit } = useForm<SignUpFormValues>();
  const router = useRouter();

  const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
    try {
      mutation.mutate({
        crowdId: data.crowdId,
        password: data.password,
        roleKind: RoleKind.WORKER,
      });
      if (confirm("ユーザー登録が完了しました．ログイン画面に遷移します．")) {
        router.push("/api/auth/signin");
      }
    } catch {
      alert("予期せぬエラーが発生しました");
      return;
    }
  };

  if (session) {
    router.push("/");
    return <p>ログインしているため，リダイレクトします</p>;
  }

  return (
    <div className="container mx-auto prose">
      <h2 className="font-bold text-2xl">ユーザー登録</h2>
      <div>
        {RECRUIT_WEBSITE.name}の{RECRUIT_WEBSITE.identifier}
        が分からない方は，下記のリンクを参照してご入力ください．
        <br />
        {RECRUIT_WEBSITE.name === "ランサーズ" ? (
          <a
            href="https://www.lancers.jp/faq/A1021/487"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600"
          >
            ランサーズ - ユーザー名はどこで確認できますか？
          </a>
        ) : (
          <a
            href="https://crowdworks.secure.force.com/faq/articles/FAQ/10461/?q=%E8%A1%A8%E7%A4%BA%E5%90%8D&l=ja&fs=Search&pn=1&id=kA0100000009298&url=10461"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600"
          >
            クラウドワークス - 【共通】自分のID（URL）の確認方法について
          </a>
        )}
      </div>
      <p>
        どちらの項目も，ブラウザへ記憶する，もしくは覚えていただく必要があります．
      </p>

      <div className="mt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control mx-auto gap-y-4">
            <input
              type="text"
              placeholder={`${RECRUIT_WEBSITE.name}の${RECRUIT_WEBSITE.identifier}`}
              className="input input-bordered w-full"
              {...register("crowdId", { required: true, maxLength: 80 })}
            />
            <input
              type="password"
              placeholder="パスワード"
              className="input input-bordered w-full"
              {...register("password", { required: true, maxLength: 80 })}
            />
            <button type="submit" className="btn">
              登録する
            </button>
          </div>
        </form>
        <div className="mt-2">
          登録後，サインイン画面へ遷移します．同じ情報を再度ご入力ください．
          入力が完了したら「Sign in with
          Credentials」ボタンを押して，ログインしてください．
        </div>
      </div>
    </div>
  );
};

SignUp.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
export default SignUp;
