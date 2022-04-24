import axios from 'axios';
import {io} from 'socket.io-client'
const instance = axios.create({
    baseURL: 'http://localhost:5000'
})
const socketUrl = 'http://localhost:5000'
export const socket = io(socketUrl);
export default instance;