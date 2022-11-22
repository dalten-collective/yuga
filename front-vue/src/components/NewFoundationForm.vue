<template>
  <div>
    New Foundation
    <form ref="form" @submit="create">
      <label for="prefix">
        Prefix
        <input id="prefix" type="text" v-model="prefix" />
      </label>
      <button type="submit">Create</button>
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
