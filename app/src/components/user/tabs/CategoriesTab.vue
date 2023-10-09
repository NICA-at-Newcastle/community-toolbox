<template lang="pug">
.tab-content--categories

  h1.tab--header.no-parent
    .tab--header--title(@click="viewCategories") Manage
    .tab--header--action
      span(v-show="viewingCategories") #[i.fas.fa-angle-up]
      span(v-show="!viewingCategories") #[i.fas.fa-angle-down]

  .tab--content(v-if="viewingCategories")

    p(v-if="categories.length === 0") No categories created

    .categories-wrapper(v-else)
      router-link.category-tile(tag="div" v-for="(category, index) in categories" v-bind:key="index" v-bind:to="{ name: 'explore', params: { category: category.tag } }")
        .delete-button(@click="removeCategory($event, category._id)")
          i.fas.fa-trash
        .category-name Name: {{ category.name }}
        .category-tag Tag: {{ category.tag }}

  h1.tab--header.no-parent
    .tab--header--title(@click="addCategory") Add new
    .tab--header--action
      span(v-show="addingCategory") #[i.fas.fa-angle-up]
      span(v-show="!addingCategory") #[i.fas.fa-angle-down]

  .tab--content(v-if="addingCategory")
    .tab-section--body
      create-category(v-on:createdCategory="categoryCreated")
    
</template>

<script>
import API from "@/api";

import CreateCategory from "@/components/categories/CreateCategory";

export default {
  name: "categories-tab",
  props: ["currentUser"],
  components: {
    CreateCategory
  },
  created() {
    this.fetchCategories();
  },
  data() {
    return {
      categories: [],
      addingCategory: true,
      viewingCategories: false
    };
  },
  methods: {
    categoryCreated() {
      this.viewingCategories = true;
      this.addingCategory = false;
      this.fetchCategories();
    },
    viewCategories() {
      this.viewingCategories = !this.viewingCategories;
    },
    addCategory() {
      this.addingCategory = !this.addingCategory;
    },
    removeCategory(e, id) {
      e.stopPropagation();
      API.category.destroy(
        { id },
        response => {
          this.$log(response);
          this.fetchCategories();
        },
        error => {
          this.$error(error);
        }
      );
    },
    fetchCategories() {
      API.category.fetchCategories(
        response => {
          // Idea success
          this.$log(response);
          this.categories = response.data;
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

.tab-content--categories
  text-align left
  .tab--header--title
    cursor pointer
  .tab--content
    padding 25px
    p
      reset()
    .categories-wrapper
      .delete-button
          float right
          animate()
          color $color-text-light-grey
          font-size 0.8em
          svg
            height 25px
          &:hover
            cursor pointer
            color $color-danger
      .category-tile
        animate()
        background-color $color-lightest-grey
        display block
        margin-bottom 10px
        padding 20px
        text-decoration none
        .category-name
          color $color-text-darkest-grey
          text-decoration none
        .category-tag
          color $color-text-grey
          text-decoration none
        &:hover
          background-color darken($color-lightest-grey, 5%)
          cursor pointer
</style>
