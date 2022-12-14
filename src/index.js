const express = require("express");
const https = require("https");
const fs = require('fs');
const override = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require('cors');
const {Server} = require('socket.io')
const Sockets = require('./config/socket.io');
const mongoStore = require('connect-mongo');
require('dotenv').config();

// Initializations
const app = express();
require("./config/diskStorage");
require("./database").then(uri => {
    app.use(session({
        secret: "TF&^Q4U:r{gGM&hB?V,~V:*7-yB*T:",
        resave: false,
        saveUninitialized: true,
        store: mongoStore.create({
            mongoUrl: uri,//'mongodb+srv://urssito:Ciredin231+@cluster0.vosld.mongodb.net/?retryWrites=true&w=majority',
            stringify: true,
            autoRemove: 'native',
            autoRemoveInterval: 1,
            ttl: 14 * 24 * 60 * 60
        })
    }));
})

// settings
app.set('trust proxy', 1);
app.set("port", process.env.PORT || 8080);
const hosts = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://44.210.211.88',
    'https://luccagram.online',
    'https://44.210.211.88',
    'https://www.luccagram.online',
    'https://d3qoqxwfkyacye.cloudfront.net/',
    'http://192.168.0.54:3000',
    'http://192.168.0.54:8080',
    'http://25.56.26.90:3000'
];

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser('TF&^Q4U:r{gGM&hB?V,~V:*7-yB*T:'));
app.use(override("_method"));
app.use(cors({
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);

        if(hosts.indexOf(origin) !== -1){
            return callback(null, true);
        }else{
            console.log(origin)
            const msg = 'ruta de origen no autorizada.';
            return callback(new Error(msg), false);
        }

    },
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Routes
app.use(require("./routes/index"));
app.use(require("./routes/publications"));
app.use(require("./routes/users"));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'..','node_modules')));
app.use(express.static(path.join(__dirname, '..', 'app', 'public')));


let server = null;
console.log('enviroment:',process.env.NODE_ENV)
if(process.env.NODE_ENV === 'production'){
    server = https.createServer({
        key: fs.readFileSync(path.join(__dirname,'..','private.key')),
        cert: fs.readFileSync(path.join(__dirname,'..','certificate.crt')),
        ca: fs.readFileSync(path.join(__dirname,'..','ca_bundle.crt'))
    }, app).listen(app.get('port'), () => {
        console.log('server on port', app.get('port'));
    });
    
}else{
    server = app.listen(app.get('port'), () => {
        console.log('server on port', app.get('port'));
    });

}

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'public', 'index.html'), (err) => {
        if(err) res.status(500).send(err);
    })
})
// server is listening

const io = new Server(server,{
    cors: {
        origin: [
            'http://localhost:8080',
            'http://localhost:3000',
            'http://44.210.211.88',
            'https://luccagram.online',
            'https://44.210.211.88',
            'https://www.luccagram.online',
            'https://d3qoqxwfkyacye.cloudfront.net/',
            'http://192.168.0.54:3000',
            'http://25.56.26.90:3000'
        ]
    },
    
});
app.set('socketio', io);

Sockets(io);