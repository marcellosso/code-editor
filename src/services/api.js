import axios from 'axios';

const api = axios.create({
    baseURL: 'https://my-json-server.typicode.com/open-veezoo/editor',
    //  baseURL: 'http://189.34.184.241:3000',
});

export default api;
