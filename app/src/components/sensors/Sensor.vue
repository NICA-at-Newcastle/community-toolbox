<template lang="pug">
  #sensor(v-bind:class="{ maximised: maximised }")
    page-header(v-if="sensor" v-bind:title.sync="sensor.name" v-bind:subtitle="`${sensor._type.name} sensor`")
    page-header(v-else title="Loading" subtitle="Please wait just a moment...")
    .row(v-if="sensor")
      loan-modal(v-if="isBooking", v-bind:sensor="sensor" v-bind:loan="loan" v-on:booked="resetLoan" v-on:close="isBooking=false")
      .content-block.content-block--side.pull-up.pull-right.white-block
        .content-block--body   
          calendar-card(v-bind:loan.sync="loan" v-bind:loans.sync="loans")
        .content-block--footer                    
          //- loan-booking(v-bind:sensor="sensor" v-bind:loan="loan" v-on:booked="resetLoan" v-on:reset="resetLoan")
          .booking-button.btn(@click="bookLoan" :class="{ active: loan}")      
            span {{ isBooking ? 'One moment..' : 'Book' }}          
          //- sensor-actions(v-if="isAdmin" v-bind:sensor="sensor")          
          

      .content-block.content-block--main.pull-up.pull-left
        .content-block--banner(v-if="sensor.image" v-bind:style="sensor.image | resize('720', '200') | background")
        .tabs
          .tabs--selector
            .clearfix
          .tabs--page
            .tab-content--info
              .tab--content
                .ql-container.ql-bubble.ql-editor(v-if="!editing" v-html="sensor.description") 
                .edit-view(v-if="editing")
                  .input-wrapper
                    label Title
                    input(v-if="editing" v-model="editedSensor.name")
                  
                  .input-wrapper
                    quill-editor(v-if="editing" v-model="editedSensor.description" ref="myQuillEditor" v-bind:options="editorOption")

                .info-actions(v-if="isAdmin")
                  .btn-fab(@click="toggleEditing" v-bind:class="[editing ? 'btn-danger' : 'btn-grey']")
                    span(v-show="!editing")
                      i.fas.fa-pencil-alt
                    span(v-show="editing")
                      i.fas.fa-undo
                  .btn-fab.btn-success(v-show="editing" @click="updateSensor")
                    i.fas.fa-check

            .tab--footer
              calendar-card(v-bind:loan.sync="loan" v-bind:loans.sync="loans")
              //- loan-booking(v-bind:sensor="sensor" v-bind:loan="loan" v-on:booked="resetLoan" v-on:reset="resetLoan")          
              .booking-button.btn(@click="bookLoan" :class="{ active: loan}")      
                span {{ isBooking ? 'One moment..' : 'Book' }}              
      .clearfix
</template>

<script>
import API from "@/api";
import { mapGetters } from "vuex";
import * as types from "@/store/mutation-types";
import _get from "lodash/get";

import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

import IdeaActions from "@/components/admin/IdeaActions";
import PageHeader from "@/components/PageHeader";
import CalendarCard from "@/components/sensors/CalendarCard";
import LoanModal from "@/components/sensors/LoanModal";

