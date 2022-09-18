import { Layout } from '../../../elements/Layout'

const Documents = () => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">Documents</h2>
      <div className="columns-2 gap-4">
        <div>
          <div className="card bg-base-100 shadow-xs">
            <div className="card-body">
              <h2 className="card-title">Title</h2>
              <p>
                If a dog chews shoes whose shoes does he choose? If a dog chews
                shoes whose shoes does he choose?If a dog chews shoes whose
                shoes does he choose?If a dog chews shoes whose shoes does he
                choose?If a dog chews shoes whose shoes does he choose?If a dog
                chews shoes whose shoes does he choose?If a dog chews shoes
                whose shoes does he choose?If a dog chews shoes whose shoes does
                he choose?If a dog chews shoes whose shoes does he choose? If a
                dog chews shoes whose shoes does he choose? If a dog chews shoes
                whose shoes does he choose?If a dog chews shoes whose shoes does
                he choose?If a dog chews shoes whose shoes does he choose?If a
                dog chews shoes whose shoes does he choose?If a dog chews shoes
                whose shoes does he choose?If a dog chews shoes whose shoes does
                he choose?If a dog chews shoes whose shoes does he choose?If a
                dog chews shoes whose shoes does he choose? If a dog chews shoes
                whose shoes does he choose? If a dog chews shoes whose shoes
                does he choose?If a dog chews shoes whose shoes does he
                choose?If a dog chews shoes whose shoes does he choose?If a dog
                chews shoes whose shoes does he choose?If a dog chews shoes
                whose shoes does he choose?If a dog chews shoes whose shoes does
                he choose?If a dog chews shoes whose shoes does he choose?If a
                dog chews shoes whose shoes does he choose?
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="tabs tabs-boxed">
            <a className="tab">分析</a>
            <a className="tab tab-active">反論</a>
            <a className="tab">情報</a>
            <a className="tab">AI支援</a>
          </div>
          {/* 内容 */}
          <div>
            {/* 進捗状況 */}
            <div className="py-4">
              <div className="">
                <span className="mr-2">反論の進捗率</span>
                <progress
                  className="progress progress-success w-56 mr-2"
                  value={20}
                  max="100"
                />
                <span>{30} / 100</span>
              </div>
              {/* メッセージ */}
              <p>反論の数が増えると進捗率が上がります</p>
            </div>
            <div className="card w-full bg-base-100 border">
              <div className="card-body">
                <div className="flex flex-row">
                  <div className="flex-none mr-4">
                    <div className="avatar">
                      <div className="w-16 rounded-full">
                        <img src="https://placeimg.com/192/192/people" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-auto">
                    <div className="card-title">Satoshi</div>
                    <span>2022/11/20 10:29</span>
                    <p>ここは論理破綻してます．直したほうがいいです．</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Documents.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Documents
