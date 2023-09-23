import type ContentNodeModel from './ContentNodeModel';

export default interface DataModel {
  pages: { [key: string]: ContentNodeModel };
  rootLevelKeys: string[];
}
