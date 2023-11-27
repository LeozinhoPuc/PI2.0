const express = require('express');
var path = require('path');
const router = require('./router');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
app.use(express.json());

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'controllers')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(router.routes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

