<template>
  <div>
    Start watching
    <form ref="form" @submit.prevent="watch">
      <label for="ship">
        Ship
        <input id="ship" type="text" v-model="ship" />
      </label>
      <button type="submit">Watch</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import * as ramaAPI from "@/api/ramaAPI";
import { ref } from 'vue';

const ship = ref('')

const watch = () => {
  if (!ship) {
    return
  }
  // TODO: validate this.$refs
  ramaAPI.startWatching(ship.value)
}
</script>
