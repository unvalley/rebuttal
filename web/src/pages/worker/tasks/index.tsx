import { useRouter } from 'next/router'
import { Layout } from '../../../elements/Layout'

const Tasks = () => {
  // 候補: 賛成反対
  const data = [
    {
      id: '1',
      name: 'Mike',
      title: 'Web3',
      progress: [
        {
          title: '文書内容を理解するためのログ',
          percentage: 20
        },
        {
          title: '主張と根拠のつながりの特定',
          percentage: 40
        },
        {
          title: '反論の生成',
          percentage: 80
        },
        {
          title: '反論の推敲',
          percentage: 50
        }
      ],
      agreement: true
    },
    {
      id: '2',
      name: 'Satoshi',
      title: 'NFT',
      progress: [
        {
          title: '文書内容を理解するためのログ',
          percentage: 20
        },
        {
          title: '主張と根拠のつながりの特定',
          percentage: 20
        },
        {
          title: '反論の生成',
          percentage: 20
        },
        {
          title: '反論の推敲',
          percentage: 20
        }
      ],
      agreement: false
    },
    {
      id: '3',
      name: 'John',
      title: 'Web3',
      progress: [
        {
          title: '文書内容を理解するためのログ',
          percentage: 20
        },
        {
          title: '主張と根拠のつながりの特定',
          percentage: 20
        },
        {
          title: '反論の生成',
          percentage: 20
        },
        {
          title: '反論の推敲',
          percentage: 20
        }
      ],
      agreement: false
    }
  ]

  const router = useRouter()

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">Tasks</h2>

      {/* FEATURE: Stream (https://www.pinterest.jp/pin/608760074652174474/?nic_v3=1a5XeqvRz) */}
      <div className="py-4">
        <table className="table w-full">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>執筆ユーザー名</th>
              <th>タイトル</th>
              <th>更新日時</th>
              <th>進捗</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => {
              return (
                <tr key={d.id}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={`https://ui-avatars.com/api/?name=${d.name}`}
                            alt="User Avatar"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{d.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {d.title}
                    <br />
                    <span className="badge badge-ghost badge-sm">
                      {'補足情報を色々と書く'}
                    </span>
                  </td>
                  <td>
                    <span>2020/02/20 19:00:00</span>
                  </td>
                  <td>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn m-1">
                        執筆の進捗状況
                      </label>
                      <div
                        tabIndex={0}
                        className="dropdown-content card card-compact p-2 shadow bg-neutral text-primary-content"
                      >
                        <div className="card-body">
                          <h3 className="card-title">タスク進捗状況</h3>
                          {d.progress.map((e) => (
                            <div key={e.title}>
                              <span className="mr-2">{e.title}</span>
                              <progress
                                className="progress progress-success w-56"
                                value={e.percentage}
                                max="100"
                              />
                              <span>{e.percentage} / 100</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <th>
                    <button
                      className="btn btn-ghost btn-xl"
                      onClick={() => router.push(`/writer/documents/${d.id}`)}
                    >
                      開く
                    </button>
                  </th>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

Tasks.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Tasks
