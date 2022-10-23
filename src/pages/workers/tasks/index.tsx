import { Layout } from "../../../elements/Layout";
import { trpc } from "../../../lib/trpc";

const randomMicrotaskId = Math.floor(Math.random() * 3 + 1);

const Tasks = () => {
  const userId = 3;

  const utils = trpc.useContext();
  const microtaskQuery = trpc.microtasks.findByUserId.useQuery({
    userId,
  });

  const assignMicrotask = trpc.microtasks.updateToAssign.useMutation({
    async onSuccess() {
      await utils.microtasks.findByUserId.invalidate({ userId });
    },
  });

  const unassignMicrotask = trpc.microtasks.updateToUnassign.useMutation({
    async onSuccess() {
      await utils.microtasks.findByUserId.invalidate({ userId });
    },
  });

  if (!microtaskQuery.error) {
    <div>指定されたタスクは存在しません</div>;
  }

  const { data } = microtaskQuery;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">Tasks</h2>

      <div className="grid grid-cols-5 gap-2 py-4">
        <div className="col-span-3">
          <div className="card w-full bg-base-100 shadow-md">
            <div className="card-body">
              {data && data.assigneeId ? (
                <div>
                  <div className="card-title text-md">割り当てられたタスク</div>
                  <div className="text-lg">タスク：{data.title}</div>
                  <span>
                    次のパラグラフにおいて，意見と事実の切り分けを行ってください．
                    {data.body && "data.body"}
                  </span>
                  <div className="font-semibold my-4">
                    若年層のSNS利用は制限されるべきである．
                    なぜなら，SNSを利用することによって承認欲求に駆られてしまい，社会的に不健全なことで注目を浴びるようなマネをとる若年層が増加傾向にあるからだ．いわゆる炎上事件が起きてしまった場合，その影響は所属する学校や組織にとどまらず，身内のプライバシーにも影響を与えかねない．SNSを利用するにあたって，この危険性から逃れることは難しい．このような不利点を考慮すると，リスクを犯してSNSを利用して得られる利点は無いといってよいだろう．
                  </div>
                  <div className="text-lg">
                    <span className="bg-green-100 text-green-800">簡単</span>
                    <span className="text-green-700">: 3-5分</span>
                  </div>

                  <div>TODO: タスク実施のためのUI実装</div>
                  <div>TODO: ドキュメント画面へリンクさせるか検討</div>
                  <div>TODO: 該当パラグラフ以外はblurさせれば良い？</div>
                  <div className="card-actions">
                    <button
                      className="btn"
                      onClick={async () => {
                        try {
                          await unassignMicrotask.mutateAsync({
                            id: randomMicrotaskId,
                          });
                        } catch (cause) {
                          console.error(
                            { cause },
                            "Failed to assign microtask"
                          );
                        }
                      }}
                    >
                      割り当てを解除する
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="card-title text-md">
                    タスクがまだ割り当てられていません
                  </div>
                  <p>ボタンを押すと，タスクが割り当てられます．</p>
                  <div className="card-actions">
                    <button
                      className="btn btn-primary"
                      onClick={async () => {
                        try {
                          await assignMicrotask.mutateAsync({
                            id: randomMicrotaskId,
                            assigneeId: userId,
                          });
                        } catch (cause) {
                          console.error(
                            { cause },
                            "Failed to assign microtask"
                          );
                        }
                      }}
                    >
                      割り当てを行う
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="card w-full bg-base-101 shadow-md">
            <div className="card-body">
              <div className="card-title text-xl">あなたの貢献</div>
              <p>これだけの貢献を行いました．</p>
            </div>
          </div>
          <div className="card w-full bg-base-101 shadow-md">
            <div className="card-body">
              <div className="card-title text-xl">ヘルプ</div>
              <ul>
                <li>ヘルプ1</li>
                <li>ヘルプ2</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Tasks.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Tasks;
