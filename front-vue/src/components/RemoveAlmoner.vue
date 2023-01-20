<template>
  <div>
    <button class="px-2 py-1 border rounded-md" @click="removeAlmoner">Remove</button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import * as T from '@/types'
import * as fAPI from "@/api/foundationAPI";

import { sigShip } from "@/helpers";

interface Props {
  foundation: T.StateFoundation,
  almoner: T.Ship
}
const props = defineProps<Props>()

const removeAlmoner = () => {
  fAPI.removeAlmoners({
    prefix: props.foundation.name,
    ships: [props.almoner],
  })
}

</script>
