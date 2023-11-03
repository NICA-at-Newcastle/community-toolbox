<template lang="pug">
  #about
    page-header(title="Privacy Policy" subtitle="")
    .row
      .content-block.pull-up.white-block
        .content-block--body
          vue-markdown(v-if="markdown") {{ markdown }}
</template>

<script>
import config from "@/config";

import VueMarkdown from "vue-markdown";

import PageHeader from "@/components/PageHeader";

export default {
  name: "privacy",
  metaInfo: {
    title: "Privacy Policy",
    meta: [{ name: "description", content: "Read our privacy policy." }]
  },
  components: {
    VueMarkdown,
    PageHeader
  },
  data() {
    return {
      markdown: undefined
    };
  },
  mounted() {
    const url = `${config.content}/privacy.md`;
    this.$http.get(url).then(
      response => {
        this.markdown = response.body;
      },
      response => {
        // error callback
        this.markdown = url;
      }
    );
  }
};
</script>

<style lang="stylus" scoped>
@import '~stylus/shared'
</style>
