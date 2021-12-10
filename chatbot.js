const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
var cron = require('node-cron');
const express = require('express')
const app = express()

// Some GET response to make Heroku work...
app.get('/', function (req, res) {
  res.send('Hi! This is the GET response!')
})
app.listen(process.env.PORT)

// Common Chat IDs
const ID_ME = '5491121573752@c.us'
const ID_DROPBOX = '5491121573752-1541375978@g.us'
const ID_AMIGOS = '5491130092739-1407104749@g.us'

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let session_data;
if(fs.existsSync(SESSION_FILE_PATH)) {
    session_data = require(SESSION_FILE_PATH);
}

const client = new Client({
    session: session_data,
    puppeteer: {
        args: [
            '--no-sandbox',
        ],
    }
});

// Event: Triggers when a QR code is generated. 
// Action: Draw a QR code received into the terminal
client.on('qr', (qr) => {
    qrcode.generate(qr, {small:true})
});

// Event: Triggers when client is ready and first connected.
// Action: Outputs a confirmation on the terminal
client.on('ready', () => {
    console.log('Client is ready!');  
});

// Event: Async Triggers when client is ready and first connected.
// Action: Starts a cronjob that sends a message.
client.on('ready', async() => {
    cron.schedule('0 10 28 12 *', async () => {
        client.sendMessage(ID_AMIGOS, 'Brace Yourselves! Hoy cumple Jaré!');
    });
    cron.schedule('* 10 3 8 *', async () => {
        client.sendMessage(ID_AMIGOS, 'Brace Yourselves! Hoy cumple Mati!');
    });
    cron.schedule('* 10 30 10 *', async () => {
        client.sendMessage(ID_AMIGOS, 'Brace Yourselves! Hoy cumple Enzo!');
    });
    cron.schedule('* 10 17 9 *', async () => {
        client.sendMessage(ID_AMIGOS, 'Brace Yourselves! Hoy cumple Gino!');
    });
    cron.schedule('* 10 17 8 *', async () => {
        client.sendMessage(ID_AMIGOS, 'Brace Yourselves! Hoy cumple Facu!');
    });
    cron.schedule('* 10 19 6 *', async () => {
        client.sendMessage(ID_AMIGOS, 'Brace Yourselves! Hoy cumple Ferni!');
    });
    cron.schedule('* 10 3 5 *', async () => {
        client.sendMessage(ID_AMIGOS, 'Brace Yourselves! Hoy cumple el Lea!');
    });
});

// Event: Triggers when client is authenticated.
// Action: Save the session object in a local pathfile
client.on('authenticated', (session) => {    
    
    session_data = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
});

// ---------- BOT ACTIONS --------------
// Event: Triggers when received an alien message
client.on('message', msg => {

    console.log(msg.body);              // Console log

    if (msg.body === '/ping') {         // Ping pong check
        msg.reply('pong');
    }
    else if (msg.body === '/date') {    // Returns the current date
        let date_ob = new Date();

        // Preparing date elements:
        
        let date = ("0" + date_ob.getDate()).slice(-2);         // adjust 0 before single digit date
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2); // current month
        let year = date_ob.getFullYear();       // current year
        let hours = date_ob.getHours();         // current hours
        let minutes = date_ob.getMinutes();     // current minutes
        let seconds = date_ob.getSeconds();     // current seconds

        // Prints in DD/MM/YY format:

        msg.reply(date + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds);
    }
})

// Event: Async Triggers when received an alien message
client.on('message', async msg=>{

    if(msg.body === '/sendid'){     //Captures on console the chat ID where the message is coming from
        console.log(msg.from)
        msg.reply(msg.from)
    }
})

// Starts the client
client.initialize();