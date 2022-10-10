export const Rebuttal = () => {
  return (
    <div className="">
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
            <div className="flex-none">
              <div className="card-title">Satoshi</div>
              <span>2022/11/20 10:29</span>
              <div className="line-clamp-3">aaa</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
