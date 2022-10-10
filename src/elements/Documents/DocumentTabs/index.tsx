import { useTabs } from './DocumentTabContents/useTabs'
import type { DocumentTab } from './DocumentTabContents'
import { workerTaskflow } from './DocumentTabContents'

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
        {workerTaskflow.map(taskflow => (
          <div key={taskflow.title} className="tooltip" data-tip={taskflow.message}>
          <a
            className={styleTabClass(taskflow.title, activeTab)}
            onClick={() => setActiveTab(taskflow.title)}
          >
            {taskflow.title}
          </a>
          </div>
        ))}
      </div>
      {renderTabContents(activeTab)}
    </div>
  )
}
