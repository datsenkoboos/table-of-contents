import { setActivePinia, createPinia } from 'pinia'
import useStore from './appStore'
import { describe, it, expect, beforeAll, vi, afterEach, type Mock } from 'vitest'
import type { Data } from '@/models'

const testData: Data = { pages: {}, rootLevelKeys: ['test'] }

vi.stubGlobal('fetch', vi.fn())
function createFetchResponse(data: unknown) {
  return { json: () => new Promise((resolve) => resolve(data)) }
}

describe('AppStore', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
  })
  afterEach(() => {
    vi.clearAllMocks()
  })
  describe('state', () => {
    it('showTableOfContents - should be true', () => {
      const store = useStore()
      expect(store.showTableOfContents).toBe(true)
    })
    it('data - should be empty object', () => {
      const store = useStore()
      expect(store.data).toStrictEqual({})
    })
  })
  describe('actions', () => {
    it('setData - should set data to passed value', () => {
      const store = useStore()
      store.setData(testData)

      expect(store.data).toStrictEqual(testData)
    })
    it('init - should fetch from valid url and set returned data', async () => {
      ;(fetch as Mock).mockResolvedValue(createFetchResponse(testData))

      const store = useStore()
      vi.spyOn(store, 'setData')

      await store.init()

      expect(fetch).toHaveBeenCalled()
      expect(fetch).toHaveBeenCalledWith('https://prolegomenon.s3.amazonaws.com/contents.json')

      expect(store.setData).toHaveBeenCalled()
      expect(store.setData).toHaveBeenCalledWith(testData)
    })
  })
})
