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

      .sensor-tile(tag="div" v-for="(sensor, index) in sensors" v-bind:key="index")
        .delete-button(@click="removeSensor($event, sensor._id)")
          i.fas.fa-trash                
        .sensor-name Name: {{ sensor.name }}
        .sensor-type Sensor type: {{ sensor._type.name }}
        .sensor-tag Tag: {{ sensor.tag }}
        //- .sensor-loan Loaned out: {{sensor.loaned ? 'yes' : 'no' }}   
        .sensor-enabled #[input(type="checkbox" name="enabled" v-model="sensor.enabled" @change="updateSensor($event, sensor)")]
          label(for="enabled") Enabled
        .sensor-description(v-html="sensor.description")         
        .image-wrapper
          router-link(v-bind:to="{ name: 'sensor', params: { id: sensor._id} }")
            sensor-image(v-bind:sensor="sensor")        

  h1.tab--header.no-parent(@click="addSensor")
    .tab--header--title Add new
    .tab--header--action
      span(v-show="addingSensor") #[i.fas.fa-angle-up]
      span(v-show="!addingSensor") #[i.fas.fa-angle-down]

  .tab--content(v-if="addingSensor")
    .tab-section--body
      create-sensor(v-on:createdSensor="sensorCreated")
  
  manage-loans
</template>

<script>
import API from "@/api";

import CreateSensor from "@/components/sensors/CreateSensor";
import SensorImage from "@/components/sensors/SensorImage";
import ManageLoans from "@/components/user/admin/ManageLoans";

export default {
  name: "sensors-tab",
  props: ["currentUser"],
  components: {
    CreateSensor,
    SensorImage,
    ManageLoans
  },
  created() {
    this.fetchSensors();
  },
  data() {
    return {
      sensors: [],
      managingLoans: true,
      addingSensor: false,
      viewingSensors: false
    };
  },
  methods: {
    // available(id) {
    //   // const sensorLoans = this.loans.filter(loan => {
    //   //   return loan._target === id;
    //   // });
    //   let tomorrow = new Date();
    //   tomorrow.setDate(tomorrow.getDate() + 1);
    //   const available = this.loans.reduce(function(available, loan) {
    //     if (loan._target !== id) return available;
    //     return tomorrow.getTime() >= new Date(loan.start).getTime() &&
    //       tomorrow.getTime() <= new Date(loan.end).getTime()
    //       ? false
    //       : available;
    //     return available;
    //   }, true);
    //   this.sensor.loaned = !available;
    //   return available;
    // },
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
          this.$error(error);
        }
      );
    },
    updateSensor(e, sensor) {
      e.stopPropagation();
      console.log(sensor.enabled);
      API.sensor.update(
        sensor,
        response => {
          this.$log(response);
          this.fetchSensors();
        },
        error => {
          this.$error(error);
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
          color $color-danger
          text-decoration none
        .sensor-description
          white-space nowrap
          overflow hidden
          max-height 50px
          max-width 500px
        &:hover
          background-color darken($color-lightest-grey, 5%)
      .image-wrapper
        margin 0 auto
        padding 10px 40px 20px 40px
        max-width 120px
        &:hover
          cursor pointer
      .sensor-enabled
        &:hover
          cursor pointer
</style>
