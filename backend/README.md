# Mamily Connect API

Initial backend foundation: Django REST Framework, PostgreSQL, and JWT email
authentication. The existing frontend login still uses demo behavior; it will be
connected after the API and employee directory are in place.

## Local setup

From this directory in Command Prompt:

```cmd
py -3.14 -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
copy .env.example .env
```

Create a dedicated database role and database. Connect to the PostgreSQL server
as `postgres` from Command Prompt:

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d postgres
```

At the `postgres=#` prompt, run these statements. `\password` prompts for the
application password without echoing it; use that same password for `DB_PASSWORD`
in `.env`.

```sql
CREATE ROLE mamily_app WITH LOGIN;
CREATE DATABASE mamily_connect OWNER mamily_app;
\password mamily_app
\q
```

Edit `.env` with `DB_NAME=mamily_connect`, `DB_USER=mamily_app`, and the password
you just set. Keep `.env` private and do not commit it.

```cmd
python manage.py check
python manage.py makemigrations accounts
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Authentication endpoints

- `POST /api/auth/token/` with `email` and `password` returns access and refresh
  tokens. The access token includes the user's role.
- `POST /api/auth/token/refresh/` with `refresh` returns a new access token.
- `GET /api/auth/me/` with `Authorization: Bearer <access>` returns the signed-in
  user's profile.

New accounts are created by an administrator; public registration is not enabled.
