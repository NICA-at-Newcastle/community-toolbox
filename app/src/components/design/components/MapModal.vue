<template lang="pug">
  #modal(v-if="isAuthenticated")
    .modal-panel
      #close-button(@click="closeModal")
        i.fas.fa-times
      .modal-content
        .submission(v-if="!response")
          h1 {{task.title}}          
          p {{ task.description }}
          
          .text-right
            .comment-composer
              .input-wrapper
                textarea-autosize(name="composer-textarea" ref="textarea" rows="1" placeholder="Write a response..." @keydown.native.enter.prevent.stop="submit" v-bind:min-height="10" v-model="newResponse.text" v-bind:max-height="200")
                .btn.btn-primary(v-bind:class="{ active: (newResponse.text && newResponse.text.length > 1) }" @click="submit")
                  i.fas.fa-arrow-right
          //- .button-wrapper
          //-   .btn.btn-rounded.full-width.btn-success(@click="submit") Submit
          //- .clearfix
        .text-right
          map-response(v-if="response" v-bind:idea="idea" v-bind:response="response")
          .clearfix
      
</template>

<script>
import Vue from "vue";
import * as types from "@/store/mutation-types";
import { mapGetters } from "vuex";
import VueTextareaAutosize from "vue-textarea-autosize";
import Avatar from "@/components/user/Avatar";
import MapResponse from "@/components/design/components/MapResponse";

import AuthMixin from "@/mixins/AuthMixin";
import * as config from "@/api/config";

Vue.use(VueTextareaAutosize);

export default {
  name: "map-modal",
  props: ["marker", "idea", "task", "response"],
  created() {
    this.newResponse.marker = this.marker;
  },
  components: {
    Avatar,
    MapResponse
  },
  mixins: [AuthMixin],
  data() {
    return {
      newResponse: {
        text: undefined,
        marker: undefined
      }
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated"])
  },
  methods: {
    closeModal(e) {
      e.stopPropagation();
      this.$emit("close");
    },
    submit() {
      this.$emit("submit", this.newResponse);
      this.$emit("close");
    }
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/auth'

#modal
  pinned()
  position absolute
  font-size 1.3em
  z-index 50000

  &:before
    pinned()
    background-color alpha(black, 0.7)
    content ''
    position absolute

  #close-button
    position absolute
    top 0
    right 0
    padding 10px
    cursor pointer

  .modal-panel
    center-align()
    background-color white
    max-width 800px
    max-height: 800px
    width 70%
    height: 90%
    box-sizing border-box
    margin 0 auto
    padding 40px 2px
    cursor auto
    text-align center
    .text-right
      text-align left
    .modal-content
      height: 100%
      width: 100%
      overflow: auto

  .submission
    padding 10px
  .comment-composer
    animate()
    margin-top 0
    opacity 1
    position relative
    &.subtle
      opacity 0.5
    &.reply-composer
      margin-top 10px
    .btn
      pinned()
      position absolute
      left auto
      line-height 40px
      opacity 0
      padding 0
      pointer-events none
      width 40px
      &.active
        opacity 1
        pointer-events all
    .input-wrapper
      border $color-border 1px solid
      input, textarea
        border-box()
        background-color transparent
        border none
        display block
        line-height 20px
        outline 0
        margin 0
        padding 10px
        width calc(100% - 40px)
</style>
