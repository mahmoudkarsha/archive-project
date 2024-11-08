import axios from 'axios';

export const localServer = 'http://127.0.0.1:5678/';

const serverUrl = localServer;

export default axios.create({
    baseURL: serverUrl,
});
