import { Layout } from '../../elements/Layout'

const Help = () => {
  return (
    <div className="container mx-auto p-4">
      <h2>Help</h2>
    </div>
  )
}

Help.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Help
