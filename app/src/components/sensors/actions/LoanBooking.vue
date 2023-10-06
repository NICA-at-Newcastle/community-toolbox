<template lang="pug">
  #loan-booking
    //- .btn.btn-danger-subtle(@click="reset") Reset     
    .btn(@click="bookLoan" :class="{ active: hasDates, subscribed: isSubscribed }")
      //- span(v-if="isSubscribed") {{ isBooking ? 'One moment..' : 'Booked' }}
      span {{ isBooking ? 'One moment..' : 'Book' }}
    loan-modal(v-if="isBooking", v-bind:sensor="sensor" v-bind:loan="loan" v-bind:booked="$emit('booked')")
</template>

<script>
import Vue from "vue";

import API from "@/api";
import { mapGetters } from "vuex";
import * as types from "@/store/mutation-types";

import LoanModal from "@/components/sensors/LoanModal";

import _find from "lodash/find";

export default {
  name: "loan-booking",
  props: ["sensor", "loan"],
  components: { LoanModal },
  created() {
    this.shareLink = window.location.href;
  },
  data() {
    return {
      shareLink: "",
      isBooking: false
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "user"]),
    isSubscribed() {
      if (!this.isAuthenticated) return false;
      if (!this.user) return false;
      return _find(this.sensor._subscribers, subscriber => {
        this.$log(subscriber);
        if (!subscriber._user) return false;
        return subscriber._user._id === this.user._id;
      });
    },
    hasDates() {
      return this.loan;
    }
  },
  methods: {
    bookLoan() {
      if (!this.isAuthenticated) {
        this.$store.commit(types.SHOW_AUTH_MODAL);
      } else {
        if (this.isBooking) return;

        this.isBooking = true;
        // API.loan.book(
        //   {
        //     _target: this.sensor._id,
        //     start: this.loan.startDate,
        //     end: this.loan.endDate
        //   },
        //   response => {
        //     this.$log(response);
        //     setTimeout(() => {
        //       setTimeout(() => {
        //         // this.idea._subscribers = response.data.idea._subscribers; // Update subscribers list
        //         this.isBooking = false;
        //         this.$emit("booked");
        //       }, 500);
        //     }, 500);
        //   },
        //   error => {
        //     this.$log(error);
        //     setTimeout(() => {
        //       this.isBooking = false;
        //     }, 500);
        //     alert("Failed to subscribe");
        //   }
        // );
      }
    },
    loanBooked() {
      this.isBooking = false;
      this.$emit("booked");
    }
  }
};
</script>

<style lang="stylus">

@import '~stylus/shared'
#loan-booking
  animate()
  margin-top: 10px
  position relative
  text-align center
  &.active
    padding-bottom 65px
  .btn
    radius(30px)
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
  .social
    pinned()
    animate()
    position absolute
    bottom 10px
    top auto
    height 50px
    margin 0 -5px
    opacity 0
    pointer-events none
    z-index 0
    p.subscription-stats
      color darken($color-text-light-grey, 10%)
      font-size 0.8em
      @media(max-width: 680px)
        display none
    &.active
      opacity 1
      pointer-events all
    .social--link
      radius(50%)
      animate()
      display inline-block
      height 50px
      margin 10px 5px
      position relative
      text-align center
      width 50px
      svg
        animate()
        color $color-grey
        height 18px
        margin 15px 5px
      &:hover
        background-color $color-lightest-grey
        cursor pointer
        svg
          color darken($color-grey, 10%)
          opacity 1
</style>
