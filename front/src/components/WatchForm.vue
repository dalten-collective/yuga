<template>
  <div class="p-4 border border-dashed">
    Enter a ship here to begin watching for foundations they publish:
    <form ref="form" @submit.prevent="watch">
      <label for="ship" class="mr-2">
        Ship
        <input id="ship" placeholder="~sampel-palnet" type="text" v-model="ship"
        :disabled="loading" :class="loading ? 'loading' : ''"/>
      </label>
      <button type="submit" :disabled="loading" :class="loading ? 'loading-btn'
      : ''">Watch</button>
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
const loading = ref(false)

const watch = async () => {
  if (!ship) {
    return
  }
  // TODO: validate this.$refs

  loading.value = true
  ramaAPI.startWatching(ship.value)
  .then(() => {
    loading.value = false;
    ship.value = '';
    // store.dispatch(ActionTypes.LOADING_SET, 'ramaListFoundations')
    // store.dispatch(ActionTypes.RAMA_SCRY_STATE, {
    //   cb: {
    //     onSuccess: () => {
    //       ship.value = ''
    //       loading.value = false
    //       store.dispatch(ActionTypes.SUCCESS_SET, 'ramaListFoundations')
    //     },
    //     onError: () => {
    //       loading.value = false
    //       store.dispatch(ActionTypes.ERROR_SET, 'ramaListFoundations')
    //     }
    //   }
    // })
  })
  .catch((e) => {
    console.log('startWatching poke failed: ', e)
    loading.value = false
  })
}
</script>
