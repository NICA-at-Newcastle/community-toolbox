<template lang="pug">
.tab-content--sensors

  h1.tab--header.no-parent
    .tab--header--title Manage
    .tab--header--action(@click="viewSensors")
      span(v-show="viewingSensors") #[i.fas.fa-angle-up]
      span(v-show="!viewingSensors") #[i.fas.fa-angle-down]

  .tab--content(v-if="viewingSensors")

    p(v-if="sensors.length === 0") No sensors created

    .sensors-wrapper(v-else)
      router-link.sensor-tile(tag="div" v-for="(sensor, index) in sensors" v-bind:key="index" v-bind:to="{ name: 'explore', params: { sensor: sensor.tag } }")
        .sensor-name Name: {{ sensor.name }}
        .sensor-tag Tag: {{ sensor.tag }}

  h1.tab--header.no-parent
    .tab--header--title Add new
    .tab--header--action(@click="addSensor")
      span(v-show="addingSensor") #[i.fas.fa-angle-up]
      span(v-show="!addingSensor") #[i.fas.fa-angle-down]

  .tab--content(v-if="addingSensor")
    .tab-section--body
      create-sensor(v-on:createdSensor="sensorCreated")
    
</template>

<script>
import API from "@/api";

import CreateSensor from "@/components/sensors/CreateSensor";

export default {
  name: "sensors-tab",
  props: ["currentUser"],
  components: {
    CreateSensor
  },
  created() {
    this.fetchSensors();
  },
  data() {
    return {
      sensors: [],
      addingSensor: true,
      viewingSensors: false
    };
  },
  methods: {
    sensorCreated() {
      this.viewingSensors = true;
      this.addingSensor = false;
      this.fetchSensors();
    },
    viewSensors() {
      this.viewingSensors = !this.viewingSensors;
    },
    addSensor() {
      this.addingSensor = !this.addingSensor;
    },
    fetchSensors() {
      API.sensor.fetchSensors(
        response => {
          // Idea success
          this.$log(response);
          this.sensors = response.data;
        },
        error => {
          // Idea fail
          this.$log(error);
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.tab-content--sensors
  text-align left
  .tab--content
    padding 25px
    p
      reset()
    .sensors-wrapper
      .sensor-tile
        animate()
        background-color $color-lightest-grey
        display block
        margin-bottom 10px
        padding 20px
        text-decoration none
        .sensor-name
          color $color-text-darkest-grey
          text-decoration none
        .sensor-tag
          color $color-text-grey
          text-decoration none
        &:hover
          background-color darken($color-lightest-grey, 5%)
          cursor pointer
</style>
