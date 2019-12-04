const express = require('express');
const app = express();
const axios = require('axios');

app.set('view engine', 'ejs');

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.render('index')
});

const RESOURCE_PATH = 'http://api.github.com/search/users?q=';

app.post('/search', (req, res) => {
    axios.get(`${RESOURCE_PATH}${req.body.username}`)
        .then(response => {
            if (response.data && !!response.data['total_count']) {
              res.render('users', {users: response.data.items});
            } else {
              res.render('not-found');
            }
        }).catch(error => console.log(error));
});

const PORT = 8080;

app.listen(PORT);

console.log(`LISTENING ON PORT: ${PORT}`);
