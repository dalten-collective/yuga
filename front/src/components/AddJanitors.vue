<template>
  <div>
    <label :for="`newJanitor-${ foundation.name }`">
      Add janitors:
      <input :id="`newJanitor-${ foundation.name }`" type="text" v-model="newJanitors">
      <button @click="addJanitors">Add</button>
    </label>
    {{ newJanitors }}
  </div>
</template>

<script setup lang="ts">
import { StateFoundation } from '../types';
import { defineProps, ref } from 'vue';
// import { useStore } from 'vuex';
import * as T from '@/types'
import * as fAPI from "@/api/foundationAPI";

import { sigShip } from "@/helpers";

interface Props {
  foundation: StateFoundation
}
const props = defineProps<Props>()
// const store = useStore()

const newJanitors = ref('')

const addJanitors = () => {
  if (newJanitors.value === '') {
    return
  }
  const janitorStrings: Array<string> = newJanitors.value
    .split(/,| /)
    .filter((s: string) => s !== "")
  const shipSet = new Set<T.Ship>();
  janitorStrings.forEach((s: string) => shipSet.add(sigShip(s)));
  const janitorShips: Array<T.Ship> = Array.from(shipSet);

  fAPI.addJanitors({
    prefix: props.foundation.name,
    ships: janitorShips,
  })
}

</script>
