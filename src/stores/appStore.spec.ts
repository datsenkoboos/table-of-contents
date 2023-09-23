import { setActivePinia, createPinia } from 'pinia';
import useStore from './appStore';
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  afterEach,
  type Mock,
} from 'vitest';
import { DataMock } from '@/mocks';

vi.stubGlobal('fetch', vi.fn());
function createFetchResponse(data: unknown) {
  return { json: () => new Promise((resolve) => resolve(data)) };
}

describe('AppStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  describe('state', () => {
    it('showTableOfContents - should be true', () => {
      const store = useStore();
      expect(store.showTableOfContents).toBe(true);
    });
    it('data - should be empty object', () => {
      const store = useStore();
      expect(store.data).toStrictEqual({});
    });
    it('keysToShowChildren - should be empty array', () => {
      const store = useStore();
      expect(store.keysToShowChildren).toStrictEqual([]);
    });
  });
  describe('actions', () => {
    it('setData - should set data to passed value', () => {
      const store = useStore();
      store.setData(DataMock);

      expect(store.data).toStrictEqual(DataMock);
    });
    it('getNodeByKey - should return node with provided key from data.pages', () => {
      const store = useStore();
      store.data = DataMock;
      const testKey = store.data.rootLevelKeys[0];

      expect(store.getNodeByKey(testKey)).toStrictEqual(
        store.data.pages[testKey]
      );
    });
    it('addKeysToShowChildren - should add provided key to keysToShowChildren', () => {
      const testKey = 'testKey';
      const store = useStore();
      store.addKeysToShowChildren(testKey);

      expect(store.keysToShowChildren).toStrictEqual([testKey]);
    });
    it('init without initialKey passed - should fetch from valid url, set returned data, should not call addKeysToShowChildren', async () => {
      (fetch as Mock).mockResolvedValue(createFetchResponse(DataMock));

      const store = useStore();
      vi.spyOn(store, 'setData');
      vi.spyOn(store, 'addKeysToShowChildren');

      await store.init();

      expect(fetch).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        'https://prolegomenon.s3.amazonaws.com/contents.json'
      );

      expect(store.setData).toHaveBeenCalled();
      expect(store.setData).toHaveBeenCalledWith(DataMock);

      expect(store.addKeysToShowChildren).not.toHaveBeenCalled();
    });
    it('init with initialKey passed - should fetch from valid url, set returned data, call addKeysToShowChildren with valid keys', async () => {
      (fetch as Mock).mockResolvedValue(createFetchResponse(DataMock));
      const testKey = 'nested_node';
      const store = useStore();
      vi.spyOn(store, 'setData');
      vi.spyOn(store, 'addKeysToShowChildren');

      await store.init(testKey);

      expect(fetch).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        'https://prolegomenon.s3.amazonaws.com/contents.json'
      );

      expect(store.setData).toHaveBeenCalled();
      expect(store.setData).toHaveBeenCalledWith(DataMock);

      expect(store.addKeysToShowChildren).toHaveBeenCalled();
      let node = store.getNodeByKey(testKey);
      const parentKeys = [];
      parentKeys.push(node.key);
      for (let i = node.level; i > 0; i--) {
        const parentKey = node.parentKey!;
        parentKeys.push(parentKey);
        node = store.getNodeByKey(parentKey);
      }
      for (let key of parentKeys) {
        expect(store.addKeysToShowChildren).toHaveBeenCalledWith(key);
      }
      expect(store.addKeysToShowChildren).toHaveBeenCalledTimes(
        parentKeys.length
      );
      expect(store.keysToShowChildren).toStrictEqual(parentKeys);
    });
  });
});
