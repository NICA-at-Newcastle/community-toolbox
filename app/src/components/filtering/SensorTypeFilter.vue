<template lang="pug">
  .type-wrapper()
    ul#type-tabs
      router-link(tag="li" v-bind:to="{ name: 'toolbox' }") All
      router-link(tag="li" v-for="(type, index) in categories" v-bind:key="index" v-bind:to="{ name: 'toolbox', params: { type: type.tag } }" v-bind:class="{ active: $route.params.type === type.tag }")
        | {{ type.name }}
      .clearfix
</template>

<script>
import API from "@/api";

export default {
  name: "sensor-type-filter",
  mounted() {
    this.fetchCategories();
  },
  data() {
    return {
      categories: []
    };
  },
  methods: {
    fetchCategories() {
      API.sensor.types(
        response => {
          // Idea success
          this.categories = response.data;
          this.$emit("update:categories", this.categories);
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

.type-wrapper
  animate()
  pinned()
  bottom auto
  background-color white
  max-height $filter-height
  overflow hidden
  position absolute
  top 0
  pointer-events none
  z-index 1
  ul#type-tabs
    cleanlist()
    padding 0 10px
    li
      cleanlist()
      animate()
      radius(20px)
      color $color-text-grey
      float left
      line-height $filter-height - 26px
      margin (26px / 2) 2.5px
      padding 0 20px
      &:hover
        background-color alpha(black, 0.1)
        cursor pointer
      &.active
        background-color $color-primary
        color white
</style>
