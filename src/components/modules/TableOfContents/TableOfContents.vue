<template>
  <div
    class="border-r-[2px]"
    :class="appStore.showTableOfContents ? 'min-w-[300px]' : 'min-w-[40px]'"
    data-testid="tableOfContents"
  >
    <div
      class="fixed h-[100dvh] overflow-y-scroll"
      :class="
        appStore.showTableOfContents
          ? 'w-[300px] pr-5 pl-4 pb-8 pt-8'
          : 'w-[40px]'
      "
    >
      <button
        class="text-[22px] text-[var(--color-link)] hover:text-black"
        :class="
          appStore.showTableOfContents
            ? 'absolute top-4 right-5'
            : 'pt-4 h-full w-full flex justify-center hover:bg-gray-200'
        "
        @click="appStore.toggleTableOfContents()"
        data-testid="toggleButton"
      >
        <Icon
          :icon="
            appStore.showTableOfContents
              ? 'material-symbols:close-rounded'
              : 'material-symbols:menu-rounded'
          "
          data-testid="toggleIcon"
        />
      </button>
      <nav v-show="appStore.showTableOfContents">
        <ContentNode
          v-for="rootKey in appStore.data.rootLevelKeys"
          :key="rootKey"
          :content-key="rootKey"
          data-testid="rootNode"
        />
      </nav>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useAppStore } from '@/stores';
import ContentNode from './components/ContentNode.vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';

const route = useRoute();
const appStore = useAppStore();
onBeforeMount(async () => {
  await router.isReady();
  const routeKey = route.fullPath.split('-').join('_').slice(1);
  appStore.init(routeKey);
});
</script>
<style lang="scss">
.slide-enter-active {
  transition: transform 0.3s;
}

.slide-leave-active {
  transition: transform 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.slide-leave-from,
.slide-enter-to {
  transform: translateX(0);
}
</style>
