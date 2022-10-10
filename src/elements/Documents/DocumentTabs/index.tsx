import { useTabs } from './DocumentTabContents/useTabs'
import type { DocumentTab } from './DocumentTabContents'
import { documentTabs } from './DocumentTabContents'

const styleTabClass = (
  targetActiveTab: DocumentTab,
  currentActiveTab: DocumentTab,
): string => {
  return targetActiveTab === currentActiveTab ? 'tab tab-active' : 'tab'
}

export const DocumentTabs: React.FC = () => {
  const { activeTab, setActiveTab, renderTabContents } = useTabs()
  return (
    <div>
      <div className="tabs tabs-boxed">
        {documentTabs.map(tab => (
          <a
            key={tab}
            className={styleTabClass(tab, activeTab)}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </a>
        ))}
      </div>
      {renderTabContents(activeTab)}
    </div>
  )
}
