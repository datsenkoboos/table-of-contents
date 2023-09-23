<template>
  <div class="grow flex">
    <TableOfContents />
    <RouterView />
  </div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import { TableOfContents } from './components/modules';
</script>
