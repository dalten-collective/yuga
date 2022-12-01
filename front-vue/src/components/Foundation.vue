<template>
  <div>
    {{ foundation }}
  </div>
</template>

<script setup lang="ts">
import { Foundation, Provider } from '../types';
import { computed } from 'vue';
import { useStore } from '../store/store';

interface Props {
  provider: Provider
}
const props = defineProps<Props>()
const store = useStore()

const foundation = computed(() => store.getters.foundationByProvider(props.provider))
console.log('found ', props.provider, foundation)
</script>

