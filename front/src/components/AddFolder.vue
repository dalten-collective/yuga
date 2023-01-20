<template>
  <div>
    <label :for="`newFolder-${ foundation.name }`">
      Add folder:
      <input :id="`newFolder-${ foundation.name }`" type="text" v-model="newFolder">
      <button @click="addFolder">Add</button>
    </label>
    {{ newFolder }}
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

const newFolder = ref('')

const addFolder = () => {
  if (newFolder.value === '') {
    return
  }

  fAPI.addFolder({
    prefix: props.foundation.name,
    folder: newFolder.value,
  })
}

</script>
