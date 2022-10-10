import { useState } from 'react'
import { match } from 'ts-pattern'
import type { DocumentTab } from './index'
import { AISupport, Analyze, Information, Rebuttal } from './index'

export const useTabs = () => {
  const [activeTab, setActiveTab] = useState<DocumentTab>('分析')
  const renderTabContents = (activeTab: DocumentTab) =>
    match(activeTab)
      .with('分析', () => <Analyze />)
      .with('反論', () => <Rebuttal />)
      .with('情報', () => <Information />)
      .with('AI支援', () => <AISupport />)
      .exhaustive()
  return { activeTab, setActiveTab, renderTabContents }
}
