import { Component } from 'react';
import axios from 'axios';



export default class Gets extends Component {
async componentDidMount() {
    try {
        const response = await axios.get('https://api.thedogapi.com/v1/breeds', {
            headers: {
                'x-api-key': process.env.REACT_APP_API_KEY,
            },
        });
        console.log(response.data);
    } catch (error) {}
}
}
