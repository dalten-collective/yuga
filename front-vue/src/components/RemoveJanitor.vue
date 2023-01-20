<template>
  <div>
    <button class="px-2 py-1 border rounded-md" @click="removeJanitor">Remove</button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import * as T from '@/types'
import * as fAPI from "@/api/foundationAPI";

import { sigShip } from "@/helpers";

interface Props {
  foundation: T.StateFoundation,
  janitor: T.Ship
}
const props = defineProps<Props>()

const removeJanitor = () => {
  fAPI.removeJanitors({
    prefix: props.foundation.name,
    ships: [props.janitor],
  })
}

</script>
