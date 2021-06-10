import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

const baseUrl = "http://192.168.3.81:10001";

const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  transformRequest: [(data) => qs.stringify(data, {skipNulls: true})]
}

const instance = axios.create({
  baseURL: baseUrl,
  ...axiosConfig
})

Vue.prototype.$axios = instance
Vue.prototype.$baseUrl = baseUrl

