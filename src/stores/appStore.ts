import type { Data } from '@/models'
import { defineStore } from 'pinia'

const useAppStore = defineStore('app', {
  state: (): {
    showTableOfContents: boolean
    data: Data
  } => {
    return {
      showTableOfContents: true,
      data: {} as Data
    }
  },
  actions: {
    setData(data: typeof this.data): void {
      Object.assign(this.data, data)
    },
    async init() {
      const data: Data = await (
        await fetch('https://prolegomenon.s3.amazonaws.com/contents.json')
      ).json()
      this.setData(data)
    }
  }
})

export default useAppStore
