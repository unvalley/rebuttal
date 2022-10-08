import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'error', 'info', 'warn']
})

async function main() {
  await prisma.role.createMany({
    data: [
      {
        id: 1,
        kind: 'ADMIN'
      },
      {
        id: 2,
        kind: 'WRITER'
      },
      {
        id: 3,
        kind: 'WORKER'
      }
    ],
    skipDuplicates: true
  })

  await prisma.user.createMany({
    data: [
      {
        name: 'admin',
        crowdId: 1,
        roleId: 1
      },
      {
        name: 'writer',
        crowdId: 2,
        roleId: 2
      },
      {
        name: 'worker',
        crowdId: 3,
        roleId: 3
      }
    ]
  })

  await prisma.document.createMany({
    data: [
      {
        id: 1,
        title: 'ワーカーが作業開始できないドキュメント',
        body: '意見記述なし',
        isRebuttalReady: false,
        authorId: 2
      },
      {
        id: 2,
        title: 'ワーカーが作業開始できるドキュメント',
        body: '意見記述あり',
        isRebuttalReady: true,
        authorId: 2
      }
    ],
    skipDuplicates: true
  })

  await prisma.comment.createMany({
    data: [
      {
        id: 1,
        body: `documentId=1へのコメント(INFORMATION): こちらのリンクを見ると良いです．https://github.com`,
        kind: 'INFORMATION',
        documentId: 1
      },
      {
        id: 1,
        body: `documentId=2へのコメント(REBUTTAL): その論理は破綻しています．なぜならこうだからです．`,
        kind: 'REBUTTAL',
        documentId: 2
      }
    ],
    skipDuplicates: true
  })

  await prisma.task.createMany({
    data: [
      { id: 1, title: 'タスク1', body: '未アサイン', status: 'CREATED' },
      {
        id: 2,
        title: 'タスク2',
        body: 'アサイン済',
        assigneeId: 3,
        status: 'ASSIGNED'
      },
      { id: 3, title: 'タスク3', body: '完了済', assigneeId: 3, status: 'DONE' }
    ],
    skipDuplicates: true
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {})
