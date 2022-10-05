import { AISupport } from './AISupport'
import { Information } from './Information'
import { Analyze } from './Analyze'
import { Rebuttal } from './Rebuttal'

export const documentTabs = ['分析', '反論', '情報', 'AI支援'] as const
export type DocumentTab = typeof documentTabs[number]

export { AISupport, Information, Analyze, Rebuttal }
