import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }
 
    async getResults() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = '5e595fc73b6662893bfa673b6ed7b381';
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
             this.result = res.data.recipes;
        } catch(error) {
            alert(error);
        }
    
    }
    
}
