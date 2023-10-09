<template lang="pug">
  .manage-loans
    h1.tab--header.no-parent(@click="toggle")
      .tab--header--title Manage Sensor Loans
      .tab--header--action
        span(v-show="expanded") #[i.fas.fa-angle-up]
        span(v-show="!expanded") #[i.fas.fa-angle-down]

    .tab--content(v-if="expanded")
      p(v-if="loans.length === 0") No loans scheduled
      
      table(v-else border="0")
        tr(v-if="loans.length > 0")
          td 
            strong Sensor
          td
            strong Tag          
          td
            strong Start
          td
            strong End
          td Contact
          td Edit
          td Delete
                
          tr(v-for="(loan, index) in loans")
            td
              strong {{ getSensor(loan._target).name }}
            td {{ getSensor(loan._target).tag }}
            td {{ getDate(loan.start) }}
            td {{ getDate(loan.end) }}
            
            td(align="center")
              span.contact-btn(@click="contact(loan)") #[i.fas.fa-envelope]

            td(align="center")
              span.edit-btn(@click="editLoan(loan)") #[i.fas.fa-pencil]
            td(align="center")
              span.delete-btn(@click="deleteLoan(loan)") #[i.fas.fa-trash]
        
        tr(v-if="edit.loan")
          td
            strong {{ getSensor(edit.loan._target).name }}
          td {{ getSensor(edit.loan._target).tag }}
          
          td(colspan="2")
            date-range-picker(ref="datepicker"
              :opens="'center'"
              :locale-data="{ firstDay: 1, format: 'mediumDate' }"            
              :singleDatePicker="'range'" 
              :ranges="false"           
              :timePicker="false"
              :timePicker24Hour="false"
              :showWeekNumbers="false"
              :showDropdowns="true"
              :autoApply="true"            
              v-model="edit.dateRange"                        
              :linkedCalendars="false") 
            //- input(type="text" v-model="edit.newStart" :placeholder="getDate(edit.loan.start)")
          
            //- input(type="text" v-model="edit.newEnd" :placeholder="getDate(edit.loan.end)")
          
          td(align="center" colspan="3")
            .btn.btn-success(@click="updateLoan(edit.loan._id)") Save
            
</template>

<script>
import API from "@/api";
import DateRangePicker from "vue2-daterange-picker";

import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  name: "manage-loans",
  components: {
    DateRangePicker
  },
  data() {
    return {
      expanded: true,
      loans: [],
      sensors: [],
      edit: {
        dateRange: { startDate: null, endDate: null },
        loan: undefined
      },
      dateOptions: {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    };
  },
  mounted() {
    this.fetchLoans();
  },
  methods: {
    searchLoans() {
      API.loan.search(
        this.search.query,
        response => {
          this.search.result = response.data;
        },
        response => {
          this.search.result = undefined;
        }
      );
    },
    toggle() {
      this.expanded = !this.expanded;
    },
    fetchLoans() {
      API.loan.manage(
        response => {
          this.loans = response.data.loans;
          this.sensors = response.data.sensors;
        },
        error => {
          this.$error(error);
          this.loans = [];
          this.sensors = [];
        }
      );
    },
    getSensor(id) {
      return this.sensors.find(sensor => {
        return sensor._id === id;
      });
    },
    getDate(date) {
      return new Date(date).toLocaleString("en-UK", this.dateOptions);
    },
    contact(loan) {
      API.loan.contact(
        { id: loan._user._id },
        response => {
          this.$log(response);
          window.location = `mailto:${
            response.data.email
          }?subject=Sensor loan sign up&body=Hey ${
            response.data.name
          }!%0D%0A %0D%0A You have signed up to borrow ${
            this.getSensor(loan._target).name
          } (tag ${this.getSensor(loan._target).tag}) from ${this.getDate(
            loan.start
          )} to ${this.getDate(loan.end)} from the Community Toolbox.`;
        },
        error => {
          this.$error(error);
        }
      );
    },
    deleteLoan(loan) {
      API.loan.destroy(
        { id: loan._id },
        response => {
          this.$log(response);
          this.fetchLoans();
        },
        error => {
          this.$error(error);
        }
      );
    },
    editLoan(loan) {
      this.edit.loan = loan;
      this.edit.dateRange.startDate = loan.start;
      this.edit.dateRange.endDate = loan.end;
    },
    updateLoan(id) {
      API.loan.update(
        id,
        this.edit.dateRange,
        response => {
          this.fetchLoans();
          this.edit.dateRange.startDate = null;
          this.edit.dateRange.endDate = null;
          this.edit.loan = undefined;
        },
        response => {
          alert("ooops");
          this.fetchLoans();
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.manage-loans
  .tab--content
    padding 25px
    table
      width 100%
      .btn
        reset()
        line-height 36px
        height 36px
    table, th, td
      border 1px solid $color-border
      border-collapse collapse
    td
      padding 10px
      position relative
      input[type="text"]
        border none
        font-size 0.9em
        line-height 30px
        outline 0
        padding 0 10px
        width calc(100% - 20px)
      svg
        color $color-grey
      &.delete
        svg
          color $color-danger
    .contact-btn, .edit-btn
        animate()
        color $color-text-light-grey
        font-size 0.8em
        svg
          height 25px
        :hover
          cursor pointer
          color $color-primary
    .delete-btn
        animate()
        color $color-text-light-grey
        font-size 0.8em
        svg
          height 25px
        :hover
          cursor pointer
          color $color-danger
    ul.search-results
      cleanlist()
      li.search-result
        cleanlist()
        border-top $color-border 1px solid
        margin-top 10px
        padding-top 10px
</style>
