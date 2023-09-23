<template>
  <div class="min-w-[300px] border-r-[2px]">
    <nav
      class="fixed w-[300px] max-h-[100dvh] pr-5 pl-4 pt-4 pb-8 overflow-y-scroll"
    >
      <ContentNode
        v-for="rootKey in appStore.data.rootLevelKeys"
        :key="rootKey"
        :content-key="rootKey"
        data-testid="rootNode"
      />
    </nav>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useAppStore } from '@/stores';
import { ContentNode } from './components';
import router from '@/router';
import { useRoute } from 'vue-router';

const route = useRoute();
const appStore = useAppStore();
onBeforeMount(async () => {
  await router.isReady();
  const routeKey = route.fullPath.split('-').join('_').slice(1);
  appStore.init(routeKey);
});
</script>
