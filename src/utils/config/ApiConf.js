import axios from 'axios'

export const instance = axios.create({
  baseURL: 'http://bibimpop.co',
  timeout: 5000,
});

export const BASE_URL = 'http://bibimpop.co'
