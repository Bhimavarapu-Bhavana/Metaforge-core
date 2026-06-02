# Metaforge-core

A metadata-driven application runtime that converts JSON configurations into a working application for an internship demo build.

## Full-Stack Project Setup

This repository now includes a working Express backend and a static frontend served from `public/index.html`.

### Install dependencies

```bash
npm install
```

### Run the app

```bash
npm start
```

Then open `http://localhost:3000` in your browser.

### Backend API

- `GET /api/config` - returns the current default configuration
- `POST /api/config` - save a new configuration object
- `POST /api/validate` - validate a JSON configuration
- `GET /api/:entity` - returns sample entity data for the requested entity name
 - `GET /api/:entity` - returns sample entity data for the requested entity name
