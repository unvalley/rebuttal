import { Document } from '../../../elements/Documents/Document'
import { DocumentTabs } from '../../../elements/Documents/DocumentTabs'
import { Layout } from '../../../elements/Layout'

const Documents = () => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">Documents</h2>
      <div className="grid grid-cols-2 gap-2">
        {/* Document */}
        <div className="col-span-1">
          <Document title={''} body={''} canEdit={true} />
        </div>

        {/* Tabs */}
        <div className="col-span-1">
          <DocumentTabs />
        </div>
      </div>
    </div>
  )
}

Documents.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Documents
