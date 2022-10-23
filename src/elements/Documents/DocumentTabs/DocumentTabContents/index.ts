import { AISupport } from './AISupport'
import { Information } from './Information'
import { Analyze } from './Analyze'
import { Rebuttal } from './Rebuttal'

export const workerTaskflow = [
  {
    title: '反論',
    message: '反論を行う場所です',
  },
  {
    title: '情報',
    message: '情報を集める場所です',
  },
  {
    title: '分析',
    message: '文書の分析を行う場所です',
  },
  {
    title: 'AI支援',
    message: 'AIによる支援を受け取る場所です',
  },
] as const

export const documentTabs = ['分析', '反論', '情報', 'AI支援'] as const
export type DocumentTab = typeof documentTabs[number]

export { AISupport, Information, Analyze, Rebuttal }
