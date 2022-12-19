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

import { useStore } from '@/store/store'
import {ActionTypes} from '@/store/action-types';

const store = useStore()

const ship = ref('')

const watch = async () => {
  if (!ship) {
    return
  }
  // TODO: validate this.$refs
  await ramaAPI.startWatching(ship.value)
  store.dispatch(ActionTypes.RAMA_SCRY_STATE)
}
</script>
