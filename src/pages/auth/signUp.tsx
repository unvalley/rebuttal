import { useSession } from "next-auth/react";
import { Layout } from "../../elements/Layout";

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RoleKind } from ".prisma/client";
import { trpc } from "../../lib/trpc";
import { useRouter } from "next/router";

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
    return <p>ログインしているため、リダイレクトします</p>;
  }

  return (
    <div className="container mx-auto">
      <div className="">
        <h2 className="font-bold text-2xl">ユーザー登録</h2>
        <p>
          クラウドソーシングサイトのIDには、利用しているクラウドソーシングのIDを入力してください。
        </p>
        <p>
          クラウドソーシングサイトのIDとパスワードは、登録後、再度サインインのために入力していただきます。
        </p>
        <p>
          どちらの項目も、ブラウザへ記憶する、もしくは覚えていただく必要があります。
        </p>
      </div>

      <div className="mt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control mx-auto gap-y-4">
            <input
              type="text"
              placeholder="クラウドソーシングサイトのID"
              className="input input-bordered w-full max-w-md"
              {...register("crowdId", { required: true, maxLength: 80 })}
            />
            <input
              type="password"
              placeholder="パスワード"
              className="input input-bordered w-full max-w-md"
              {...register("password", { required: true, maxLength: 80 })}
            />
            <button type="submit" className="btn max-w-md">
              登録する
            </button>
          </div>
        </form>
        <div className="mt-2">
          登録後、サインイン画面へ遷移します。同じ情報を再度ご入力ください。
        </div>
      </div>
    </div>
  );
};

SignUp.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
export default SignUp;
