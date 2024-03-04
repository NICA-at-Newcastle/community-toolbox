<template>
  <div id="home">
    <div class="row-wrapper" id="welcome" v-bind:style="[instanceBackground]">
      <div class="row">
        <div class="content-block">
          <div class="content-block--body"><img src="/static/images/logos/ctb/logo-ctb.svg" />
            <h1>Community Toolbox</h1>
            <h3><a href="https://ioct.uknica.co.uk/">The Internet of Caring Things (IoCT)</a></h3>
          </div>
        </div>
      </div>
    </div>
    <div class="row-wrapper" id="ctb-info">
      <div class="color"></div>
      <div class="row">
        <div class="content-block">
          <vue-markdown v-if="info_markdown">{{ info_markdown }}</vue-markdown>
          <div class="fallback" v-else="v-else">
            <p><strong>Community Toolbox</strong> is part of the community toolbox in <a
                href="https://ioct.uknica.co.uk/">The Internet of Caring Things (IoCT)</a> programme at <a
                href="https://uknica.co.uk/">The National Innovation Centre for Ageing (NICA)</a>.
              It enables communities to commission sensors from the <a href="http://www.urbanobservatory.ac.uk/">Urban
                Observatory</a> and locate them on their streets, collecting evidence to inform or even change their
              communities. For the
              first time, the public has access to precision sensing equipment to enable them to gather data that is
              relevant to their local issues.</p>
          </div>
        </div>
      </div>
    </div>
    <GetStarted align="right" title="Getting started" subtitle="Sign Up to borrow tools from the Community Toolbox."
      action="Learn More" v-bind:styles="{ 'background-color': '#fff' }" theme="dark"
      imageSrc="/static/images/illustrations/ctb/sensor.svg" link="/toolbox"></GetStarted>
    <collaborate align="left" id="w-participate" title="Tasks and Challenges"
      subtitle="We have got some simple tasks and challenges for you to engage in. We encourage you to participate in these challenges to help us in capturing your community data insights and earn rewards. This is your opportunity to be amongst the first users to help build/design the community tools. Design for change/ Design the future."
      imageSrc="/static/images/illustrations/comtech/idea2.svg"
      :links="[{ name: 'Go to tasks', link: '/explore' }, { name: 'Get notified', link: '/auth' }]"></collaborate>
    <featured-ideas></featured-ideas>
  </div>
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
    VueMarkdown,

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
      color black
      // radius(20px)
      background-color #ecfeff
      margin 0 auto
      margin-top -170px
      max-width 800px
      padding 5%
      h1, p
        reset()
        color black
      p
        font-size 1.1em
        margin-bottom 10px
      a
        color #041e41 !important
        text-decoration underline !important
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
