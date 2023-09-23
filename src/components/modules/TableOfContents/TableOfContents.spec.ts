import TableOfContents from './TableOfContents.vue';
import { describe, it, expect, vi, type Mock, afterEach } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useAppStore } from '@/stores';
import { DataMock } from '@/mocks';
import { useRoute } from 'vue-router';

const rootNodeSelector = '[data-testid=rootNode]';

vi.mock('vue-router', async () => {
  const actual =
    await vi.importActual<typeof import('vue-router')>('vue-router');
  return {
    ...actual,
    useRoute: vi.fn(() => ({
      fullPath: '',
    })),
  };
});

describe('TableOfContents', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('init - should call appStore.init', () => {
    shallowMount(TableOfContents, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    const appStore = useAppStore();
    expect(appStore.init).toHaveBeenCalled();
  });
  describe('state', () => {
    it('appStore.data - should render the correct number of nodes with valid content keys', () => {
      const wrapper = shallowMount(TableOfContents, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                app: {
                  data: DataMock,
                },
              },
            }),
          ],
        },
      });
      const appStore = useAppStore();
      const appStoreRootNodes = appStore.data.rootLevelKeys;

      const renderedNodes = wrapper.findAll(rootNodeSelector);

      expect(renderedNodes).toHaveLength(appStore.data.rootLevelKeys.length);
      for (let i = 0; i < appStoreRootNodes.length; i++) {
        expect(renderedNodes[i].attributes('contentkey')).toBe(
          appStoreRootNodes[i]
        );
      }
    });
    it('appStore.data - should render nested nodes visible when route matches nested nodes links', () => {
      (useRoute as Mock).mockReturnValueOnce({
        fullPath: 'nested_node',
      });
      const wrapper = mount(TableOfContents, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                app: {
                  data: DataMock,
                },
              },
            }),
          ],
        },
      });

      expect(wrapper.get(`[data-testid=nested_node]`).isVisible()).toBe(true);
    });
  });
});
