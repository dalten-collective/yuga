<template>
  <div class="p-2 border rounded-sm dark:border-stone-500">
    <form ref="form" @submit.prevent="create">
      <div class="mb-2">
        Form New Foundation
      </div>
      <div class="flex flex-row items-center">
        <label for="prefix">
          Name
          <input class="focus:ring-0 focus:ring-offset-0" id="prefix" type="text" :class="status.loading ? 'loading' : ''" v-model="prefix" :disabled="status.loading" />
        </label>
        <button class="ml-2" :class="status.loading ? 'loading-btn' : ''" :disabled="status.loading" type="submit">{{ status.loading ? 'Creating...' : 'Create' }}</button>
        <div v-if="status.success">
          SUCCESS
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import * as foundationAPI from "@/api/foundationAPI";
import { GetterTypes } from "@/store/getter-types";
import { ActionTypes } from "@/store/action-types";
import { useStore } from "@/store/store";

const store = useStore();

const status = computed(() => {
  return store.getters[GetterTypes.ELEMENT_STATUS_MAP]('foundationCreate')
})

const prefix = ref('')

const create = () => {
  if (!prefix.value) {
    return
  }
  store.dispatch(ActionTypes.LOADING_SET, 'foundationCreate')

  // TODO: validate this.$refs
  foundationAPI.createFoundation(prefix.value).finally(() => {
      prefix.value = '';
    })
}

</script>
