<template>
  <div class="row-wrapper" id="collaborate" v-bind:style="[styles || instanceBackground]">
    <div class="row">
      <div class="content-block">
        <div class="collaborate">
          <div class="collaborate--content"
            v-bind:style="!clickaction && !link && !action ? { padding: '80px 30px' } : { padding: '50px 30px' }">
            <h2 v-bind:class="{ dark: theme === 'dark' }">{{ title }}</h2>
            <p v-bind:class="{ dark: theme === 'dark' }">{{ subtitle }}</p>
            <!-- <router-link class="collaborate--action" v-if="!clickaction && link" v-bind:to="link"
              v-bind:class="{ dark: theme === 'dark' }">{{ action }}</router-link><a class="collaborate--action"
              v-if="clickaction && link" v-bind:class="{ dark: theme === 'dark' }" :href="link">{{ action
              }}</a> -->
            <button @click="toggle" class="button-reset">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"
                v-bind:class="{ rotate: expand }">
                <path fill-rule="evenodd"
                  d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                  clip-rule="evenodd" />
              </svg>

            </button>
            <p class="get-started">
              <vue-markdown v-if="expand">{{ markdownContent }}</vue-markdown>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable semicolon */
/* eslint-disable semi */
import { mapGetters } from "vuex";
import VueMarkdown from "vue-markdown";
import markdownContent from "@/assets/markdown/getStarted.md"
import { ref } from 'vue'

// state
const expand = ref(false)

// actions
function toggle() {
  expand.value = !expand.value
}
export default {
  name: "GetStarted",
  props: [
    "title",
    "subtitle",
    "action",
    "link",
    "styles",
    "align",
    "theme",
    "clickaction",
    "imageSrc"
  ],
  components: {
    VueMarkdown,
  },
  computed: {
    ...mapGetters(["instanceBackground"])
  },
  data() {
    return {
      markdownContent,
      expand,
      toggle
    }
  }
};


</script>


<style lang="stylus" scoped>
@import '~stylus/home';

.row-wrapper {
  gradient();
  background-color: $color-primary;
  position: relative;
}

.rotate{
  transform: rotate(180deg)
}

.button-reset{
  background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;
}



.collaborate {
  padding: 80px 0px !important;
  position: relative;
  width: 100%;



  .collaborate--content {
    padding: 50px 30px;
    text-align: center;
    .get-started {
      color: black;
      text-align: left;
    }

    &#left {
      margin-right: 50%;
    }

    &#right {
      margin-left: 50%;
    }

    h2 {
      reset();
      color: white;

      &.dark {
        color: #444;
      }

      font-size: 2em;
    }

    p {
      reset();
      color: white;

      &.dark {
        color: #444;
      }

      font-size: 1.2em;
      margin: 20px auto 30px auto;
    }

    .collaborate--action {
      animate();
      radius(30px);
      background-color: alpha(black, 0.05);
      color: white;

      &.dark {
        color: #444;
      }

      display: inline-block;
      font-weight: bold;
      // line-height 60px
      margin: 0 20px;
      padding: 20px 30px;
      text-align: center;
      text-decoration: none;

      &:hover {
        cursor: pointer;
        background-color: alpha(black, 0.1);
      }
    }
  }

  @media (max-width: 640px) {
    padding: 0 !important;

    .collaborate--image {
      margin: 40px auto 20px auto;
      position: relative;
      text-align: center;
      max-width: calc(100% - 120px);
      width: 100%;

      img {
        height: auto;
      }

      &#left {
        margin-right: auto !important;
        margin-left: auto !important;
      }

      &#right {
        margin-right: auto !important;
        margin-left: auto !important;
      }
    }

    .collaborate--content {
      margin-right: auto !important;
      margin-left: auto !important;
    }
  }
}
</style>
