import type { NextApiRequest, NextApiResponse } from 'next'

export type Task = {
  id: number
  title: string
  body: string
}

export type TaskApiResponse = {
  task?: Task
  errorMessage?: string
}

export default function tasksApi(
  req: NextApiRequest,
  res: NextApiResponse<TaskApiResponse>
): void {
  const id = req.query['id']
  const task = fetchTask(Number(id))
  if (task) {
    res.status(200).json({ task })
  } else {
    res.status(400).json({ errorMessage: `Task [id=${id}] not found` })
  }
}

// 擬似的なデータフェッチ関数
function fetchTask(id: number): Task | undefined {
  const tasks: Task[] = [
    { id: 1, title: '', body: '' },
    { id: 2, title: '', body: '' },
    { id: 3, title: '', body: '' }
  ]
  return tasks.find((task) => task.id === id)
}
