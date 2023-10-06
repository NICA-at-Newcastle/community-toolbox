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
  },
  toolbox(type, cb, errorCb) {
    axios.get(`${config.API_ADDRESS}/sensors/${type}`, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  types(cb, errorCb) {
    axios.get(`${config.API_ADDRESS}/sensortypes`, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  update(sensor, cb, errorCb) {
    axios.put(`${config.API_ADDRESS}/sensor`, sensor, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  view(id, cb, errorCb) {
    axios.get(`${config.API_ADDRESS}/sensor/${id}`, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  destroy(postData, cb, errorCb) {
    axios.post(`${config.API_ADDRESS}/sensor/destroy`, postData, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  }
}
