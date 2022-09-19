import { Layout } from '../../elements/Layout'

const HelpWriter = () => {
  return (
    <div>
      <p>writer用ヘルプ</p>
    </div>
  )
}

const HelpWorker = () => {
  return (
    <div>
      <p>Worker用ヘルプ</p>
    </div>
  )
}

const Help = () => {
  const role = 'worker'

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">ヘルプ</h2>
      {role === 'worker' && <HelpWorker />}
      {/* {role === 'writer' && <HelpWriter />} */}
    </div>
  )
}

Help.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Help
