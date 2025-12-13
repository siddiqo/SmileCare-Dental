# Docker Setup Guide

## Prerequisites

- Docker installed on your system
- Docker Compose installed (usually comes with Docker Desktop)
- **MongoDB Atlas IP Whitelist**: Add `0.0.0.0/0` to your MongoDB Atlas Network Access to allow Docker containers to connect
  1. Go to https://cloud.mongodb.com
  2. Click "Network Access" (Security section)
  3. Click "ADD IP ADDRESS"
  4. Click "ALLOW ACCESS FROM ANYWHERE" (adds 0.0.0.0/0)
  5. Click "Confirm" and wait 1-2 minutes

## Quick Start

1. **Start all services:**
   ```bash
   docker-compose up
   ```

2. **Start in detached mode (background):**
   ```bash
   docker-compose up -d
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

4. **Stop and remove volumes (clean database):**
   ```bash
   docker-compose down -v
   ```

## Services

The Docker setup includes two services:

- **Backend** (Port 5000): Node.js/Express API server
- **Frontend** (Port 3000): React application

**Note:** The backend connects to your existing MongoDB Atlas database using the credentials in `SmileCare_Server/.env`

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: Your existing MongoDB Atlas database (all your data is preserved)

## Development

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild Containers

If you make changes to package.json or dependencies:

```bash
docker-compose up --build
```

### Execute Commands in Containers

```bash
# Backend
docker-compose exec backend npm install <package-name>

# Frontend
docker-compose exec frontend npm install <package-name>
```

### Database Access

Your application uses MongoDB Atlas (cloud database). All your existing data is preserved and accessible.

## Production Build

For production, you may want to:

1. Build optimized frontend:
   - Modify frontend Dockerfile to use multi-stage build
   - Serve static files with nginx

2. Set NODE_ENV=production in backend environment

3. Use secrets for sensitive environment variables

## Troubleshooting

### MongoDB Connection Error (IP Whitelist)

If you see "Could not connect to any servers in your MongoDB Atlas cluster":

1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Navigate to Network Access
3. Add IP address `0.0.0.0/0` (ALLOW ACCESS FROM ANYWHERE)
4. Wait 1-2 minutes for changes to propagate
5. Restart Docker: `docker-compose down && docker-compose up`

### Port Already in Use

If ports 3000 or 5000 are already in use, modify the port mappings in docker-compose.yml:

```yaml
ports:
  - "YOUR_PORT:CONTAINER_PORT"
```

### Node Modules Issues

If you encounter issues with node_modules:

```bash
docker-compose down -v
docker-compose up --build
```

### Clear Everything and Start Fresh

```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```
