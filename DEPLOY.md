# Deployment Guide — matteosnozzi.ch

SvelteKit frontend deployed on the same VM as Directus, behind Traefik as reverse proxy.

---

## Architecture

```
Internet
   │
Traefik (ports 80/443, Let's Encrypt TLS)
   ├── cms.progetta.ch  →  directus container (port 8055)
   └── www.matteosnozzi.ch  →  frontend container (port 3000)
       ↑ matteosnozzi.ch redirects here automatically

Both containers share the external Docker network: web
```

---

## Prerequisites

- VM with Docker & Docker Compose v2 installed
- Your backend `docker-compose.yml` (Traefik + Directus) already deployed
- DNS A records pointing `matteosnozzi.ch` and `www.matteosnozzi.ch` to your VM's IP
- Git installed on the VM

---

## Step 1 — Make the `web` network external (one-time, on the VM)

Your backend compose currently creates `web` as an internal network.  
To share it with the frontend, you need to convert it to an **external** named network.

### 1a. Create the shared network

```bash
docker network create web
```

### 1b. Update your backend `docker-compose.yml`

At the bottom of the backend compose, change:

```yaml
# BEFORE
networks:
  web:
    external: false
  internal:
    external: false
```

```yaml
# AFTER
networks:
  web:
    external: true   # ← was false
  internal:
    external: false
```

### 1c. Restart the backend stack

```bash
# In your backend directory
docker compose down
docker compose up -d
```

Traefik and Directus will re-attach to the now-external `web` network.

---

## Step 2 — Clone the frontend repository on the VM

```bash
git clone <your-repo-url> /opt/frontend
cd /opt/frontend
```

---

## Step 3 — Create the `.env` file

```bash
cp .env.example .env
```

The defaults are already correct for this project, but verify:

```
PUBLIC_DIRECTUS_URL=https://cms.progetta.ch
ORIGIN=https://www.matteosnozzi.ch
```

You do **not** need to change anything unless your Directus URL differs.

---

## Step 4 — Build and start the frontend

```bash
docker compose up -d --build
```

This will:
1. Build the SvelteKit app inside Docker using Bun
2. Start the `frontend` container on port 3000 (internal only)
3. Register the container with Traefik via Docker labels
4. Traefik will automatically request a Let's Encrypt TLS certificate

---

## Step 5 — Verify

```bash
# Check the container is running
docker compose ps

# Follow logs
docker compose logs -f frontend

# Test HTTP → HTTPS redirect
curl -I http://www.matteosnozzi.ch

# Test non-www → www redirect
curl -I https://matteosnozzi.ch
```

Visit https://www.matteosnozzi.ch — you should see the site with a valid TLS certificate.

---

## Updating the site (re-deploy)

```bash
cd /opt/frontend
git pull
docker compose up -d --build
```

Docker will rebuild the image and replace the running container with zero-downtime (Traefik buffers requests).

---

## Environment variables reference

| Variable | Required at | Description |
|---|---|---|
| `PUBLIC_DIRECTUS_URL` | Build-time + Runtime | Base URL of the Directus CMS |
| `ORIGIN` | Runtime | Canonical URL of the SvelteKit app — used for CSRF protection |
| `PORT` | Runtime | Port the Node server listens on (default: `3000`, set in Dockerfile) |

---

## Troubleshooting

### Container starts but Traefik returns 404
- Confirm the `web` network is external and both stacks are connected to it:
  ```bash
  docker network inspect web
  ```

### TLS certificate not issued
- Make sure DNS is propagated before starting the container
- Check Traefik logs: `docker logs traefik`

### Build fails with missing env vars
- `PUBLIC_DIRECTUS_URL` is injected as a Docker build arg — the default in `docker-compose.yml` is `https://cms.progetta.ch`. Override in `.env` if needed.

### CSRF / `403 Forbidden` errors
- Ensure `ORIGIN=https://www.matteosnozzi.ch` is set in `.env` (must match the exact URL users visit)
