<template lang="pug">
.user-card
  router-link.avatar-wrapper(tag="div" v-bind:to="{ name: 'profile', params: { id: this.id } }")
    avatar(v-bind:profile="profile")
  h1.user--name {{ profile.name }}
  h5.user--account {{ accountType }}
</template>

<script>
import Avatar from "@/components/user/Avatar";
import { mapGetters } from "vuex";

export default {
  name: "user-card",
  props: ["profile", "id"],
  components: {
    Avatar
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "user",
      "notifications",
      "isAdmin",
      "isOrganiser",
      "isModerator"
    ]),
    accountType() {
      return this.isAdmin
        ? "Administrator"
        : this.isModerator
        ? "Moderator"
        : this.isOrganiser
        ? "Community Organiser"
        : "Standard Account";
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~stylus/shared'

.user-card
  .avatar-wrapper
    margin 0 auto
    padding 10px 40px 20px 40px
    max-width 120px
    &:hover
      cursor pointer
  h1.user--name
    reset()
    color $color-text-grey
    font-size 1.3em
    font-weight normal
  h5.user--account
    reset()
    color $color-text-light-grey
    font-size 0.9em
    font-weight normal
</style>
