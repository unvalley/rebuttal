import React from 'react'
import { useRouter } from 'next/router'
import { trpc } from '../../../lib/trpc'
import { Layout } from '../../../elements/Layout'
import { Document } from '../../../elements/Documents/Document'
import { DocumentTabs } from '../../../elements/Documents/DocumentTabs'

const Documents = () => {
  const router = useRouter()
  const { id } = router.query

  const userId = 1
  const { data } = trpc.useSWR(['users.get', { id: userId }])

  const { data: document } = trpc.useSWR([
    'documents.getById',
    { id: Number(id) },
  ])

  // eslint-disable-next-line no-console
  console.log(document, data)

  const { data: assignedTasks } = trpc.useSWR(['tasks.getByUserId', { userId }])

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">ドキュメント</h2>
      <div className="grid grid-cols-5 gap-2">
        {/* ドキュメント */}
        <div className="col-span-2">
          <Document title={''} body={`
          恥の多い生涯を送って来ました。自分には、人間の生活というものが、見当つかないのです。自分は東北の田舎に生れましたので、汽車をはじめて見たのは、よほど大きくなってからでした。自分は停車場のブリッジを、上って、降りて、そうしてそれが線路をまたぎ越えるために造られたものだという事には全然気づかず、ただそれは停車場の構内を外国の遊戯場みたいに、複雑に楽しく、ハイカラにするためにのみ、設備せられてあるものだとばかり思っていました。しかも、かなり永い間そう思っていたのです。ブリッジの上ったり降りたりは、自分にはむしろ、ずいぶん垢抜けのした遊戯で、それは鉄道のサーヴィスの中でも、最も気のきいたサーヴィスの一つだと思っていたのですが、のちにそれはただ旅客が線路をまたぎ越えるための頗る実利的な階段に過ぎないのを発見して、にわかに興が覚めました。また、自分は子供の頃、絵本で地下鉄道というものを見て、これもやは
          `} canEdit={false} />
        </div>
        {/* タブ */}
        <div className="col-span-2">
          <DocumentTabs />
        </div>
        <div className="col-span-1">
          <div className="bg-base-200 p-2">
            <span className="font-bold">タスク</span>
          </div>
          <div>
            <div className="">
              <div></div>
            </div>
          {assignedTasks
            ? <div>
              {assignedTasks.map(task =>
              <div>
                {task.title}
              </div>,
              )}
          </div>
            : <span>タスクが割り当てられていません。</span>
          }
          </div>
        </div>
      </div>
    </div>
  )
}

Documents.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Documents
