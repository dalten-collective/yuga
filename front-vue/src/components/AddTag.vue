<template>
  <div>
    <label :for="`newTag-${ foundation.name }`">
      Add tag:
      <input :id="`newTag-${ foundation.name }`" type="text" v-model="newTag">
      <button @click="addTag">Add</button>
    </label>
    {{ newTag }}
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

const newTag = ref('')

const addTag = () => {
  if (newTag.value === '') {
    return
  }

  fAPI.addTag({
    prefix: props.foundation.name,
    tag: newTag.value,
  })
}

</script>
