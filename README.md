# SmileCare Dental

Dental clinic booking site: React client (`SmileCare_Client`) and Express + MongoDB server (`SmileCare_Server`).

## Configuration

Secrets are never committed. Copy the example env files and fill in your own values:

```bash
cp SmileCare_Server/.env.example SmileCare_Server/.env
cp SmileCare_Client/.env.example SmileCare_Client/.env
```

`SmileCare_Server/.env` needs `MONGODB_URI`, `PORT`, and (to create the first admin) `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## Creating an admin account

With `ADMIN_EMAIL` and `ADMIN_PASSWORD` set in `SmileCare_Server/.env`, start the server and call the admin-creation route once:

```bash
curl -X POST http://localhost:5000/createAdmin
```

It creates the admin user if one with that email does not already exist. Then log in through the app with those credentials. Remove `ADMIN_PASSWORD` from the env afterwards if you like; it is only read by this route.
