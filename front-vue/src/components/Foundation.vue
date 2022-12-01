<template>
  <div>
    {{ foundation }}
  </div>
</template>

<script setup lang="ts">
import { Foundation, Provider } from '../types';
import { computed } from 'vue';
import { useStore } from 'vuex';

interface Props {
  provider: Provider
}
const props = defineProps<Props>()
const store = useStore()

const getFoundation = (provider: Provider): Foundation => {
  return store.getters["foundationStore/foundationByProvider"](provider)
}

const foundation = computed(() => getFoundation(props.provider))

</script>

