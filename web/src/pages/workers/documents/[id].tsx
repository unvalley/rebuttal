import React from 'react'
import {
  type Tab,
  useTabs,
  tabs
} from '../../../elements/Documents/TabContents/useTabs'
import { Layout } from '../../../elements/Layout'

const styleTabClass = (targetActiveTab: Tab, currentActiveTab: Tab): string => {
  return targetActiveTab === currentActiveTab ? 'tab tab-active' : 'tab'
}

const Documents = () => {
  const { activeTab, setActiveTab, renderTabContents } = useTabs()

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">ドキュメント</h2>
      <div className="grid grid-cols-2 gap-2">
        <div className="">
          <div className="card bg-base-100 shadow-xs">
            <div className="card-body">
              <h2 className="card-title">タイトル</h2>
              <p>内容</p>
            </div>
          </div>
        </div>
        <div className="">
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
      </div>
    </div>
  )
}

Documents.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Documents
