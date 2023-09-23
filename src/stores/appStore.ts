import type { ContentNodeModel, DataModel } from '@/models';
import { defineStore } from 'pinia';

const useAppStore = defineStore('app', {
  state: (): {
    showTableOfContents: boolean;
    data: DataModel;
    nodesToShowChildren: string[];
  } => {
    return {
      showTableOfContents: true,
      data: {} as DataModel,
      nodesToShowChildren: []
    };
  },
  actions: {
    setData(data: typeof this.data): void {
      Object.assign(this.data, data);
    },
    async init(inititialKey?: string) {
      const data: DataModel = await (
        await fetch('https://prolegomenon.s3.amazonaws.com/contents.json')
      ).json();
      this.setData(data);
      if (inititialKey) {
        let node = this.getNodeByKey(inititialKey);
        this.addNodesToShowChildren(node.key)
        for (let i = node.level; i > 0; i--) {
          const parentKey = node.parentKey!;
          this.addNodesToShowChildren(parentKey)
          node = this.getNodeByKey(parentKey)
        }
      }
    },
    getNodeByKey(key: string): ContentNodeModel {
      return this.data.pages[key]
    },
    addNodesToShowChildren(key: string): void {
      this.nodesToShowChildren.push(key);
    }
  },
});

export default useAppStore;