export default {
  name: "sensor",
  metaInfo() {
    return {
      title: this.sensor && this.sensor.name ? this.sensor.name : "Sensor",
      meta: [
        {
          p: "og:title",
          c: this.sensor && this.sensor.name ? this.sensor.name : "Sensor"
        },
        {
          p: "og:image",
          c: this.sensor && this.sensor.image ? this.sensor.image : ""
        }
      ]
    };
  },
  props: ["id"],
  components: {
    quillEditor,
    IdeaActions,
    PageHeader,
    CalendarCard,
    LoanModal
  },
  created() {
    this.loadSensor();
  },
  data() {
    return {
      editing: false,
      isBooking: false,
      editedSensor: {
        name: undefined,
        description: undefined
      },
      editorOption: {
        // theme: "bubble",
        placeholder: "Describe the sensor in more detail",
        readOnly: false,
        scrollingContainer: false,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }, "link", "t"]
          ]
        }
      },
      maximisedView: false,
      sensor: undefined,
      tabs: {
        items: [{ title: "About", route: "sensor", component: "info-tab" }]
      },
      loans: undefined,
      loan: undefined
    };
  },
  computed: {
    ...mapGetters(["isAdmin", "isAuthenticated"]),
    maximised() {
      const maximisedViews = ["outcomedocument"];
      return maximisedViews.indexOf(this.$route.name) !== -1;
    },
    ownIdea() {
      return (
        _get(this.sensor, "_user._id") ===
        _get(this.sensor._user, "_id", "anonymous")
      );
    },
    getSensorName() {
      return this.sensor.name;
    }
  },
  methods: {
    loadSensor() {
      API.sensor.view(
        this.$route.params.id,
        response => {
          // Idea success
          this.$log(response.data.sensor);
          this.sensor = response.data.sensor;
          this.fetchLoans();
        },
        error => {
          // Idea fail
          this.$log(error);
        }
      );
    },
    fetchLoans() {
      API.loan.fetch(
        { target: this.sensor._id },
        response => {
          // loan fetch success
          this.$log(response.data);
          this.loans = response.data;
        },
        error => {
          // Idea fetch fail
          this.$log(error);
        }
      );
    },
    bookLoan() {
      if (!this.isAuthenticated) {
        this.$store.commit(types.SHOW_AUTH_MODAL);
      } else {
        if (this.isBooking) return;

        this.isBooking = true;
      }
    },
    resetLoan() {
      this.loan = undefined;
      this.isBooking = false;
      this.fetchLoans();
    },
    getNotificationCount(route) {
      switch (route) {
        case "design":
          // Return the total number of tasks
          return this.sensor._tasks.length;
        default:
          return 0;
      }
    },
    toggleEditing() {
      this.editing = !this.editing;
      this.editedSensor.name = this.sensor.name;
      this.editedSensor.description = this.sensor.description;
    },
    viewDesign() {
      this.$emit("show-design");
    },
    updateSensor() {
      API.sensor.update(
        {
          _id: this.$route.params.id,
          name: this.editedSensor.name,
          description: this.editedSensor.description
        },
        response => {
          this.$log(response);
          this.sensor = response.data.sensor;
          this.editing = false;
          // this.$emit("update:sensor", response.data.sensor);
        },
        error => {
          this.$error(error);
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

#sensor
  text-align center
  h1, h2
    reset()
    color $color-text-grey
    font-weight normal
  .content-block--side
    animate()
    position absolute
    right 0
    margin-bottom 40px
    width 320px
    .content-block--footer
      border-top none
      padding-top 0
    @media(max-width: 680px)
      display none
  .content-block--main
    animate()
    margin-bottom 40px
    width calc(100% - 340px)
    .content-block--banner
      animate()
      background-image(white)
      height 200px
    @media(max-width: 680px)
      width 100%
      .content-block--banner
        height 140px
    .tab-content--info
      background-color white
      text-align left
      .tab--content
        padding 15px
        padding-bottom 60px
        position relative
        .ql-container
          min-height 46px
        p
          reset()
        .info-actions
          bottom 15px
          right 15px
          position absolute
          .btn-fab
            radius(50%)
            float left
            height 40px
            margin 5px
            width 40px
            text-align center
            &:hover
              cursor pointer
            svg
              color white
              height 40px
              width 20px

  .tab--footer
    display none
    // border-top none !important
    padding 20px
    @media(max-width: 680px)
      display block
  .booking-button
    radius(30px)
    margin-top 5px
    pointer-events none
    background-color $color-lighter-grey
    position relative
    text-align center
    max-width 100%
    z-index 1
    &:hover
      background-color darken($color-primary, 10%)
    &.active
      background-color $color-primary
      pointer-events all
    &.subscribed
      background-color $color-success
      &.active, &:hover
        background-color darken($color-success, 10%)

  &.maximised
    .content-block--side
      transform scale(0.8)
      opacity 0
    .content-block--main
      width 100%
      .content-block--banner
        height 0

 // Edit mode
 .quill-editor
    border-left $color-primary 3px solid
    padding 0
</style>
