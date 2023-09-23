import type { ContentNodeModel, DataModel } from '@/models';
import { defineStore } from 'pinia';

const useAppStore = defineStore('app', {
  state: (): {
    showTableOfContents: boolean;
    data: DataModel;
    keysToShowChildren: string[];
  } => {
    return {
      showTableOfContents: true,
      data: {} as DataModel,
      keysToShowChildren: [],
    };
  },
  actions: {
    setData(data: typeof this.data): void {
      Object.assign(this.data, data);
    },
    getNodeByKey(key: string): ContentNodeModel {
      return this.data.pages[key];
    },
    addKeysToShowChildren(key: string): void {
      this.keysToShowChildren.push(key);
    },
    async init(inititialKey?: string) {
      const data: DataModel = await (
        await fetch('https://prolegomenon.s3.amazonaws.com/contents.json')
      ).json();
      this.setData(data);

      if (inititialKey) {
        let node = this.getNodeByKey(inititialKey);
        this.addKeysToShowChildren(node.key);
        for (let i = node.level; i > 0; i--) {
          const parentKey = node.parentKey!;
          this.addKeysToShowChildren(parentKey);
          node = this.getNodeByKey(parentKey);
        }
      }
    },
    toggleTableOfContents(): void {
      this.showTableOfContents = !this.showTableOfContents;
    },
  },
});

export default useAppStore;
