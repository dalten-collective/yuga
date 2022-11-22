<template>
  <div>
    <div>
      <div v-for="f in foundations" :key="f.foundation.provider">
        <Foundation :provider="f.foundation.provider" :key="f.foundation.provider" />
      </div>
    </div>

    <NewFoundationForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Foundation from '@/components/Foundation.vue'
import NewFoundationForm from '@/components/NewFoundationForm.vue'
import { mapState } from 'vuex';

export default defineComponent({
  mounted() {
    const deskname = "hari"
    this.startAirlock(deskname);
  },
  unmounted() {
    this.closeAirlocks();
  },

  computed: {
    ...mapState("foundationStore", ["foundations"])
  },

  methods: {
    startAirlock(deskname: string) {
      this.$store.dispatch("ship/openAirlockToAgent", deskname);
    },
    closeAirlocks() {
      this.$store.dispatch("ship/closeAgentAirlocks");
    },
  },

  components: {
    NewFoundationForm,
    Foundation
  }
})
</script>


