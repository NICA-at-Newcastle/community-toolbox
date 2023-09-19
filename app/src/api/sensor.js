import axios from 'axios'
import * as config from '@/api/config'

export default {
  addSensor(sensor, cb, errorCb) {
    axios.post(`${config.API_ADDRESS}/sensor`, { sensor: sensor }, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  fetchSensors(cb, errorCb) {
    axios.get(`${config.API_ADDRESS}/sensors`, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  }
  // update(idea, cb, errorCb) {
  //   axios.put(`${config.API_ADDRESS}/idea`, idea, { withCredentials: true }).then((response) => {
  //     cb(response)
  //   })
  //     .catch((error) => {
  //       errorCb(error)
  //     })
  // }
}
