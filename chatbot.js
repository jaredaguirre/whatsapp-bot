const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
var cron = require('node-cron');

// Common Chat IDs
const ID_ME = '5491121573752@c.us'
const ID_DROPBOX = '5491121573752-1541375978@g.us'

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
    cron.schedule('* * * * *', async () => {
        client.sendMessage(ID_DROPBOX, 'Mensaje cada 1 minuto');
    });
    cron.schedule('*/2 * * * *', async () => {
        client.sendMessage(ID_DROPBOX, 'Cron en el segundo minuto');
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
        msg.reply(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    }
})

// Event: Async Triggers when received an alien message
client.on('message', async msg=>{

    if(msg.body === '/sendid'){     //Captures on console the chat ID where the message is coming from
        console.log(msg.from)
    }
})

// Starts the client
client.initialize();