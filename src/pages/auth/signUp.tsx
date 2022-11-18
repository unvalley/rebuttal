import { useSession } from "next-auth/react";
import { Layout } from "../../elements/Layout";

import React from "react";
import { useForm } from "react-hook-form";
import { RoleKind } from ".prisma/client";

const SignUp = () => {
  const { session } = useSession();

  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    // trpcでuser登録 & ログイン
    console.log(data);
  };

  if (session) {
    return <p>ログインしてるのでredirect</p>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-2xl">SignUp</h2>
      <div className="text-xl">会員登録</div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control container mx-auto gap-y-4">
          <input
            type="text"
            placeholder="CrowdId"
            className="input input-bordered w-full max-w-xs"
            {...register("CrowdId", { required: true, maxLength: 80 })}
          />
          <input
            type="password"
            placeholder="password"
            className="input input-bordered w-full max-w-xs"
            {...register("CrowdId", { required: true, maxLength: 80 })}
          />
          <select
            className="select select-bordered w-full max-w-xs"
            {...register("Role", { required: true })}
          >
            <option value={RoleKind.WORKER} selected>
              ワーカー
            </option>
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
