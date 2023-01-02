<template>
  <div class="p-4 border border-dashed">
    Enter a ship here to begin watching for foundations they publish:
    <form ref="form" @submit.prevent="watch">
      <label for="ship" class="mr-2">
        Ship
        <input id="ship" placeholder="~sampel-palnet" type="text" v-model="ship" />
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
  // TOOD: wait longer?
  // Or get on subscription....
  store.dispatch(ActionTypes.RAMA_SCRY_STATE)
}
</script>
