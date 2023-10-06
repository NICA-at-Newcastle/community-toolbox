<template lang="pug">
.calendar-card
  h1.calendar--title Loan Calendar
  date-range-picker(ref="datepicker"
            :opens="'inline'"
            :locale-data="{ firstDay: 1, format: 'mediumDate' }"            
            :singleDatePicker="'range'" 
            :ranges="false"           
            :timePicker="false"
            :timePicker24Hour="false"
            :showWeekNumbers="false"
            :showDropdowns="true"
            :autoApply="true"            
            v-model="dateRange"                        
            :linkedCalendars="false"
            :dateFormat="dateFormat"            
            :controlContainerClass="'picker-input'"
            @update="datesSelected($event)"
            @start-selection="startSelect($event)")
  //- h5.user--account {{ accountType }}
</template>

<script>
import Avatar from "@/components/user/Avatar";
import DateRangePicker from "vue2-daterange-picker";

import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  name: "calendar-card",
  props: ["loan", "loans"],
  components: {
    Avatar,
    DateRangePicker
  },
  data() {
    // let startDate = null;
    // let endDate = null;
    // endDate.setDate(endDate.getDate() + 6);
    return {
      shareLink: "",
      isSubscribing: false,
      selectedStartDate: null,
      maxLoanEndDate: null,
      minLoanStartDate: null,
      dateRange: { startDate: null, endDate: null }
    };
  },
  watch: {
    loan(nV, oV) {
      if (typeof nV === "undefined") {
        this.reset();
      }
    },
    loans(nV, oV) {
      // reset dateRanges
      this.dateRange = { startDate: null, endDate: null };
    }
  },
  computed: {
    accountType() {
      return "Standard Account";
    }
  },
  methods: {
    reset() {
      // this.dateRange = { startDate: null, endDate: null };
      this.$emit("update:loan", undefined);
    },
    toggleDatepicker($event) {
      $event.stopPropagation();
      if (!this.isAuthenticated) {
        this.$store.commit(types.SHOW_AUTH_MODAL);
      } else {
        this.$refs.datepicker.togglePicker(true);
      }
    },
    dateFormat(classes, date) {
      if (!classes.disabled) {
        classes.disabled =
          date.getTime() < new Date() ||
          // (this.maxLoanEndDate && this.maxLoanEndDate < date) ||
          // (this.minLoanStartDate && this.minLoanStartDate > date) ||
          this.isLoanedOut(date);
      }
      // if (this.se) console.log(date);
      return classes;
    },
    startSelect($event) {
      // console.log($event);
      // this.selectedStartDate = $event;
      // this.maxLoanEndDate = new Date($event);
      // this.minLoanStartDate = new Date($event);
      // this.maxLoanEndDate.setDate(this.maxLoanEndDate.getDate() + 30);
      // this.minLoanStartDate.setDate(this.minLoanStartDate.getDate() - 30);
      this.reset();
      // this.dateRange.startDate = $event;
    },
    isLoanedOut(date) {
      if (!this.loans) return false;
      return this.loans.reduce(
        (disabled, loan) =>
          date.getTime() >= new Date(loan.start).getTime() &&
          date.getTime() <= new Date(loan.end).getTime()
            ? true
            : disabled,
        false
      );
    },
    finishSelect($event) {
      console.log($event);
      // this.selectedStartDate = $event;
      // this.maxLoanEndDate = new Date($event);
      // this.minLoanStartDate = new Date($event);
      // this.maxLoanEndDate.setDate(this.maxLoanEndDate.getDate() + 30);
      // this.minLoanStartDate.setDate(this.minLoanStartDate.getDate() - 30);
      this.reset();
    },
    datesSelected($event) {
      this.$emit("update:loan", this.dateRange);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~stylus/shared'

.calendar-card
  text-align: center
  .avatar-wrapper
    margin 0 auto
    padding 10px 40px 20px 40px
    max-width 120px
    &:hover
      cursor pointer
  h1.calendar--title
    reset()
    color $color-text-grey
    font-size 1.3em
    font-weight normal
  h5.user--account
    reset()
    color $color-text-light-grey
    font-size 0.9em
    font-weight normal
</style>
