import { Layout } from '../../elements/Layout'

const Issues = () => {
  return <p>aa</p>
}

Issues.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Issues
