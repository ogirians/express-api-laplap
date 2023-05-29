
//express app
const express = require('express')
const app = express()
const port = 3233
var cors = require('cors')

app.use(cors())

//socket io

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: 'http://127.0.0.1:5173',
    }
  });

//conect postgre
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://itki:soetomo_dr@10.1.1.68:5487/simpp-dev')

//body parser untuk get body POST
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//pusher
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1608250",
    key: "4ed2cd399a138fc25a0d",
    secret: "234f2b055045d8bb5cf6",
    cluster: "ap1",
    useTLS: true
  });


//pusher client
// Enable pusher logging - don't include this in production
const PusherClient = require("pusher-js");

// PusherClient.logToConsole = true;
var pusherclient = new PusherClient('4ed2cd399a138fc25a0d', {
    cluster: 'ap1'
});
var channel = pusherclient.subscribe('my-channel');
channel.bind('my-event', function(data) {
    console.log(JSON.stringify(data));
});


//socket io setting
io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Handle chat messages
    socket.on('chat message', (msg) => {
      console.log(`Message: ${msg}`);
  
      // Broadcast the message to all other connected clients
      io.emit('chat message', msg);
    });
  
    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });


//untuk export excell
const json2xls = require('json2xls');

//untuk read/write file system
const fs = require('fs');
// const sql = fs.readFileSync('./soapie.sql').toString();

// connection.end()
function createXlsxFile() {
    return new Promise((resolve, reject) => {
        db.manyOrNone('select * from soapie_sql_v where tgl_pendaftaran >= $1 and tgl_pendaftaran < $2 limit 10000', ['2023-03-01 00:00:00', '2023-04-01 00:00:00'])
        .then((data) => {
            try {
                const jsonArray = data;
                const xls = json2xls(jsonArray);
               
                fs.writeFileSync('data.xlsx', xls, 'binary');
                // res.end(xls, 'binary');
                pusher.trigger("my-channel", "my-event", {
                    message: "berhasil download data excel"
                });
                resolve();
            } catch (error) {
                // Error handling code
            console.log('ERROR:', error)
            }
        })
        .catch((error) => {
            console.log('ERROR:', error)
        })
    });
}

app.get('/', async  (req, res) => {
    res.send('laplap api');
    io.emit('chat message', 'hello from server');
})

app.get('/get_excels', async  (req, res) => {
    res.send('xls sedang download');
    createXlsxFile();
})

app.post('/test-page', (req, res) => {
    var name = req.body.name;
        // color = req.body.color;
    res.send(name);
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})