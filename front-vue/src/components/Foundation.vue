<template>
  <div>
    {{ foundation }}
  </div>
</template>

<script setup lang="ts">
import { Foundation, Provider } from "../types";
import { computed } from "vue";
import { useStore } from "../store/store";
import { GetterTypes } from "@/store/getter-types";

interface Props {
  provider: Provider;
}
const props = defineProps<Props>();
const store = useStore();

const foundation = computed(() =>
  store.getters[GetterTypes.FOUNDATION_BY_PROVIDER](props.provider)
);
</script>
