<template lang="pug">
  .manage-sensors
    h1.tab--header.no-parent
      .tab--header--title Manage Sensors
      .tab--header--action(@click="expanded = !expanded")
        span(v-show="expanded") #[i.fas.fa-angle-up]
        span(v-show="!expanded") #[i.fas.fa-angle-down]
    
    .tab--content(v-if="expanded")      
      p        
        a(href='https://docs.google.com/forms/d/1hwj0oBIkmkB8i3hW4xXL8CmWHJNgkIcari628VvbH0A/edit') Click Here
        |  to Manage Sensor Loan Form (Requires Google Login)
      p
        a(href='https://docs.google.com/spreadsheets/d/1aKePG2yHd9qT1JPJbB1CUzQAC2dqBOJdX4sJkkuzfY8/edit') Click Here
        |  to Manage Sensor Loans (Requires Google Login)

</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "your-permissions",
  data() {
    return {
      expanded: false
    };
  }
  // computed: {
  //   ...mapGetters(['user'])
  // }
};
</script>

<style lang="stylus" scoped>
@import '~stylus/shared'
</style>
