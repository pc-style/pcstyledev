# Heroku Deployment Guide for SSH Contact Server

**WAŻNE:** Heroku ma ograniczenia - nie obsługuje bezpośrednio serwerów SSH (TCP), tylko HTTP/HTTPS. 

## Opcje Deploy SSH Servera

### Heroku - NIE DZIAŁA dla SSH
Heroku routuje tylko HTTP/HTTPS. SSH to protokół TCP, więc Heroku nie może routować połączeń SSH bezpośrednio.

**Jeśli chcesz użyć Heroku:**
- Musisz użyć tunelu (np. Cloudflare Tunnel, ngrok)
- Albo użyj alternatywnej platformy (Railway, Fly.io)

### Railway.app (RECOMMENDED)
Railway obsługuje SSH serwery bezpośrednio i jest łatwy w użyciu.

#### Kroki:

1. **Zainstaluj Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Zaloguj się:**
```bash
railway login
```

3. **W katalogu ssh-server, zainicjalizuj projekt:**
```bash
cd ssh-server
railway init
```

4. **Utwórz serwis:**
```bash
# Opcja A: Utwórz serwis bezpośrednio (najprostsze)
railway add --service ssh-contact

# Opcja B: Utwórz serwis z linkiem do GitHub (wymaga połączenia Railway z GitHub)
railway add --service ssh-contact --repo pc-style/pcstyledev

# Opcja C: Interaktywny wizard (naciśnij Enter dla pustych wartości jeśli nie chcesz linkować repo)
railway add
```

**Uwaga:** Jeśli Railway nie może znaleźć repozytorium:
- Upewnij się że Railway jest połączone z GitHub (dashboard → Settings → Connections)
- Albo pomiń `--repo` i deployuj bezpośrednio z lokalnego katalogu używając `railway up`

5. **Ustaw zmienne środowiskowe:**
```bash
railway variables --set API_URL=https://pcstyle.dev/api/contact
railway variables --set SSH_PORT=22
railway variables --set SSH_HOST=0.0.0.0
```

Albo wszystkie naraz:
```bash
railway variables --set API_URL=https://pcstyle.dev/api/contact --set SSH_PORT=22 --set SSH_HOST=0.0.0.0
```

6. **Deploy:**
```bash
railway up
```

7. **Skonfiguruj publiczne TCP proxy:**
   - Idź do Railway dashboard
   - Settings > Networking > Public Networking
   - Włącz TCP proxy na porcie 22

8. **Ustaw DNS:**
   - Dodaj A record dla `ssh.pcstyle.dev` → IP z Railway
   - Albo użyj Railway domain (np. `ssh.pcstyle.up.railway.app`)

### Fly.io (Alternatywa)
Fly.io też obsługuje SSH serwery.

#### Kroki:

1. **Zainstaluj Fly CLI:**
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Zaloguj się:**
```bash
fly auth login
```

3. **W katalogu ssh-server, stwórz fly.toml:**
```toml
app = "pcstyle-ssh-contact"
primary_region = "iad"

[build]
  builder = "heroku/buildpacks:20"

[[services]]
  internal_port = 22
  protocol = "tcp"
  
  [[services.ports]]
    port = 22
    handlers = ["tls", "raw"]
```

4. **Deploy:**
```bash
fly launch
fly secrets set API_URL=https://pcstyle.dev/api/contact
fly deploy
```

5. **Ustaw DNS:**
```bash
fly certs add ssh.pcstyle.dev
```

### DigitalOcean Droplet (Najbardziej kontrolowane)

1. **Stwórz droplet ($6/miesiąc)**
2. **SSH do serwera:**
```bash
ssh root@your-droplet-ip
```

3. **Zainstaluj Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Sklonuj repo i setup:**
```bash
git clone https://github.com/pc-style/pcstyledev.git
cd pcstyledev/ssh-server
npm install
```

5. **Stwórz .env:**
```bash
cat > .env << EOF
API_URL=https://pcstyle.dev/api/contact
SSH_PORT=22
SSH_HOST=0.0.0.0
NODE_ENV=production
EOF
```

6. **Wygeneruj host key:**
```bash
ssh-keygen -t rsa -b 4096 -f host.key -N ""
```

7. **Stwórz systemd service:**
```bash
sudo nano /etc/systemd/system/ssh-contact.service
```

Wklej:
```ini
[Unit]
Description=pcstyle.dev SSH Contact Form
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/pcstyledev/ssh-server
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production
Environment=SSH_PORT=22
EnvironmentFile=/root/pcstyledev/ssh-server/.env

[Install]
WantedBy=multi-user.target
```

8. **Włącz i uruchom:**
```bash
sudo systemctl enable ssh-contact
sudo systemctl start ssh-contact
sudo systemctl status ssh-contact
```

9. **Ustaw DNS:**
   - Dodaj A record: `ssh.pcstyle.dev` → IP twojego dropleta

## Weryfikacja Deploymentu

Po deploy, przetestuj:

```bash
ssh ssh.pcstyle.dev
# lub jeśli używasz custom port:
ssh -p 2222 ssh.pcstyle.dev
```

Powinno się połączyć i pokazać formularz kontaktowy!

## Environment Variables

Upewnij się że masz ustawione:

- `API_URL` - URL do twojego Vercel API endpoint (https://pcstyle.dev/api/contact)
- `SSH_PORT` - Port SSH (22 dla production, 2222 dla dev)
- `SSH_HOST` - Host binding (0.0.0.0 dla wszystkich interfejsów)
- `SSH_PASSWORD` - (opcjonalne) Hasło dla autentykacji
- `NODE_ENV` - production

## Troubleshooting

### "Connection refused"
- Sprawdź czy serwer działa: `sudo netstat -tulpn | grep 22`
- Sprawdź firewall: `sudo ufw status`
- Sprawdź logi: `sudo journalctl -u ssh-contact -f`

### "Permission denied" (port 22)
- Port 22 wymaga root privileges
- Albo użyj `setcap`: `sudo setcap 'cap_net_bind_service=+ep' $(which node)`

### "Host key verification failed"
- Usuń stary key: `ssh-keygen -R ssh.pcstyle.dev`
- Albo użyj: `ssh -o StrictHostKeyChecking=no ssh.pcstyle.dev`

## Monitoring

Sprawdź logi:

```bash
# Railway
railway logs

# Fly.io
fly logs

# DigitalOcean/systemd
sudo journalctl -u ssh-contact -f
```

---

**Rekomendacja:** Użyj Railway.app - najłatwiejsze i działa od razu! 

