import axios from 'axios';

const Axios = axios.create({
  baseURL: `${process.env.SERVER_URL}`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Axios;
