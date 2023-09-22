import type ContentNode from './ContentNode'

export default interface Data {
  pages: { [key: string]: ContentNode }
  rootLevelKeys: string[]
}
