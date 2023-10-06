<template lang="pug">
  .sensor-tile
    .sensor-tile--banner(v-if="sensor.image" v-bind:style="(sensor.image && sensor.image.location) ? sensor.image.location : sensor.image | resize('220', '140') | background")
    .sensor-tile--body
      .sensor-tile--title(v-bind:class="{ 'is-placeholder': !sensor.name }") {{ sensor.name || 'Example Sensor' }}
      //- .sensor-tile--author(v-if="sensor._user") {{ sensor._user.profile.name }}
      .sensor-tile--tagline(v-bind:class="{ 'is-placeholder': !sensor.type }") {{ sensor.type || 'This is an example sensor type' }}
    .sensor-tile--footer(v-bind:class="{ 'loaned-out': sensor.loaned }") {{ available(sensor._id) ? `Available` : 'Currently On Loan' }} 
</template>

<script>
export default {
  name: "sensor-tile",
  props: {
    sensor: {
      type: Object,
      default: function() {
        return {};
      }
    },
    loans: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  methods: {
    available(id) {
      // const sensorLoans = this.loans.filter(loan => {
      //   return loan._target === id;
      // });
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const available = this.loans.reduce(function(available, loan) {
        if (loan._target !== id) return available;
        return tomorrow.getTime() >= new Date(loan.start).getTime() &&
          tomorrow.getTime() <= new Date(loan.end).getTime()
          ? false
          : available;
        return available;
      }, true);
      this.sensor.loaned = !available;
      return available;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~stylus/shared'

.sensor-tile
  background-color white
  height 360px
  overflow hidden
  position relative
  text-align left
  .sensor-tile--banner
    animate()
    background-image($color-lightest-grey)
    pinned()
    bottom auto
    height 0
    padding-bottom 60%
    position absolute
  .sensor-tile--body
    animate()
    padding 20px
    padding-top calc(60% + 20px)
    .sensor-tile--title
      color $color-text-dark-grey
      font-size 1.2em
      font-weight bold
    .sensor-tile--author
      color $color-text-grey
      font-size 0.8em
      font-weight normal
      margin-bottom 10px
    .sensor-tile--tagline
      color $color-text-grey
      font-weight normal
    .is-placeholder
      color $color-text-light-grey
  .sensor-tile--footer
    animate()
    pinned()
    background-color white
    color $color-success
    font-size 0.8em
    line-height 32px
    top auto
    bottom -32px
    position absolute
    text-align center
  .loaned-out
    color $color-danger

  &:hover
    cursor pointer
    .sensor-tile--banner
      top -20px
    .sensor-tile--body
      padding-top 60%
    .sensor-tile--footer
      bottom 0
</style>
