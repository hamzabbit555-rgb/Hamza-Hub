
import 'dotenv/config';
import express from 'express';
import pino from 'pino';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from '@whiskeysockets/baileys';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send(`
    <!doctype html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Hamza Hub</title>
      <style>
        body {
          margin:0; padding:50px 16px;
          background:#07110e; color:#f2fff8;
          font-family:Arial,sans-serif; text-align:center;
        }
        main {
          max-width:450px; margin:auto; padding:30px;
          background:#10221b; border:1px solid #26bd83;
          border-radius:22px;
        }
        h1 { color:#36e6a0; font-size:38px; }
        p { line-height:1.7; color:#c5dfd2; }
      </style>
    </head>
    <body>
      <main>
        <h1>Hamza Hub</h1>
        <p>WhatsApp MD Bot</p>
        <p>Your bot project is ready for setup.</p>
        <p>Prefix: .</p>
      </main>
    </body>
    </html>
  `);
});

app.get('/health', (_req, res) => {
  res.json({ name: 'Hamza Hub', status: 'online' });
});

app.listen(PORT, () => {
  console.log(`Hamza Hub web server running on port ${PORT}`);
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(
    'sessions/default'
  );

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: ['Hamza Hub', 'Chrome', '1.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      console.log('Hamza Hub connected to WhatsApp!');
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;

      if (code !== DisconnectReason.loggedOut) {
        console.log('WhatsApp connection closed. Restart to retry.');
      } else {
        console.log('WhatsApp logged out. Re-link required.');
      }
    }
  });

  const commands = {
    menu: 'Hamza Hub Commands\n.alive\n.ping\n.info\n.help',
    alive: 'Hamza Hub is alive!',
    ping: 'Pong!',
    info: 'Hamza Hub WhatsApp MD Bot',
    help: 'Type .menu to view commands.'
  };

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const jid = msg.key.remoteJid;
      if (!jid || jid === 'status@broadcast' || jid.endsWith('@g.us')) {
        continue;
      }

      const body = msg.message.conversation ||
        msg.message.extendedTextMessage?.text || '';

      if (!body.startsWith('.')) continue;

      const command = body.slice(1).trim().split(/\s+/)[0].toLowerCase();
      const reply = commands[command];

      if (reply) {
        await sock.sendMessage(jid, { text: reply });
      }
    }
  });
}

startBot().catch(error => {
  console.error('Hamza Hub startup error:', error.message);
});
import 'dotenv/config';
import express from 'express';
import pino from 'pino';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from '@whiskeysockets/baileys';

const app = express();
const PORT = process.env.PORT || 3000;
const PREFIX = '.';

app.get('/', (_req, res) => {
  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Hamza Hub</title>
        <style>
          body {
            background:#07110e;color:#effff8;
            font-family:Arial,sans-serif;text-align:center;
            padding:60px 16px
          }
          .card {
            max-width:480px;margin:auto;padding:32px;
            border:1px solid #176b4c;border-radius:22px;
            background:#10221b
          }
          h1 {color:#38e6a0;font-size:38px}
          p {line-height:1.7;color:#c0d8cc}
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Hamza Hub</h1>
          <p>WhatsApp MD Bot</p>
          <p>Professional bot project is running.</p>
          <p>Commands: .menu · .alive · .ping · .info</p>
        </div>
      </body>
    </html>
  `);
});

app.get('/health', (_req, res) => {
  res.json({ bot: 'Hamza Hub', status: 'online' });
});

app.listen(PORT, () => {
  console.log(`Hamza Hub web server: port ${PORT}`);
});

const commands = {
  menu: 'Available commands: .alive, .ping, .owner, .help, .info',
  help: 'Use .menu to see available commands.',
  alive: 'Hamza Hub is alive!',
  ping: 'Pong! Hamza Hub is responding.',
  owner: 'Bot owner: Hamza',
  info: 'Hamza Hub WhatsApp MD Bot'
};

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(
    'sessions/default'
  );

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: ['Hamza Hub', 'Chrome', '1.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      console.log('Hamza Hub WhatsApp connected!');
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;

      if (code !== DisconnectReason.loggedOut) {
        console.log('Connection closed. Restart the process to reconnect.');
      } else {
        console.log('WhatsApp logged out. Re-link the account securely.');
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const jid = msg.key.remoteJid;
      if (!jid || jid === 'status@broadcast' || jid.endsWith('@g.us')) {
        continue;
      }

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        '';

      if (!text.startsWith(PREFIX)) continue;

      const command = text.slice(PREFIX.length)
        .trim().split(/\s+/)[0].toLowerCase();

      const reply = commands[command];

      if (reply) {
        await sock.sendMessage(jid, { text: reply });
      }
    }
  });
}

startBot().catch(error => {
  console.error('Hamza Hub startup failed:', error.message);
  process.exitCode = 1;
});
