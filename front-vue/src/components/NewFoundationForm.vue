<template>
  <div class="p-2 border rounded-sm dark:border-stone-500">
    <form ref="form" @submit.prevent="create">
      <div class="mb-2">
        Form New Foundation
      </div>
      <div class="flex flex-row items-center">
        <label for="prefix">
          Name
          <input class="focus:ring-0 focus:ring-offset-0" id="prefix" type="text" v-model="prefix" />
        </label>
        <button class="ml-2" type="submit">Create</button>
      </div>
    </form>
  </div>
</template>

<script>

import * as foundationAPI from "@/api/foundationAPI";

export default {
  data() {
    return {
      prefix: '',
    }
  },

  methods: {
    create() {
      if (!this.prefix) {
        return
      }
      // TODO: validate this.$refs
      foundationAPI.createFoundation(this.prefix)
    }
  }
}
</script>
