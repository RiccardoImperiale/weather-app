<script>
import AppHeader from './components/AppHeader.vue';
import AppMain from './components/AppMain.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppMain
  },
  data() {
    return {
      saveLocation: false
    }
  },
  methods: {
    callback() {
      this.saveLocation = true
    }
  }
}
</script>

<template>
  <AppHeader @custom-event="callback" />
  <AppMain :saveLocation="saveLocation" />
</template>

<style></style>
