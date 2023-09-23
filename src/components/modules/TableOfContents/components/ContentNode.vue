<template>
  <div
    class="my-1 text-sm text-[var(--color-link)]"
    :class="route.fullPath.includes(nodePage) ? 'font-bold' : 'font-semibold'"
    ref="currentNode"
    :data-testid="contentKey"
  >
    <div class="flex gap-1.5 items-start">
      <button
        @click="showChildren = !showChildren"
        v-if="node.childPageKeys"
        class="h-5 hover:text-black transition-all"
        data-testid="showChildrenButton"
      >
        <Icon
          icon="teenyicons:triangle-solid"
          class="text-[10px]"
          :class="showChildren ? 'rotate-180' : 'rotate-90'"
          data-testid="showChildrenIcon"
        />
      </button>
      <RouterLink
        @click="showChildren = true"
        :to="nodePage"
        :class="
          route.fullPath.includes(nodePage)
            ? 'text-[var(--color-link-active)]'
            : 'hover:text-[var(--color-link-active)]'
        "
        data-testid="nodeLink"
        >{{ node.name }}</RouterLink
      >
    </div>
    <div
      v-if="node.childPageKeys && showChildren"
      class="pl-6"
      data-testid="nodeChildrenWrapper"
    >
      <ContentNode
        v-for="childKey in node.childPageKeys"
        :key="childKey"
        :content-key="childKey"
        data-testid="childNode"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useAppStore } from '@/stores';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRoute, RouterLink } from 'vue-router';

const route = useRoute();
const appStore = useAppStore();
const props = defineProps<{
  contentKey: string;
}>();

let node = appStore.data.pages[props.contentKey];
const nodePage = node.link.slice(0, -5);

const showChildren = ref(false);
const currentNode = ref<HTMLDivElement>();

onBeforeMount(() => {
  if (appStore.keysToShowChildren.includes(props.contentKey)) {
    showChildren.value = true;
  }
});
onMounted(() => {
  if (route.fullPath.includes(nodePage)) {
    currentNode.value!.scrollIntoView();
  }
});
</script>
