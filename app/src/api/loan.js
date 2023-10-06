import axios from 'axios'
import * as config from '@/api/config'

export default {
  fetchAll(cb, errorCb) {
    axios.get(`${config.API_ADDRESS}/loans`, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  manage(cb, errorCb) {
    axios.get(`${config.API_ADDRESS}/manage/loans`, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  fetch(data, cb, errorCb) {
    axios.get(`${config.API_ADDRESS}/loans/${data.target}`, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  contact(data, cb, errorCb) {
    axios.get(`${config.API_ADDRESS}/loan/contact/${data.id}`, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  book(postData, cb, errorCb) {
    axios.post(`${config.API_ADDRESS}/loan`, postData, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  update(id, dates, cb, errorCb) {
    axios.put(`${config.API_ADDRESS}/loan`, { id: id, start: dates.startDate, end: dates.endDate }, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  },
  destroy(postData, cb, errorCb) {
    axios.post(`${config.API_ADDRESS}/loan/destroy`, postData, { withCredentials: true }).then((response) => {
      cb(response)
    })
      .catch((error) => {
        errorCb(error)
      })
  }
}
