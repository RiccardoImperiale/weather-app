<script>
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
// import AppModal from './components/AppModal.vue';

export default {
  name: 'App',
  components: {
    RouterView,
    AppHeader,
    // AppModal
  }
}
</script>

<template>
  <AppHeader />
  <RouterView />
  <!-- <AppModal /> -->
</template>

<style></style>
