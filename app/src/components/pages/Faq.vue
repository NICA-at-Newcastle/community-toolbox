<template lang="pug">
  #about
    page-header(title="FAQ" subtitle="Frequently asked questions")
    .row
      .content-block.pull-up.white-block
        .content-block--body
          vue-markdown(v-if="markdown") {{ markdown }}
    //- site-footer
</template>

<script>
import config from "@/config";

import VueMarkdown from "vue-markdown";

import PageHeader from "@/components/PageHeader";

export default {
  name: "faq",
  metaInfo: {
    title: "FAQ",
    meta: [{ name: "description", content: "Explore frequently asked questions." }]
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
    const url = `${config.content}/faq.md`;
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
