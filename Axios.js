import axios from 'axios';

const url = process.env.SERVER_URL;

const Axios = axios.create({
  baseURL: url,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Axios;
