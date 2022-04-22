import axios from 'axios';
import {io} from 'socket.io-client'
const instance = axios.create({
    baseURL: 'https://instagram-clone-backend1223.herokuapp.com'
})
const socketUrl = 'https://instagram-clone-backend1223.herokuapp.com'
export const socket = io(socketUrl);
export default instance;