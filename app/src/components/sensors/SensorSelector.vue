<template lang="pug">
  .sensor-selector
    dropdown(ref="dropdown" v-bind:class-name="'custom'")
      template(slot="btn") {{ sensor_name || 'No Sensor' }}
      //- Select Sensor
      template(slot="body")
        .sensor(@click="selectSensor(undefined)")
          label No Sensor
        .sensor(slot="body" v-for="(sensor, index) in categories" @click="selectSensor(sensor)")
          label {{ sensor.name }}

</template>

<script>
import Dropdown from "bp-vuejs-dropdown";

export default {
  name: "sensor-selector",
  props: ["sensor", "sensor_name", "categories"],
  components: {
    Dropdown
  },
  methods: {
    selectSensor(sensor) {
      this.$emit(
        "update:sensor",
        typeof sensor === "undefined" ? undefined : sensor._id
      );
      this.$emit(
        "update:sensor_name",
        typeof sensor === "undefined" ? "No Sensor" : sensor.name
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
  .sensor label
    padding 8px 15px
    &:hover
      background-color $color-lightest-grey
      cursor pointer
</style>
