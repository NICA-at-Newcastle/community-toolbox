<template lang="pug">
.design-task--map
  p.design-task--description(v-if="task && task.description") {{ task.description }}

  splash-messages(v-if="!isAuthenticated" v-bind:messages="[{type:'success',text:'Please login to participate!'}]")

  .map-wrapper(v-bind:class="{ authenticated: isAuthenticated }")
    
    l-map(style="height: 100%" :zoom="zoom" :center="center" ref="mymap" @click="addMarker" v-bind:style="[ addingMarkers  ? {cursor: 'crosshair'} : {cursor: 'grab'}]")      
      l-tile-layer(:url="url" :attribution="attribution")
      l-control-fullscreen(position="topleft")
      l-marker(v-for="marker, index in markers" v-bind:key="index" :lat-lng="marker" @click="openModal(index)")
      l-control(:position="'topright'")
      map-modal(v-if="modalOpen" v-bind:marker="newMarker" v-bind:idea="idea" v-bind:response="currentResponse" v-on:submit="submitResponse" v-on:close="closeModal()" v-bind:task="task")
  .controls(v-if="isAuthenticated && !modalOpen")      
    .btn.btn-rounded.full-width.btn-success(v-if="!addingMarkers" @click="addMarkers") Add Marker
    .btn.btn-rounded.full-width.btn-danger(v-if="addingMarkers && !modalOpen" @click="addMarkers") Cancel
  .clearfix
</template>

<script>
import { mapGetters } from "vuex";
import API from "@/api";

import { latLng } from "leaflet";
import { LMap, LTileLayer, LControl, LMarker } from "vue2-leaflet";
import LControlFullscreen from "vue2-leaflet-fullscreen";

import MapModal from "@/components/design/components/MapModal";
import DesignTask from "@/mixins/DesignTask";

export default {
  name: "mapping",
  mixins: [DesignTask],
  created() {
    this.fetchResponses();
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControl,
    LControlFullscreen,
    MapModal
  },
  data() {
    return {
      currentResponse: undefined,
      newMarker: undefined,
      responses: [],
      zoom: 13,
      center: latLng(54.97334964579403, -1.6244167636492612),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      markers: [],
      addingMarkers: false,
      fullscreen: false,
      modalOpen: false,
      map: undefined
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.map = this.$refs.mymap.mapObject;
      this.$refs.mymap.mapObject.on("fullscreenchange", () => {
        if (this.$refs.mymap.mapObject.isFullscreen()) {
          this.fullscreen = true;
        } else {
          this.fullscreen = false;
        }
      });
    });
  },
  computed: {
    ...mapGetters(["isAuthenticated"])
  },
  methods: {
    addMarkers() {
      this.addingMarkers = !this.addingMarkers;
    },
    openModal(index) {
      if (this.addingMarkers) return;
      this.currentResponse = this.responses[index];
      this.modalOpen = true;
      this.map.scrollWheelZoom.disable();
    },
    closeModal(index) {
      this.currentResponse = undefined;
      this.modalOpen = false;
      this.map.scrollWheelZoom.enable();
    },
    addMarker(event) {
      if (this.addingMarkers && !this.modalOpen) {
        this.modalOpen = true;
        this.newMarker = event.latlng;
      }
    },
    fetchResponses() {
      API.task.fetchResponses(
        "map",
        this.$route.params.task_id,
        response => {
          this.$log(response);
          this.responses = response.data;
          this.markers = this.responses.map(response => {
            return response.response;
          });
          let lmarkers = this.markers.map(latLng => {
            return L.marker(latLng);
          });
          let markergroup = new L.featureGroup(lmarkers);
          this.map.fitBounds(markergroup.getBounds());
        },
        error => {
          this.$log(error);
        }
      );
    },
    submitResponse(response) {
      if (!this.isAuthenticated) return;
      this.addingMarkers = false;
      API.task.submitResponse(
        "map",
        this.$route.params.task_id,
        { response },
        response => {
          this.$log(response);
          // this.responses.push(response.data)
          this.currentResponse = undefined;
          this.newMarker = undefined;
          this.fetchResponses();
        },
        error => {
          this.$log(error);
          this.currentResponse = undefined;
          this.newMarker = undefined;
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.design-task--map
  background-color white
  padding 25px
  .map-wrapper
    position relative
    width 100%
    height 0
    padding-bottom 75%
    margin-bottom: 20px
    .vue2leaflet-map
      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0
    .map-overlay
      position: absolute
      left: 0
      right: 0
      top: 0
      bottom: 0
      height: 100%
      z-index: 1400
</style>
