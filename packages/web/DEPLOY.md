# Deploy su VPS Hostinger

## Prerequisiti
- Accesso SSH al VPS
- nginx installato
- Dominio configurato (opzionale)

## 1. Build del progetto

```bash
cd beybladex-score
npm run build
```

La cartella `dist/` contiene tutti i file da caricare.

## 2. Upload sul VPS

### Opzione A: SCP (da locale)
```bash
scp -r dist/* user@tuo-vps:/var/www/beybladex/
```

### Opzione B: SFTP
Usa FileZilla o simile per caricare il contenuto di `dist/` in `/var/www/beybladex/`

## 3. Configurazione nginx

Crea il file `/etc/nginx/sites-available/beybladex`:

```nginx
server {
    listen 80;
    server_name beybladex.tuodominio.com;  # o l'IP del VPS
    root /var/www/beybladex;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service Worker - no cache
    location = /sw.js {
        expires off;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # SPA routing - tutte le route vanno a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Abilita il sito:
```bash
sudo ln -s /etc/nginx/sites-available/beybladex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4. HTTPS con Let's Encrypt (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d beybladex.tuodominio.com
```

## 5. Verifica

- Apri https://beybladex.tuodominio.com
- Testa l'installazione PWA (dovrebbe apparire il prompt "Aggiungi alla schermata home")
- Testa offline: attiva modalità aereo dopo la prima visita

## Aggiornamenti futuri

```bash
# Locale
npm run build

# Upload
scp -r dist/* user@tuo-vps:/var/www/beybladex/
```

## AdSense

Per attivare le pubblicità:
1. Modifica `src/components/layout/AdBanner.tsx`
2. Sostituisci `ca-pub-XXXXXXXXXXXXXXXX` con il tuo Publisher ID
3. Sostituisci il `data-ad-slot` con i tuoi slot ID
4. Rebuild e redeploy
