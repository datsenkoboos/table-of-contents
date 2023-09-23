export default interface ContentNodeModel {
  key: string;
  name: string;
  level: number;
  link: string;
  parentKey?: string;
  childPageKeys?: string[];
}
