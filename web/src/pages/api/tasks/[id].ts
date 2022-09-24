import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prismaClient'

export type Task = {
  id: number
  title: string
  body: string
}

export type TaskApiResponse = {
  tasks?: Task[]
  errorMessage?: string
}

const fetchTask = async (
  req: NextApiRequest,
  res: NextApiResponse<TaskApiResponse>
) => {
  const id = req.query['id']
  const task = await prisma.task.findFirst({
    where: {
      id: Number(id)
    }
  })

  if (task) {
    res.status(200).json({ tasks: [task] })
  } else {
    res.status(400).json({ errorMessage: `Task [id=${id}] not found` })
  }
}

export default fetchTask
