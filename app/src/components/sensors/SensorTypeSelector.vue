<template lang="pug">
  .sensor-selector
    dropdown(ref="dropdown" v-bind:class-name="'custom'")
      template(slot="btn") {{ type_name || 'New Type' }}
      //- Select Sensor type
      template(slot="body")
        .sensor-type(@click="selectSensorType(undefined)")
          label New Type
        .sensor-type(slot="body" v-for="(type, index) in types" @click="selectSensorType(type)")
          label {{ type.name }}

</template>

<script>
import Dropdown from "bp-vuejs-dropdown";

export default {
  name: "sensor-type-selector",
  props: ["type", "type_name", "types"],
  components: {
    Dropdown
  },
  methods: {
    selectSensorType(type) {
      this.$emit("update:type", typeof type === "undefined" ? undefined : type);
      this.$emit(
        "update:type_name",
        typeof type === "undefined" ? undefined : type.name
      );
      this.$refs.dropdown.isHidden = true;
    }
  }
};
</script>

<style lang="stylus">

@import '~stylus/shared'

.custom-bp__btn
  border $color-border 1px solid !important
  padding 8px 15px !important

.custom-bp__body
  padding 0 !important
  .sensor-type label
    padding 8px 15px
    &:hover
      background-color $color-lightest-grey
      cursor pointer
</style>
