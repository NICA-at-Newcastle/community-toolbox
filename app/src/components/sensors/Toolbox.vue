<template lang="pug">
  #toolbox
    page-header(title="Community Toolbox" subtitle="Find a sensor you would like to use and sign up to borrow it from the toolbox.")
    sensor-filter(v-on:reload="fetchSensors" v-bind:sort-type.sync="sortType" v-bind:current-type.sync="currentType" v-bind:search-query.sync="searchQuery")
    .no-results(v-if="orderedIdeas.length === 0") {{ loading ? 'Loading...' : 'No results' }}
    .row#toolbox-row
      .passcode-block(v-if="currentType && currentType.passcode && (userPasscode !== currentType.passcode)")
        h2 Passcode required
        input(type="text" v-bind:placeholder="currentType.passcode" v-model="userPasscode")
      router-link.content-block.content-block--tile.pull-left(v-else v-for="(sensor, index) in orderedIdeas" v-bind:to="{ name: 'sensor', params: { id: sensor._id } }" tag="div" v-bind:key="index")
        sensor-tile(v-bind:sensor="sensor", v-bind:loans="loans")
      .clearfix
</template>

<script>
import API from "@/api";

import _sortBy from "lodash/sortBy";

import PageHeader from "@/components/PageHeader";
import SensorFilter from "@/components/navigation/SensorFilter";
import SensorTile from "@/components/sensors/SensorTile";

export default {
  name: "toolbox",
  metaInfo: {
    title: "Community Toolbox",
    meta: [{ name: "description", content: "Explore the community toolbox." }]
  },
  components: {
    PageHeader,
    SensorFilter,
    SensorTile
  },
  mounted() {
    this.fetchSensors();
  },
  data() {
    return {
      userPasscode: undefined,
      currentType: undefined,
      sortType: "Recent",
      passcodeRequired: false,
      searchQuery: "",
      sensors: [],
      loading: false,
      loans: []
    };
  },
  computed: {
    orderedIdeas() {
      let sensors = _sortBy(this.sensors, sensor => {
        switch (this.sortType.toLowerCase()) {
          case "recent":
            return sensor.created;
          // case "popular":
          //   return sensor._subscribers.length;
          case "default":
            return sensor.created;
        }
      }).reverse();

      return this.searchQuery.length < 2
        ? sensors
        : sensors.filter(sensor => {
            return (
              sensor.name
                .toLowerCase()
                .indexOf(this.searchQuery.toLowerCase()) > -1
            );
          });
    }
  },
  methods: {
    fetchSensors() {
      const typeId = this.currentType ? this.currentType._id : undefined;
      this.loading = true;
      API.sensor.toolbox(
        typeId,
        response => {
          // Idea success
          this.$log(response);
          if (response.passcodeRequired) {
            this.passcodeRequired = true;
          } else {
            this.sensors = response.data;
          }
          this.fetchLoans();
          // this.loading = false;
        },
        error => {
          // Idea fail
          this.$log(error);
          this.loading = false;
        }
      );
    },
    fetchLoans() {
      API.loan.fetchAll(
        response => {
          this.loans = response.data.loans;
          this.loading = false;
        },
        error => {
          this.$error(error);
          this.loading = false;
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~stylus/shared'

#toolbox
  text-align center
  h1, h2
    reset()
    color $color-text-grey
    font-weight normal

  .no-results
    background white
    color $color-text-grey
    margin 20px auto
    max-width $page-width - 40px
    padding 100px 20px
    @media(max-width: 1040px)
      width calc(100% - 80px)

  .row#toolbox-row
    padding 10px
    max-width $page-width + 20px
    @media(max-width: 1040px)
      margin 0 10px
      padding 10px 0

    .content-block--tile
      box-sizing border-box
      margin 10px
      padding 0
      width calc((100% / 4) - 20px)
      @media(max-width: 860px)
        width calc((100% / 3) - 20px)
      @media(max-width: 640px)
        width calc((100% / 2) - 20px)
      @media(max-width: 380px)
        width calc((100% / 1) - 20px)

    .passcode-block
      background-color $color-warning
      margin 10px
      padding 30px
      h2
        reset()
        color white
        margin-bottom 20px
      input
        border none
        background-color white
        font-size 1.3em
        line-height 50px
        outline 0
        padding 0 20px
        text-align center
</style>
