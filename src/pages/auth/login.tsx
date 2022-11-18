// import { z } from 'zod'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useRouter } from "next/router";
import { Layout } from "../../elements/Layout";
import { signIn, signOut, useSession } from "next-auth/react";

// const schema = z
//   .object({
//     name: z.string().min(1, { message: 'Required' }),
//     password: z.string(),
//   })
//   .transform((x) => {
//     return {
//       ...x,
//     }
// })

// interface FormInputs {
//   name: string
//   password: string
// }

const Login = () => {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <button onClick={() => signOut()}>Log out</button>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </div>
  );

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<FormInputs>({ resolver: zodResolver(schema) })
  // const router = useRouter()

  // const onSubmit = async (data: FormInputs) => {
  //   const res = await fetch('/api/tasks', {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //   })

  //   if (res.ok)
  //     router.push('')
  //   else
  //     alert(JSON.stringify('エラー'))
  // }

  // return (
  //   <div className="">
  //     <div className="card card-bordered w-96 bg-base-100 shadow-sm items-center justify-center mx-auto">
  //       <div className="card-body">
  //         <div className="mb-2">
  //           <h2 className="card-title text-xl font-bold">ログイン</h2>
  //         </div>
  //         <form
  //           className="space-y-4 md:space-y-6"
  //           onSubmit={handleSubmit(onSubmit)}
  //         >
  //           <div>
  //             <label className="label">
  //               <span className="label-text">ユーザー名</span>
  //             </label>
  //             <input
  //               type="text"
  //               required
  //               placeholder="ユーザー名"
  //               className="input input-bordered w-full"
  //               {...register('name')}
  //             />
  //           </div>
  //           {errors.name?.message && <p>エラー</p>}
  //           <div>
  //             <label className="label">
  //               <span className="label-text">パスワード</span>
  //             </label>
  //             <input
  //               type="password"
  //               required
  //               placeholder="パスワード"
  //               className="input input-bordered w-full"
  //               {...register('password')}
  //             />
  //             {errors.password?.message && <p>エラー</p>}
  //           </div>
  //           <button type="submit" className="btn w-full">
  //             ログイン
  //           </button>
  //         </form>
  //       </div>
  //     </div>
  //   </div>
};

Login.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Login;
