import React from 'react'
import { trpc } from '../../../lib/trpc'
import { Layout } from '../../../elements/Layout'
import { Document } from '../../../elements/Documents/Document'
import { DocumentTabs } from '../../../elements/Documents/DocumentTabs'
import { useRouter } from 'next/router'

const Documents = () => {
  const router = useRouter()
  const { id } = router.query

  const userId = 1
  const { data } = trpc.useSWR(['users.get', { id: userId }])

  const { data: document } = trpc.useSWR([
    'documents.getById',
    { id: Number(id) }
  ])

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">ドキュメント</h2>
      <div className="grid grid-cols-5 gap-2">
        {/* ドキュメント */}
        <div className="col-span-2">
          <Document title={''} body={''} canEdit={false} />
        </div>
        {/* タブ */}
        <div className="col-span-2">
          <DocumentTabs />
        </div>
        <div className="col-span-1">
          <div className="bg-base-200 p-2">
            <span className="font-bold">タスク</span>
          </div>
          <p>{JSON.stringify(data)}</p>
        </div>
      </div>
    </div>
  )
}

Documents.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Documents
