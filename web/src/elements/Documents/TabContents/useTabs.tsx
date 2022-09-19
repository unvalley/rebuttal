import { useState } from 'react'
import { match } from 'ts-pattern'
import { Analyze, Rebuttal, Information, AISupport } from './index'

export const tabs = ['分析', '反論', '情報', 'AI支援'] as const
export type Tab = typeof tabs[number]

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
