<template lang="pug">
.tab-content--sensors
  h1.tab--header.no-parent(@click="viewSensors")
    .tab--header--title Manage
    .tab--header--action
      span(v-show="viewingSensors") #[i.fas.fa-angle-up]
      span(v-show="!viewingSensors") #[i.fas.fa-angle-down]

  .tab--content(v-if="viewingSensors")

    p(v-if="sensors.length === 0") No sensors created

    .sensors-wrapper(v-else)

      router-link.sensor-tile(tag="div" v-for="(sensor, index) in sensors" v-bind:key="index" v-bind:to="{ name: 'toolbox', params: { typeId: sensor._type._id} }")
        .delete-button(@click="removeSensor($event, sensor._id)")
          i.fas.fa-trash
        .sensor-name Name: {{ sensor.name }}
        .sensor-type Sensor type: {{ sensor._type.name }}
        .sensor-tag Tag: {{ sensor.tag }}
        .sensor-loan Loaned out: {{sensor.loaned ? 'yes' : 'no' }}   
        .sensor-description Description: {{ sensor.description }}             
        .image-wrapper
          sensor-image(v-bind:sensor="sensor")

  h1.tab--header.no-parent(@click="addSensor")
    .tab--header--title Add new
    .tab--header--action
      span(v-show="addingSensor") #[i.fas.fa-angle-up]
      span(v-show="!addingSensor") #[i.fas.fa-angle-down]

  .tab--content(v-if="addingSensor")
    .tab-section--body
      create-sensor(v-on:createdSensor="sensorCreated")
    
</template>

<script>
import API from "@/api";

import CreateSensor from "@/components/sensors/CreateSensor";
import SensorImage from "@/components/sensors/SensorImage";

export default {
  name: "sensors-tab",
  props: ["currentUser"],
  components: {
    CreateSensor,
    SensorImage
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
    removeSensor(e, sensor_id) {
      e.stopPropagation();
      API.sensor.destroy(
        { id: sensor_id },
        response => {
          this.$log(response);
          this.fetchSensors();
        },
        error => {
          this.$log(error);
        }
      );
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
  .tab--header
    cursor pointer
  .tab--content
    padding 25px
    p
      reset()
    .sensors-wrapper
      .delete-button
        float right
        animate()
        color $color-text-light-grey
        font-size 0.8em
        svg
          height 25px
        &:hover
          cursor pointer
          color $color-danger
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
      .image-wrapper
        margin 0 auto
        padding 10px 40px 20px 40px
        max-width 120px
        &:hover
          cursor pointer
</style>
