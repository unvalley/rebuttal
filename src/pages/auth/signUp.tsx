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
  roleKind: RoleKind;
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
        roleKind: data.roleKind,
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
    return <p>ログインしてるのでredirect</p>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-2xl">SignUp</h2>
      <div className="text-xl">ユーザー登録</div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control container mx-auto gap-y-4">
          <input
            type="text"
            placeholder="CrowdId"
            className="input input-bordered w-full max-w-xs"
            {...register("crowdId", { required: true, maxLength: 80 })}
          />
          <input
            type="password"
            placeholder="password"
            className="input input-bordered w-full max-w-xs"
            {...register("password", { required: true, maxLength: 80 })}
          />
          <select
            className="select select-bordered w-full max-w-xs"
            {...register("roleKind", { required: true })}
          >
            <option value={RoleKind.WORKER}>ワーカー</option>
            <option value={RoleKind.WRITER}>ライター</option>
          </select>
          <button type="submit" className="btn max-w-xs">
            登録
          </button>
        </div>
      </form>
    </div>
  );
};

SignUp.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
export default SignUp;