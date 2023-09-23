import TableOfContents from './TableOfContents.vue';
import { describe, it, expect, vi, type Mock, afterEach, vitest } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useAppStore } from '@/stores';
import { DataMock } from '@/mocks';
import { useRoute } from 'vue-router';
import router from '@/router';

const rootNodeSelector = '[data-testid=rootNode]';
const toggleIconSelector = '[data-testid=toggleIcon]';
const toggleButtonSelector = '[data-testid=toggleButton]';

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
vi.mock('@/router', () => {
  return {
    default: {
      isReady: vi.fn(async () => Promise.resolve()),
    },
  };
});

describe('TableOfContents', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('init - should call appStore.init with valid key', async () => {
    const testPath = '/some-path';
    (useRoute as Mock).mockReturnValueOnce({
      fullPath: testPath,
    });
    shallowMount(TableOfContents, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    await router.isReady();

    const appStore = useAppStore();
    expect(appStore.init).toHaveBeenCalled();
    expect(appStore.init).toHaveBeenCalledWith(
      testPath.split('-').join('_').slice(1)
    );
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
    it('appStore.showTableOfContents - should render nav visible when set to "true"', () => {
      const wrapper = shallowMount(TableOfContents, {
        global: {
          plugins: [createTestingPinia()],
        },
      });
      expect(wrapper.get('nav').isVisible()).toBe(true);
    });
    it('appStore.showTableOfContents - should render nav invisible when set to "false"', () => {
      const wrapper = shallowMount(TableOfContents, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                app: {
                  showTableOfContents: false,
                },
              },
            }),
          ],
        },
      });
      expect(wrapper.get('nav').isVisible()).toBe(false);
    });
    it('appStore.showTableOfContents - should render close toggleIcon when set to "true"', () => {
      const wrapper = shallowMount(TableOfContents, {
        global: {
          plugins: [createTestingPinia()],
        },
      });
      expect(wrapper.get(toggleIconSelector).attributes('icon')).toContain(
        'close'
      );
      expect(wrapper.get(toggleIconSelector).attributes('icon')).not.toContain(
        'menu'
      );
    });
    it('appStore.showTableOfContents - should render menu toggleIcon when set to "false"', () => {
      const wrapper = shallowMount(TableOfContents, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                app: {
                  showTableOfContents: false,
                },
              },
            }),
          ],
        },
      });
      expect(wrapper.get(toggleIconSelector).attributes('icon')).not.toContain(
        'close'
      );
      expect(wrapper.get(toggleIconSelector).attributes('icon')).toContain(
        'menu'
      );
    });
  });
  describe('user interactions', () => {
    it('toggleButton click - should call appStore.toggleTableOfContents', async () => {
      const wrapper = shallowMount(TableOfContents, {
        global: {
          plugins: [createTestingPinia()],
        },
      });
      const appStore = useAppStore();
      vitest.spyOn(appStore, 'toggleTableOfContents');

      await wrapper.get(toggleButtonSelector).trigger('click');

      expect(appStore.toggleTableOfContents).toHaveBeenCalled();
    });
  });
});
