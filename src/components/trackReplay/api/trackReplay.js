import $axios from './axios'
let commonUrl = 'platform'
export default {
  getAlarm (data) {
    const service = {
      method: 'get',
      url: `${commonUrl}/supply/alarm`
    }
    return $axios(service, data)
  },
  getTrip (data) {
    const service = {
      method: 'get',
      url: `${commonUrl}/supply/trip/${data}`
    }
    return $axios(service, '')
  },
  getVehicleTrip (data) {
    const service = {
      method: 'get',
      url: `${commonUrl}/supply/vehicle-trip`
    }
    return $axios(service, data)
  },
  getRoute (data) {
    const service = {
      method: 'get',
      url: `${commonUrl}/supply/route/${data}`
    }
    return $axios(service, '')
  },
  getLandarea (data) {
    const service = {
      method: 'get',
      url: `${commonUrl}/trip/findLandArea/${data}`
    }
    return $axios(service, '')
  },
  getTrack (data) {
    const service = {
      method: 'get',
      url: `${commonUrl}/supply/track`
    }
    return $axios(service, data)
  },
  getSite (data) {
    const service = {
      method: 'get',
      url: `${commonUrl}/site`
    }
    return $axios(service, data)
  }
}
