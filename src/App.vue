<script>
// import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppMain from './components/AppMain.vue';

export default {
  name: 'App',
  components: {
    // RouterView,
    AppHeader,
    AppMain
  }
}
</script>

<template>
  <AppHeader />
  <!-- <RouterView /> -->
  <AppMain />
</template>

<style></style>
