<template>
  <div class="row-wrapper" id="collaborate" v-bind:style="[styles || instanceBackground]">
    <div class="row">
      <div class="content-block">
        <div class="collaborate">
          <div class="collaborate--image" v-bind:id="align == 'left' ? 'left' : 'right'"><img
              v-bind:src="imageSrc || '/static/images/illustrations/design.svg'" /></div>
          <div class="collaborate--content" v-bind:id="align == 'left' ? 'left' : 'right'"
            v-bind:style="!clickaction && !link && !action ? { padding: '80px 30px' } : { padding: '50px 30px' }">
            <h2 v-bind:class="{ dark: theme === 'dark' }">{{ title }}</h2>
            <p v-bind:class="{ dark: theme === 'dark' }">{{ subtitle }}</p>
            <router-link class="collaborate--action" v-if="!clickaction && link" v-bind:to="link"
              v-bind:class="{ dark: theme === 'dark' }">{{ action }}</router-link><a class="collaborate--action"
              v-if="clickaction && link" v-bind:class="{ dark: theme === 'dark' }" :href="link">{{ action
              }}</a>
            <div class="links-wrapper">
              <div v-for="item in links">
                <router-link :to="item.link" class="collaborate--action">
                  {{ item.name }}
                </router-link>
              </div>
            </div>
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

export default {
  name: "collaborate",
  props: [
    "title",
    "subtitle",
    "action",
    "link",
    "styles",
    "align",
    "theme",
    "clickaction",
    "imageSrc",
    "links"
  ],
  computed: {
    ...mapGetters(["instanceBackground"])
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

.links-wrapper{
  display: flex;
  justify-content: center
}

.collaborate {
  padding: 80px 0px !important;
  position: relative;
  width: 100%;

  .collaborate--image {
    position: absolute;
    text-align: center;
    width: 50%;

    img {
      height: 320px;
      max-width: 100%;
    }

    &#left {
      margin-left: 50%;
    }

    &#right {
      margin-right: 50%;
    }
  }

  .collaborate--content {
    padding: 50px 30px;
    text-align: center;

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
