<template lang="pug">
.design-task--sensor
  p.design-task--description(v-if="task.description") {{ task.description }}

  splash-messages(v-if="!isAuthenticated" v-bind:messages="[{type:'success',text:'Please login to participate!'}]")

  .sensor-wrapper(v-bind:class="{ authenticated: isAuthenticated }")
    iframe(v-bind:src="`https://docs.google.com/forms/d/e/1FAIpQLScTm9xWlrxPP-44TxSJXWSkJ2afcSlXtRpyCSGoOGQ4ZZu3Yw/viewform?embedded=true`" frameborder="0" width="100%" height="600")
</template>

<script>
import { mapGetters } from "vuex";

import DesignTask from "@/mixins/DesignTask";

export default {
  name: "sensor",
  mixins: [DesignTask],
  computed: {
    ...mapGetters(["isAuthenticated"])
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.design-task--sensor
  background-color white
  padding 25px
  .sensor-wrapper
    position relative
    width 100%
    height 0
    padding-bottom 75%
    pointer-events none
    &.authenticated
      pointer-events all
    iframe
      border none
      position absolute
      width 100%
      height 100%
      left 0
      top 0
</style>
