import axios from 'axios'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export const http = axios.create({
    //baseURL: 'http://192.168.0.15:8092/api/'
    //baseURL: 'http://localhost:56486/api/'
    baseURL: 'https://lastecweb01.azurewebsites.net/api/'
})