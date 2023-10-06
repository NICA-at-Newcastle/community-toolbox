<template lang="pug">
.tab-content--admin
  
  your-permissions(v-if="user.permissions.length !== 0")
  
  invitations(v-if="isAdmin")

  manage-loans(v-if="isAdmin")

  manage-permissions(v-if="isAdmin")

  

</template>

<script>
import { mapGetters } from "vuex";

import YourPermissions from "@/components/user/admin/YourPermissions";
import ManageLoans from "@/components/user/admin/ManageLoans";
import ManagePermissions from "@/components/user/admin/ManagePermissions";
import Invitations from "@/components/user/admin/Invitations";

export default {
  name: "admin-tab",
  props: ["currentUser"],
  components: {
    YourPermissions,
    ManagePermissions,
    Invitations,
    ManageLoans
  },
  computed: {
    ...mapGetters(["user", "isAdmin"])
  }
};
</script>

<style lang="stylus">

@import '~stylus/shared'

.tab-content--admin
  text-align left
  .tab--header
    cursor pointer
  .tab--content
    padding 25px
    p
      reset()
</style>
