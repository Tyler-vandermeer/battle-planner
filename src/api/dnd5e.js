import axios from 'axios';

export default axios.create({
    baseURL: 'https://www.dnd5eapi.co/api',
});