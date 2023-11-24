<template lang="pug">
  #home
    .row-wrapper#welcome(v-bind:style="[instanceBackground]")
      .row
        .content-block
          .content-block--body
            img(src="/static/images/logos/ctb/logo-ctb.svg")            
            h1 Community Toolbox
            h3
              a(href="https://ioct.uknica.co.uk/") The Internet of Caring Things (IoCT)
    .row-wrapper#ctb-info
      .color
      .row
        .content-block
          vue-markdown(v-if="info_markdown") {{ info_markdown }}
          .fallback(v-else) 
            p #[strong Community Toolbox] is part of the community toolbox in #[a(href="https://ioct.uknica.co.uk/") The Internet of Caring Things (IoCT)] programme at #[a(href="https://uknica.co.uk/") The National Innovation Centre for Ageing (NICA)]. It enables communities to commission sensors from the #[a(href="http://www.urbanobservatory.ac.uk/") Urban Observatory] and locate them on their streets, collecting evidence to inform or even change their communities. For the first time, the public has access to precision sensing equipment to enable them to gather data that is relevant to their local issues.    
    collaborate(align="right" title="Use tools" subtitle="Sign Up to borrow tools from the Community Toolbox." action="Learn More" v-bind:styles="{ 'background-color': '#fff'}" theme="dark" imageSrc="/static/images/illustrations/ctb/sensor.svg" link="/toolbox")    
    collaborate(align="left" id="w-propose-idea" title="Propose a new community idea" subtitle="Write a short description of your proposed idea and post it on the site." imageSrc="/static/images/illustrations/comtech/idea2.svg")
    collaborate(align="right" id="w-collaborate" title="Collaborate" subtitle="Share your idea with the wider community and invite others to help you shape the idea." imageSrc="/static/images/illustrations/comtech/share2.svg" theme="dark" v-bind:styles="{ 'background-color': '#fff'}")
    collaborate(align="left" id="w-design" title="Design together" subtitle="Use the online space to form thoughts, ask questions and make decisions about the idea." imageSrc="/static/images/illustrations/comtech/design2.svg" action="Learn More" link="/learn")
    featured-ideas    
    ready(title="Ready?" subtitle="When you've had a good look around and you're ready to start your own idea just click the button below." action="Start an Idea" theme="dark" link="/start")
    //- site-footer(v-bind:style="{ 'background-color': 'white' }")
</template>

<script>
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable semi */
import Home from "@/mixins/Home";
import config from "@/config";
import VueMarkdown from "vue-markdown";

export default {
  name: "Community Toolbox",
  metaInfo: {
    title: "Community Toolbox"
  },
  mixins: [Home],
  components: {
    VueMarkdown
  },
  data() {
    return {
      info_markdown: undefined,
      events_markdown: undefined
    };
  },
  async mounted() {
    // get info
    this.$http.get(`${config.content}/info.md`).then(
      response => {
        this.info_markdown = response.body;
      },
      error => {
        // error callback
        this.$log(error);
      }
    );
    // get events
    this.$http.get(`${config.content}/events.md`).then(
      response => {
        this.events_markdown = response.body;
      },
      error => {
        // error callback
        this.$log(error);
      }
    );
  },
  methods: {
    async getMarkdown(url) {
      this.$http.get(url).then(
        response => {
          return response.body;
        },
        error => {
          // error callback
          this.$log(error);
          return undefined;
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~stylus/home'
#welcome.row-wrapper
  padding-bottom: 80px;
#ctb-info.row-wrapper
  reset()
  padding 10px 0
  // margin-top -80px
  position: relative;
  background: #fff;
  .color
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    gradient()
  .row
    .content-block
      color #fff
      gradient()
      // radius(20px)
      background-color rgb(200, 67, 69)
      margin 0 auto
      margin-top -170px
      max-width 800px
      padding 5%
      h1, p
        reset()
        color #fff
      p
        font-size 1.1em
        margin-bottom 10px
      a
        color #041e41 !important
        text-decoration none !important
#important-dates.row-wrapper
  reset()
  padding 10px 0
  // margin-top -80px
  position relative
  background #fff
  .color
    position absolute
    left 0
    right 0
    top 0
    bottom 0
    gradient()
  .row
    .content-block
      color #222
      // radius(20px)
      margin 0 auto
      //margin-top -170px
      padding 10px 0
      h1, p
        reset()
        color #333
      p
        font-size 1.1em
        margin-bottom 10px
      ul
        display flex
        flex-direction row
        flex-wrap wrap
        justify-content center
        padding 0
        li
          list-style-type none
          display inline-block
          max-width 180px
          margin 10px 10px
          background #fff
          border-box()
          box-sizing()
          radius(10px)
          padding 10px 20px
          color #6E6E6E
          h2, h3
            color #c84345
          h3
            font-size 1em
          h4
            font-size 0.9em
          h2, h3, h4
            margin 15px

img
  height 280px
  max-width 100%
a
  color: #041e41 !important
  text-decoration: none !important
</style>
