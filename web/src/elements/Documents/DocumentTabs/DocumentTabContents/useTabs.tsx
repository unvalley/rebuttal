import { useState } from 'react'
import { match } from 'ts-pattern'
import { Analyze, Rebuttal, Information, AISupport, Tab } from './index'

export const useTabs = () => {
  const [activeTab, setActiveTab] = useState<Tab>('分析')
  const renderTabContents = (activeTab: Tab) =>
    match(activeTab)
      .with('分析', () => <Analyze />)
      .with('反論', () => <Rebuttal />)
      .with('情報', () => <Information />)
      .with('AI支援', () => <AISupport />)
      .exhaustive()
  return { activeTab, setActiveTab, renderTabContents }
}
