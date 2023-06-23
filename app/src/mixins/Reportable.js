import { mapGetters } from 'vuex'
import API from '@/api'

export default {
  computed: {
    ...mapGetters(['isAuthenticated', 'isAdmin', 'isModerator', 'user'])
  },
  methods: {
    reportOrDestroy (type, id, user) {
      const canDestroy = (this.isModerator || user._id === this.user._id)
      const action = canDestroy ? 'delete' : 'report'

      const confirmed = confirm(`Are your sure you want to ${action} ${type}?`)

      if (!confirmed) return

      switch (action) {
        case 'report':
          this.reportContent(type, id)
          break

        case 'delete':
          this.destroyContent(type, id)
          break
      }
    },
    destroyContent (type, id) {
      let action = 'destroy'
      if (type === 'taskresponse') {
        type = 'task'
        action = 'destroyResponse'
      }
      API[type][action](
        { type: type, id: id },
        (response) => {
          this.$log(response)
          try {
            this.contentChanged()
          } catch (error) {
            this.$log('contentChanged method not found')
            this.$error(error)
          }
        },
        (error) => {
          this.$error(error)
        }
      )
    },
    reportContent (type, id) {
      API.moderate.report(
        { type: type, id: id },
        (response) => {
          this.$log(response)
        },
        (error) => {
          this.$error(error)
        }
      )
    }
  }
}
