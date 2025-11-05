import fs from 'fs';
import { generateKeyPairSync } from 'crypto';
import ssh2 from 'ssh2';
import axios from 'axios';
import dotenv from 'dotenv';
import { createContactForm } from './ui.js';

const { Server } = ssh2;

// Load environment variables
dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3000/api/contact';
// heroku przypisuje PORT, ale ssh potrzebuje custom portu
// dla heroku trzeba użyć tunelu albo railway/fly.io
// użyje SSH_PORT jeśli ustawiony, inaczej PORT, inaczej domyślnie 2222
const SSH_PORT = parseInt(
  process.env.SSH_PORT || 
  process.env.PORT || 
  '2222', 
  10
);
const SSH_HOST = process.env.SSH_HOST || '0.0.0.0';
const SSH_PASSWORD = process.env.SSH_PASSWORD || null;

// generuj lub załaduj host keys - jeśli nie ma to wygeneruje
const HOST_KEY = fs.existsSync('./host.key')
  ? fs.readFileSync('./host.key')
  : generateHostKey();

function generateHostKey() {
  console.log('warning: no host.key found. generating a new one...');
  console.log('warning: for production, generate a proper key with:');
  console.log('    ssh-keygen -t rsa -b 4096 -f host.key -N ""');

  // dla dev tylko - używamy prostego klucza
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });

  fs.writeFileSync('./host.key', privateKey);
  console.log('ok generated host.key (development only)');
  return privateKey;
}

async function submitToAPI(formData) {
  try {
    const response = await axios.post(API_URL, {
      ...formData,
      source: 'ssh',
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.status === 200;
  } catch (error) {
    console.error('API submission error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return false;
  }
}

// Create SSH server
const sshServer = new Server({
  hostKeys: [HOST_KEY],
}, (client, info) => {
  console.log(`client connected from ${info.ip}`);

  let authenticated = false;
  let sessionStream = null;

  client.on('authentication', (ctx) => {
    // jeśli hasło ustawione, wymagaj autentykacji
    if (SSH_PASSWORD) {
      if (ctx.method === 'password') {
        if (ctx.password === SSH_PASSWORD) {
          ctx.accept();
          authenticated = true;
        } else {
          ctx.reject();
        }
      } else {
        ctx.reject(['password']);
      }
    } else {
      // brak hasła wymagany - otwarty dostęp
      ctx.accept();
      authenticated = true;
    }
  });

  client.on('ready', () => {
    console.log('ok client authenticated');

    client.on('session', (accept) => {
      const session = accept();
      let ptyInfo = null;

      session.on('pty', (accept, reject, info) => {
        ptyInfo = info;
        const ptyStream = accept();
        if (ptyStream) {
          ptyStream.columns = info.cols;
          ptyStream.rows = info.rows;

          // Set terminal type for blessed
          if (info.term) {
            process.env.TERM = info.term;
          }
        }
      });

      session.on('window-change', (accept, reject, info) => {
        if (sessionStream) {
          sessionStream.columns = info.cols;
          sessionStream.rows = info.rows;
          sessionStream.emit('resize');
        }
        accept && accept();
      });

      session.on('shell', (accept) => {
        try {
          sessionStream = accept();
          if (!sessionStream) {
            console.error('failed to accept shell session');
            return;
          }

          // ustaw właściwości terminala PRZED tworzeniem ui - blessed jest wymagający
          if (ptyInfo) {
            sessionStream.columns = ptyInfo.cols || 80;
            sessionStream.rows = ptyInfo.rows || 24;
            sessionStream.isTTY = true;
            sessionStream.isRaw = true; // raw mode dla właściwego input handlingu
          } else {
            // domyślny rozmiar terminala jeśli pty nie ustawiony
            sessionStream.columns = 80;
            sessionStream.rows = 24;
            sessionStream.isTTY = true;
            sessionStream.isRaw = true; // raw mode dla właściwego input handlingu
          }

          // ustaw typ terminala dla właściwego renderowania
          process.env.TERM = ptyInfo?.term || 'xterm-256color';
          process.env.COLUMNS = String(sessionStream.columns);
          process.env.LINES = String(sessionStream.rows);

          // obsługa błędów streamu - czasem się zdarza
          sessionStream.on('error', (err) => {
            console.error('stream error:', err.message);
          });

          // użyj blessed ui - główne ui
          setTimeout(() => {
            try {
              console.log('creating contact form with blessed ui');
              createContactForm(sessionStream, async (formData) => {
                return await submitToAPI(formData);
              });
            } catch (err) {
              console.error('error creating contact form:', err);
              sessionStream.write('\r\nError initializing form. Please try again.\r\n');
              sessionStream.write(`Error: ${err.message}\r\n`);
              // nie kończ streamu od razu, daj użytkownikowi zobaczyć błąd
              setTimeout(() => sessionStream.end(), 5000);
            }
          }, 100);
        } catch (err) {
          console.error('error in shell handler:', err);
        }
      });

      session.on('exec', (accept, reject, info) => {
        // nie pozwalaj na wykonywanie komend - to tylko kontakt, nie shell
        reject();
      });
    });
  });

  client.on('error', (err) => {
    console.error('client error:', err.message);
  });

  client.on('end', () => {
    console.log('client disconnected');
  });
});

sshServer.on('error', (err) => {
  console.error('ssh server error:', err);
});

// start server - czasem się zapala, czasem nie, ale zazwyczaj działa
sshServer.listen(SSH_PORT, SSH_HOST, () => {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                                                               ║');
  console.log('║   pcstyle.dev SSH Contact Form Server                        ║');
  console.log('║                                                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`ok listening on ${SSH_HOST}:${SSH_PORT}`);
  console.log(`ok api endpoint: ${API_URL}`);
  console.log(`ok authentication: ${SSH_PASSWORD ? 'Password required' : 'Open access'}`);
  console.log('');
  console.log('connect with:');
  console.log(`  ssh -p ${SSH_PORT} ${SSH_HOST === '0.0.0.0' ? 'localhost' : SSH_HOST}`);
  console.log('');
  console.log('press Ctrl+C to stop the server');
});

// graceful shutdown - czasem się przydaje jak trzeba restartować
process.on('SIGINT', () => {
  console.log('\n\nshutting down ssh server...');
  sshServer.close(() => {
    console.log('ok server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n\nshutting down ssh server...');
  sshServer.close(() => {
    console.log('ok server closed');
    process.exit(0);
  });
});
