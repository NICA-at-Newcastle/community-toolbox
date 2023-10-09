<template lang="pug">
.design-task--data
  p.design-task--description(v-if="task && task.description") {{ task.description }}

  splash-messages(v-if="!isAuthenticated" v-bind:messages="[{type:'success',text:'Please login to participate!'}]")

  .data-wrapper
    // No data
    //- .no-data(v-if="responses.length === 0" @click="fetchResponses") Be the first to share

    // data
    ul.data-items(v-if="responses.length !== 0")
      media-response(v-for="(response, index) in responses" v-bind:key="index" v-bind:idea="idea" v-bind:response="response")
      .clearfix

  // Submit a response
  .data-submission(v-if="isAuthenticated")
    
    file-upload(v-bind:uploaded-file.sync="newResponse", v-bind:upload-type="'data'")

    .submit(v-if="newResponse")
      .response-composer
        .input-wrapper
          //- TODO: add sensor types here
          input(v-bind:disabled="!isAuthenticated" type="text" v-model="newResponse.text" placeholder="Describe your upload.." v-on:keyup.enter="submitResponse")
          .btn.btn-primary(@click="submitResponse") Submit
        
        
</template>

<script>
import { mapGetters } from "vuex";
import API from "@/api";

import DesignTask from "@/mixins/DesignTask";

import FileUpload from "@/components/FileUpload";

import Avatar from "@/components/user/Avatar";
import MediaResponse from "@/components/design/components/MediaResponse";

export default {
  name: "datasource",
  mixins: [DesignTask],
  created() {
    this.fetchResponses();
  },
  components: {
    FileUpload,
    Avatar,
    MediaResponse
  },
  data() {
    return {
      newResponse: undefined,
      responses: [],
      webcamActive: false
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated"])
  },
  methods: {
    fetchResponses() {
      API.task.fetchResponses(
        "data",
        this.$route.params.task_id,
        response => {
          this.$log(response);
          this.responses = response.data;
        },
        error => {
          this.$error(error);
        }
      );
    },
    submitResponse() {
      if (!this.isAuthenticated) return;
      API.task.submitResponse(
        "data",
        this.$route.params.task_id,
        { response: this.newResponse },
        response => {
          this.$log(response);
          // this.responses.push(response.data)
          this.newResponse = undefined;
          this.fetchResponses();
        },
        error => {
          this.$error(error);
          this.newResponse = undefined;
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.design-task--data
  background-color white
  padding 25px
  .data-wrapper
    .no-data
      color $color-text-grey
      margin 0 0 20px 0
      padding 60px 20px
      text-align center
    ul.data-items
      cleanlist()
      margin 0 -10px 20px -10px

  // .data-submission
  //   max-width 600px

  .response-composer
    animate()
    margin-top 0
    opacity 1
    position relative
    .btn
      position absolute
      right 0
      bottom 0
      line-height 40px
      padding 0
      width 80px
    .input-wrapper
      border $color-border 1px solid
      input
        border none
        box-sizing border-box
        line-height 30px
        outline 0
        padding 5px 10px
        padding-right 80px
        width calc(100% - 80px)

  .file-upload
    width 100%
</style>
