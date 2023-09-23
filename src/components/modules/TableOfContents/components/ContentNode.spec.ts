import { shallowMount, type ComponentMountingOptions } from '@vue/test-utils';
import ContentNode from './ContentNode.vue';
import { describe, it, expect, vi, type Mock, afterEach } from 'vitest';
import { DataMock } from '@/mocks';
import { createTestingPinia } from '@pinia/testing';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores';
import type { DataModel, ContentNodeModel } from '@/models';

const DefaultMountOptions: ComponentMountingOptions<typeof ContentNode> = {
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
const childNodeSelector = '[data-testid=childNode]';
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
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('props', () => {
    it('contentKey - should render the correct name of the node within the nodeLink based on the provided contentKey', () => {
      const wrapper = shallowMount(ContentNode, GeneralMountOptions);
      const appStore = useAppStore();
      expect(wrapper.get(nodeLinkSelector).text()).toBe(
        getPassedNode(appStore, GeneralMountOptions).name
      );
    });
    it('contentKey - should set the correct "to" attribute in nodeLink based on the provided contentKey', () => {
      const wrapper = shallowMount(ContentNode, GeneralMountOptions);
      const appStore = useAppStore();
      expect(wrapper.get(nodeLinkSelector).attributes('to')).toBe(
        getPassedNode(appStore, GeneralMountOptions).link.slice(0, -5)
      );
    });
    it('contentKey - should apply active text color to nodeLink and disable hover effect when route matches node.link based on the provided contentKey', () => {
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
    it('should not apply active text color to nodeLink and enable hover effect when route does not match node.link based on the provided contentKey', () => {
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
      describe('contentKey of node with level=0', () => {
        it('should not emit "showChildren" event when route matches node.link', () => {
          const appStore = useAppStore();
          (useRoute as Mock).mockReturnValueOnce({
            fullPath: getPassedNode(
              appStore,
              WithChildrenMountOptions
            ).link.slice(0, -5),
          });
          const wrapper = shallowMount(ContentNode, WithChildrenMountOptions);
          expect(wrapper.emitted()).not.toHaveProperty('showChildren');
        });
      });
      describe('contentKey of node with level!=0', () => {
        it('should emit "showChildren" event when route matches node.link', () => {
          const TestMountOptions: typeof DefaultMountOptions = {
            ...DefaultMountOptions,
            props: {
              contentKey: 'nested_node',
            },
          };
          const appStore = useAppStore();
          (useRoute as Mock).mockReturnValueOnce({
            fullPath: getPassedNode(appStore, TestMountOptions).link.slice(
              0,
              -5
            ),
          });
          const wrapper = shallowMount(ContentNode, TestMountOptions);
          expect(wrapper.emitted()).toHaveProperty('showChildren');
          expect(wrapper.emitted('showChildren')).toHaveLength(1);
        });
      });
      it('should render nodeChildrenWrapper visible when route matches node.link', () => {
        const appStore = useAppStore();
        (useRoute as Mock).mockReturnValueOnce({
          fullPath: getPassedNode(
            appStore,
            WithChildrenMountOptions
          ).link.slice(0, -5),
        });
        const wrapper = shallowMount(ContentNode, WithChildrenMountOptions);
        expect(wrapper.get(nodeChildrenWrapperSelector).isVisible()).toBe(true);
      });
      it('should render nodeChildrenWrapper', () => {
        const wrapper = shallowMount(ContentNode, WithChildrenMountOptions);
        expect(wrapper.find(nodeChildrenWrapperSelector).exists()).toBe(true);
      });
      it('should render nodeChildrenWrapper invisible by default', () => {
        const wrapper = shallowMount(ContentNode, WithChildrenMountOptions);
        expect(wrapper.get(nodeChildrenWrapperSelector).isVisible()).toBe(
          false
        );
      });
      it('should render the correct number of child nodes with valid content keys', () => {
        const wrapper = shallowMount(ContentNode, WithChildrenMountOptions);
        const appStore = useAppStore();
        const childNodes = getPassedNode(appStore, WithChildrenMountOptions)
          .childPageKeys!;

        const renderedNodes = wrapper.findAll(childNodeSelector);

        expect(renderedNodes).toHaveLength(childNodes.length);
        for (let i = 0; i < childNodes.length; i++) {
          expect(renderedNodes[i].attributes('contentkey')).toBe(childNodes[i]);
        }
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
  });
  describe('user interactions', () => {
    it('nodeLink click - should make nodeChildrenWrapper visible, change showChildrenIcon class from "rotate-90" to "rotate-180"', async () => {
      const wrapper = shallowMount(ContentNode, WithChildrenMountOptions);

      await wrapper.get(nodeLinkSelector).trigger('click');

      expect(wrapper.get(nodeChildrenWrapperSelector).isVisible()).toBe(true);
      expect(wrapper.get(showChildrenIconSelector).classes()).not.toContain(
        'rotate-90'
      );
      expect(wrapper.get(showChildrenIconSelector).classes()).toContain(
        'rotate-180'
      );

      await wrapper.get(nodeLinkSelector).trigger('click');

      expect(wrapper.get(nodeChildrenWrapperSelector).isVisible()).toBe(true);
      expect(wrapper.get(showChildrenIconSelector).classes()).not.toContain(
        'rotate-90'
      );
      expect(wrapper.get(showChildrenIconSelector).classes()).toContain(
        'rotate-180'
      );
    });
    it('showChildrenButton click - should toggle nodeChildrenWrapper visibility, toggle showChildrenIcon class from "rotate-90" to "rotate-180"', async () => {
      const wrapper = shallowMount(ContentNode, WithChildrenMountOptions);

      await wrapper.get(showChildrenButtonSelector).trigger('click');

      expect(
        wrapper.get(nodeChildrenWrapperSelector).attributes('style')
      ).not.toBe('display: none;');
      expect(wrapper.get(showChildrenIconSelector).classes()).not.toContain(
        'rotate-90'
      );
      expect(wrapper.get(showChildrenIconSelector).classes()).toContain(
        'rotate-180'
      );

      await wrapper.get(showChildrenButtonSelector).trigger('click');

      expect(wrapper.get(nodeChildrenWrapperSelector).attributes('style')).toBe(
        'display: none;'
      );
      expect(wrapper.get(showChildrenIconSelector).classes()).toContain(
        'rotate-90'
      );
      expect(wrapper.get(showChildrenIconSelector).classes()).not.toContain(
        'rotate-180'
      );
    });
  });
});
