<template lang="pug">
  #loan-modal
    .loan-panel
      #close-button(@click="closeModal")
        i.fas.fa-times
      .modal-content
        h1 Equipment Loan Agreement
      
          splash-messages(v-bind:messages="splashmessages")

        h3 In consideration of the mutual covenants and promise set forth herein, the parties agree as follows:
        .loan-form.text-right
          vue-markdown(v-if="markdown") {{ markdown }}          
        .text-right
          p.loan-notice #[input(v-model="termsLoan" type="checkbox")] I accept the terms of the loan agreement
        .btn.btn-rounded.full-width.btn-success(@click="confirmLoan" :class="{ active: termsLoan}") {{ isBooking ? 'Please wait..' : 'Confirm' }}
        .clearfix

</template>

<script>
import * as types from "@/store/mutation-types";
import { mapGetters } from "vuex";
import API from "@/api";

import SplashMessages from "@/components/shared/SplashMessages";
import VueMarkdown from "vue-markdown";

import AuthMixin from "@/mixins/AuthMixin";
import * as apiconfig from "@/api/config";
import config from "@/config";

export default {
  name: "loan-modal",
  props: ["sensor", "loan"],
  components: {
    SplashMessages,
    VueMarkdown
  },
  mixins: [AuthMixin],
  data() {
    return {
      splashmessages: [],
      isBooking: false,
      termsLoan: false,
      institution: apiconfig.INSTITUTION || "Open Lab",
      markdown: undefined
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "hasConsented", "user"])
  },
  watch: {
    isAuthenticated(nV) {
      if (nV) {
        this.$store.commit(types.HIDE_AUTH_MODAL);
      }
    }
  },
  mounted() {
    const url = `${config.legal}/agreement.md`;
    this.$http.get(url).then(
      response => {
        this.markdown = response.body;
      },
      response => {
        // error callback
        this.markdown = undefined;
      }
    );
  },
  methods: {
    closeModal(e) {
      e.stopPropagation();
      this.$emit("close");
    },
    confirmLoan() {
      if (this.isBooking) return;
      this.isBooking = true;
      API.loan.book(
        {
          _target: this.sensor._id,
          start: this.loan.startDate,
          end: this.loan.endDate
        },
        response => {
          this.$log(response);
          setTimeout(() => {
            setTimeout(() => {
              // this.idea._subscribers = response.data.idea._subscribers; // Update subscribers list
              this.isBooking = false;
              this.$emit("booked");
            }, 500);
          }, 500);
        },
        error => {
          this.$error(error);
          setTimeout(() => {
            this.isBooking = false;
          }, 500);
          alert("Failed to subscribe");
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/auth'

#loan-modal
  pinned()
  position fixed
  z-index 50

  &:before
    pinned()
    background-color alpha(black, 0.7)
    content ''
    position fixed

  .btn
    radius(30px)
    pointer-events none
    background-color $color-lighter-grey
    &.active
      background-color $color-primary
      pointer-events all

  #close-button
    position absolute
    top 0
    right 0
    margin: 10px
    padding 10px
    cursor pointer

  .loan-panel
    center-align()
    background-color white
    // max-width calc(100% - 20px)
    max-width 800px
    max-height: 800px
    width 70%
    height: 90%
    box-sizing border-box
    margin 60px auto
    padding 40px 20px
    text-align center
    .text-right
      text-align left

    .modal-content
      height: 100%
      width: 100%
      overflow: auto
    h2
      reset()
      color $text-grey
      padding 10px
</style>
