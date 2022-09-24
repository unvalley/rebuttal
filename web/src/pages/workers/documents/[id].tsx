import React from 'react'
import {
  type Tab,
  useTabs,
  tabs
} from '../../../elements/Documents/TabContents/useTabs'
import { Layout } from '../../../elements/Layout'
import { trpc } from '../../../lib/trpc'

const styleTabClass = (targetActiveTab: Tab, currentActiveTab: Tab): string => {
  return targetActiveTab === currentActiveTab ? 'tab tab-active' : 'tab'
}

const Documents = () => {
  const { activeTab, setActiveTab, renderTabContents } = useTabs()

  const userId = 1
  const { data } = trpc.useSWR(['users.get', { id: userId }])

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">ドキュメント</h2>
      <div className="grid grid-cols-5 gap-2">
        {/* ドキュメント */}
        <div className="col-span-2">
          <div className="bg-base-100">
            <div className="">
              <h2 className="font-bold">タイトル</h2>
              <p>
                恥の多い生涯を送って来ました。自分には、人間の生活というものが、見当つかないのです。自分は東北の田舎に生れましたので、汽車をはじめて見たのは、よほど大きくなってからでした。自分は停車場のブリッジを、上って、降りて、そうしてそれが線路をまたぎ越えるために造られたものだという事には全然気づかず、ただそれは停車場の構内を外国の遊戯場みたいに、複雑に楽しく、ハイカラにするためにのみ、設備せられてあるものだとばかり思っていました。しかも、かなり永い間そう思っていたのです。ブリッジの上ったり降りたりは、自分にはむしろ、ずいぶん垢抜けのした遊戯で、それは鉄道のサーヴィスの中でも、最も気のきいたサーヴィスの一つだと思っていたのですが、のちにそれはただ旅客が線路をまたぎ越えるための頗る実利的な階段に過ぎないのを発見して、にわかに興が覚めました。また、自分は子供の頃、絵本で地下鉄道というものを見て、これもやは
              </p>
            </div>
          </div>
        </div>
        {/* タブ */}
        <div className="col-span-2">
          <div className="tabs tabs-boxed">
            {tabs.map((tab) => (
              <a
                key={tab}
                className={styleTabClass(tab, activeTab)}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </a>
            ))}
          </div>
          {/* 内容 */}
          {renderTabContents(activeTab)}
        </div>
        <div className="col-span-1">
          <div className="bg-base-200 p-2">
            <span className="font-bold">タスク</span>
          </div>
          <p>{JSON.stringify(data)}</p>
        </div>
      </div>
    </div>
  )
}

Documents.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Documents
