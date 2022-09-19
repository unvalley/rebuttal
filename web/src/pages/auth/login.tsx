import { Layout } from '../../elements/Layout'

const Login = () => {
  return (
    <div className="">
      <div className="card card-bordered w-96 bg-base-100 shadow-sm items-center justify-center mx-auto">
        <div className="card-body">
          <div className="mb-2">
            <h2 className="card-title text-xl font-bold">ログイン</h2>
          </div>
          <form className="space-y-4 md:space-y-6">
            <div>
              <label className="label">
                <span className="label-text">ユーザー名</span>
              </label>
              <input
                type="text"
                required
                placeholder="ユーザー名"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">パスワード</span>
              </label>
              <input
                type="password"
                required
                placeholder="パスワード"
                className="input input-bordered w-full"
              />
            </div>
            <button type="submit" className="btn w-full">
              ログイン
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

Login.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Login
