# Portfolio Backend API

Node.js + Express backend for Devapriya Paul Kundu's portfolio contact form.

## What It Does

- Accepts contact form submissions at `POST /api/contact`
- Validates and sanitizes input
- Saves messages to MongoDB, or to `data/contacts.json` when MongoDB is not configured
- Sends email notifications with Nodemailer
- Provides a health endpoint at `GET /health`
- Uses rate limiting and CORS protection

## Run Locally

```bash
cd portfolio-backend
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux, use `cp .env.example .env` instead of `copy`. If PowerShell blocks `npm`, use `npm.cmd install` and `npm.cmd run dev`.

Fill in `.env` before using the contact form:

| Variable | Purpose |
| --- | --- |
| `PORT` | Local API port, usually `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `EMAIL_USER` | Gmail address used by Nodemailer |
| `EMAIL_PASS` | Gmail App Password |
| `EMAIL_TO` | Address that receives contact notifications |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs allowed by CORS |

Same-origin requests are allowed automatically, so the portfolio works at `http://localhost:5000` when the backend serves `index.html`.

If `MONGODB_URI` is missing, the server still starts and contact submissions are saved locally in `data/contacts.json`. Add MongoDB later when you want persistent cloud storage.

## API

### `GET /health`

Returns server and database status.

### `POST /api/contact`

Request body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "subject": "Hello",
  "message": "This is a test message."
}
```

Success response is `201` with the saved contact id and storage type. Validation errors return `400`, and rate limits return `429`.

## Deploy

For Render or similar services:

- Build command: `npm install`
- Start command: `node server.js`
- Set `NODE_ENV=production`
- Add all values from `.env.example` as environment variables
- Add any separately deployed frontend URL to `ALLOWED_ORIGINS`

When this backend serves the frontend, keep the contact endpoint as `/api/contact`. If the frontend is deployed separately, set `window.PORTFOLIO_BACKEND_URL` in `index.html` to the deployed backend contact endpoint, for example `https://your-api.example.com/api/contact`.
