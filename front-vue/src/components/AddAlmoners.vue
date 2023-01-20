<template>
  <div>
    <label :for="`newAlmoner-${ foundation.name }`">
      Add almoner:
      <input :id="`newAlmoner-${ foundation.name }`" type="text" v-model="newAlmoners">
      <button @click="addAlmoners">Add</button>
    </label>
    {{ newAlmoners }}
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

const newAlmoners = ref('')

const addAlmoners = () => {
  if (newAlmoners.value === '') {
    return
  }
  const almonerStrings: Array<string> = newAlmoners.value
    .split(/,| /)
    .filter((s: string) => s !== "")
  const shipSet = new Set<T.Ship>();
  almonerStrings.forEach((s: string) => shipSet.add(sigShip(s)));
  const almonerShips: Array<T.Ship> = Array.from(shipSet);

  fAPI.addAlmoners({
    prefix: props.foundation.name,
    ships: almonerShips,
  })
}

</script>
