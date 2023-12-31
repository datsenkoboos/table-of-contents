import { shallowMount, type ComponentMountingOptions } from '@vue/test-utils';
import ContentNode from './ContentNode.vue';
import {
  describe,
  it,
  expect,
  vi,
  type Mock,
  afterEach,
  beforeEach,
  beforeAll,
} from 'vitest';
import { DataMock } from '@/mocks';
import { createTestingPinia } from '@pinia/testing';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores';
import type { DataModel, ContentNodeModel } from '@/models';

const DefaultMountOptions: ComponentMountingOptions<typeof ContentNode> = {
  global: {
    plugins: [createTestingPinia()],
    renderStubDefaultSlot: true,
  },
};
const GeneralMountOptions: typeof DefaultMountOptions = {
  ...DefaultMountOptions,
  props: {
    contentKey: DataMock.rootLevelKeys[DataMock.rootLevelKeys.length - 1],
  },
};
const WithoutChildrenMountOptions: typeof DefaultMountOptions = {
  ...DefaultMountOptions,
  props: {
    // see DataMock.pages[node_without_children]
    contentKey: 'node_without_children',
  },
};
const WithChildrenMountOptions: typeof DefaultMountOptions = {
  ...DefaultMountOptions,
  props: {
    // see DataMock.pages[node_with_children]
    contentKey: 'node_with_children',
  },
};

function getPassedNode(
  store: { data: DataModel },
  mountOptions: typeof DefaultMountOptions
): ContentNodeModel {
  return store.data.pages[mountOptions.props!.contentKey];
}

const nodeLinkSelector = '[data-testid=nodeLink]';
const nodeChildrenWrapperSelector = '[data-testid=nodeChildrenWrapper]';
const showChildrenButtonSelector = '[data-testid=showChildrenButton]';
const showChildrenIconSelector = '[data-testid=showChildrenIcon]';

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

