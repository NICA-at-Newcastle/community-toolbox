import API from '@/api'
import SplashMessages from '@/components/shared/SplashMessages'

export default {
  props: ['title', 'idea'],
  components: {
    SplashMessages
  },
  data () {
    return {
      task: undefined
    }
  },
  created () {
    API.task.view(
      this.$route.params.task_id,
      (response) => {
        this.$log(response)
        this.task = response.data.task
        this.$emit('update:title', this.task.title)
      },
      (error) => {
        this.$log(error)
      }
    )
  }
}
