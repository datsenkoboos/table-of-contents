import TableOfContents from './TableOfContents.vue'
import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useAppStore } from '@/stores'
import { DataMock } from '@/mocks'

const rootNodeSelector = '[data-testid=rootNode]'

describe('TableOfContents', () => {
  it('init - should call appStore.init', () => {
    shallowMount(TableOfContents, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
    const appStore = useAppStore()
    expect(appStore.init).toHaveBeenCalled()
  })
  describe('state', () => {
    it('appStore.data - should render the correct number of nodes with valid content keys', () => {
      const wrapper = shallowMount(TableOfContents, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                app: {
                  data: DataMock
                }
              }
            })
          ]
        }
      })
      const appStore = useAppStore()
      const appStoreRootNodes = appStore.data.rootLevelKeys

      const renderedNodes = wrapper.findAll(rootNodeSelector)

      expect(renderedNodes).toHaveLength(appStore.data.rootLevelKeys.length)
      for (let i = 0; i < appStoreRootNodes.length; i++) {
        expect(renderedNodes[i].attributes('contentkey')).toBe(appStoreRootNodes[i])
      }
    })
  })
})