describe('ContentNode', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });
  beforeEach(() => {
    const appStore = useAppStore();
    appStore.data = DataMock;
    appStore.keysToShowChildren = [];
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('props', () => {
    it('contentKey - should render the correct name of the node within the nodeLink', () => {
      const wrapper = shallowMount(ContentNode, GeneralMountOptions);
      const appStore = useAppStore();
      expect(wrapper.get(nodeLinkSelector).text()).toBe(
        getPassedNode(appStore, GeneralMountOptions).name
      );
    });
    it('contentKey - should set the correct "to" attribute in nodeLink', () => {
      const wrapper = shallowMount(ContentNode, GeneralMountOptions);
      const appStore = useAppStore();
      expect(wrapper.get(nodeLinkSelector).attributes('to')).toBe(
        getPassedNode(appStore, GeneralMountOptions).link.slice(0, -5)
      );
    });
    describe('contentKey of route-selected node', () => {
      it('should apply active text color to nodeLink and disable hover effect', () => {
        const appStore = useAppStore();
        (useRoute as Mock).mockReturnValueOnce({
          fullPath: getPassedNode(appStore, GeneralMountOptions).link.slice(
            0,
            -5
          ),
        });
        const wrapper = shallowMount(ContentNode, GeneralMountOptions);
        expect(wrapper.get(nodeLinkSelector).classes()).toContain(
          'text-[var(--color-link-active)]'
        );
        expect(wrapper.get(nodeLinkSelector).classes()).not.toContain(
          'hover:text-[var(--color-link-active)]'
        );
      });
      it('should render without "font-semibold" class, with "font-bold" class', () => {
        const appStore = useAppStore();
        (useRoute as Mock).mockReturnValueOnce({
          fullPath: getPassedNode(appStore, GeneralMountOptions).link.slice(
            0,
            -5
          ),
        });
        const wrapper = shallowMount(ContentNode, GeneralMountOptions);
        const contentNodeSelector = `[data-testid=${
          GeneralMountOptions.props!.contentKey
        }]`;
        expect(wrapper.get(contentNodeSelector).classes()).toContain(
          'font-bold'
        );
        expect(wrapper.get(contentNodeSelector).classes()).not.toContain(
          'font-semibold'
        );
      });
      it('should call scrollIntoView', () => {
        const appStore = useAppStore();
        (useRoute as Mock).mockReturnValueOnce({
          fullPath: getPassedNode(appStore, GeneralMountOptions).link.slice(
            0,
            -5
          ),
        });
        shallowMount(ContentNode, GeneralMountOptions);
        expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
      });
    });
    describe('contentKey of node that is not route-selected', () => {
      it('should not apply active text color to nodeLink and enable hover effect', () => {
        (useRoute as Mock).mockReturnValueOnce({
          fullPath: 'foo',
        });
        const wrapper = shallowMount(ContentNode, GeneralMountOptions);
        expect(wrapper.get(nodeLinkSelector).classes()).not.toContain(
          'text-[var(--color-link-active)]'
        );
        expect(wrapper.get(nodeLinkSelector).classes()).toContain(
          'hover:text-[var(--color-link-active)]'
        );
      });
      it('should render with "font-semibold" class, without "font-bold" class', () => {
        (useRoute as Mock).mockReturnValueOnce({
          fullPath: 'foo',
        });
        const wrapper = shallowMount(ContentNode, GeneralMountOptions);
        const contentNodeSelector = `[data-testid=${
          GeneralMountOptions.props!.contentKey
        }]`;
        expect(wrapper.get(contentNodeSelector).classes()).not.toContain(
          'font-bold'
        );
        expect(wrapper.get(contentNodeSelector).classes()).toContain(
          'font-semibold'
        );
      });
    });
    describe('contentKey of node without children', () => {
      it('should not render nodeChildrenWrapper', () => {
        const wrapper = shallowMount(ContentNode, WithoutChildrenMountOptions);
        expect(wrapper.find(nodeChildrenWrapperSelector).exists()).toBe(false);
      });
      it('should not render showChildrenButton', () => {
        const wrapper = shallowMount(ContentNode, WithoutChildrenMountOptions);
        expect(wrapper.find(showChildrenButtonSelector).exists()).toBe(false);
      });
    });
    describe('contentKey of node with children', () => {
      it('should not render nodeChildrenWrapper by default', () => {
        const wrapper = shallowMount(ContentNode, WithChildrenMountOptions);
        expect(wrapper.find(nodeChildrenWrapperSelector).exists()).toBe(false);
      });
      it('should render nodeChildrenWrapper when appStore.keysToShowChildren includes contentKey', () => {
        const appStore = useAppStore();
        appStore.keysToShowChildren = [
          WithChildrenMountOptions.props!.contentKey,
        ];

        const wrapper = shallowMount(ContentNode, WithChildrenMountOptions);
        expect(wrapper.find(nodeChildrenWrapperSelector).exists()).toBe(true);
      });
      it('should render showChildrenButton', () => {
        const wrapper = shallowMount(ContentNode, WithChildrenMountOptions);
        expect(wrapper.find(showChildrenButtonSelector).exists()).toBe(true);
      });
      it('should render showChildrenIcon with "rotate-90" class, without "rotate-180" class by default', () => {
        const wrapper = shallowMount(ContentNode, WithChildrenMountOptions);
        expect(wrapper.get(showChildrenIconSelector).classes()).toContain(
          'rotate-90'
        );
        expect(wrapper.get(showChildrenIconSelector).classes()).not.toContain(
          'rotate-180'
        );
      });
    });
    describe('user interactions', () => {
      it('nodeLink click - should render nodeChildrenWrapper, change showChildrenIcon class from "rotate-90" to "rotate-180"', async () => {
        const wrapper = shallowMount(ContentNode, WithChildrenMountOptions);

        await wrapper.get(nodeLinkSelector).trigger('click');

        expect(wrapper.find(nodeChildrenWrapperSelector).exists()).toBe(true);
        expect(wrapper.get(showChildrenIconSelector).classes()).not.toContain(
          'rotate-90'
        );
        expect(wrapper.get(showChildrenIconSelector).classes()).toContain(
          'rotate-180'
        );

        await wrapper.get(nodeLinkSelector).trigger('click');

        expect(wrapper.find(nodeChildrenWrapperSelector).exists()).toBe(true);
        expect(wrapper.get(showChildrenIconSelector).classes()).not.toContain(
          'rotate-90'
        );
        expect(wrapper.get(showChildrenIconSelector).classes()).toContain(
          'rotate-180'
        );
      });
      it('showChildrenButton click - should toggle nodeChildrenWrapper rendering, toggle showChildrenIcon class from "rotate-90" to "rotate-180"', async () => {
        const wrapper = shallowMount(ContentNode, WithChildrenMountOptions);

        await wrapper.get(showChildrenButtonSelector).trigger('click');

        expect(wrapper.find(nodeChildrenWrapperSelector).exists()).toBe(true);
        expect(wrapper.get(showChildrenIconSelector).classes()).not.toContain(
          'rotate-90'
        );
        expect(wrapper.get(showChildrenIconSelector).classes()).toContain(
          'rotate-180'
        );

        await wrapper.get(showChildrenButtonSelector).trigger('click');

        expect(wrapper.find(nodeChildrenWrapperSelector).exists()).toBe(false);
        expect(wrapper.get(showChildrenIconSelector).classes()).toContain(
          'rotate-90'
        );
        expect(wrapper.get(showChildrenIconSelector).classes()).not.toContain(
          'rotate-180'
        );
      });
    });
  });
});
