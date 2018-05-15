import axios from 'axios'

export const instance = axios.create({
  baseURL: 'http://bibimpop.co'
});

export const BASE_URL = 'http://bibimpop.co'
