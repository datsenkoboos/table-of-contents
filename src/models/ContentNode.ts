export default interface ContentNode {
  key: string
  name: string
  level: number
  link: string
  parentKey?: string
  childPageKeys?: string[]
}
