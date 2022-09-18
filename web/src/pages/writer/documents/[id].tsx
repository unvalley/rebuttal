import { Layout } from '../../../elements/Layout'

const Documents = () => {
  return (
    <div className="container mx-auto p-4">
      <p>Documents</p>
    </div>
  )
}

Documents.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Documents
