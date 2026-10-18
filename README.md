# CipherAuth Lab

An executable educational application demonstrating reversible byte transformations and a separate Argon2id based authentication flow. CART-256 is experimental classroom material, not a secure cipher. Never use it for real data or passwords.

## Architecture and objectives

React/Vite serves the interactive dashboard. Express performs every CART-256 operation and returns a teaching trace. MongoDB/Mongoose stores account email and encoded Argon2id verifier. Express sessions use HttpOnly, SameSite cookies. Authentication and cipher modules are separate.

## Setup

Requirements: Node.js 20+, npm, and MongoDB Community (local service or hosted URI).

```powershell
npm install
Copy-Item .env.example .env
```

Edit `.env`; set `MONGODB_URI`, a long random `SESSION_SECRET`, and `CLIENT_ORIGIN`. Start MongoDB before the API. For a local MongoDB installation, start its service or run `mongod --dbpath <your-data-directory>`.

For the seeded demonstration account, set a demo password in your local `.env` (never commit it): `DEMO_PASSWORD=Demo@1234!`, then run `npm run seed`. This produces a real Argon2id verifier. Alternatively register through the UI; passwords must be at least 10 characters and include upper/lowercase, a number, and symbol. Start development servers using `npm run dev`; open http://localhost:5173. API is on port 3000. Production build: `npm run build`; configure HTTPS and a persistent Mongo session store before public deployment.

## CART-256 specification

For UTF-8 byte input P of length n and modulus M=256, generate a random 16-byte nonce. Derive 32 bytes K = HMAC-SHA256(UTF8(key), nonce). The teaching API deliberately returns K and intermediate values; this is unsafe for real encryption.

For byte i: a=K[i mod 32] OR 1, b=K[(i+5) mod 32], c=K[(i+11) mod 32], r=K[(i+17) mod 32] mod 8, d=K[(i+23) mod 32]. Then x=(p+b) mod 256; y=(ax+c) mod 256; t=ROTL8(y,r); z=t XOR d. Let s=K[31] mod n. Place z at C[(i+s) mod n]. Transmitted ciphertext is Base64 with nonce, algorithm/version, and original byte length.

Decryption reverses position rotation, XOR, then bit rotation. Since a is odd it is invertible modulo 256. Extended Euclid finds a⁻¹, then y=ROTR8(z XOR d,r), x=a⁻¹(y−c) mod 256, p=x−b mod 256. UTF-8 is decoded strictly. There is no authentication tag: incorrect keys and tampering can produce plausible bytes/text and are not reliably detectable.

### Worked example from actual runtime

The application creates a fresh random nonce, so intermediate values are generated at runtime and shown in the UI's byte table, selected-byte view, and exposed teaching schedule. Click Encrypt and select a row to obtain the exact values for that run; ciphertext and trace are not fixed examples. This avoids publishing invented or stale intermediate values.

## Authentication versus encryption

Registration validates inputs, generates an Argon2id verifier with unique salt, and saves only that verifier. Settings: memory 19,456 KiB, time cost 2, parallelism 1. Login retrieves the verifier and calls Argon2id verification; it never decrypts a password. Passwords travel to the backend and production must use HTTPS. This local demonstration uses in-memory Express sessions; for production use a persistent session store, TLS, a secret manager, monitoring, and review appropriate to deployment.

## API

`POST /api/auth/register`, `/login`, `/logout`; `GET /api/auth/me`; `POST /api/cipher/encrypt`, `/decrypt`; `GET /api/demo/status`. Authentication rate limiting and Helmet security headers are enabled. The demo endpoint reports Mongo connection status. No plaintext password, cipher key, or verifier is logged or returned.

## Tests

Run `npm test`. Tests cover sample and Unicode round trips, malformed data, and modular inverses for all odd bytes. MongoDB dependent auth integration tests require a running database and are not bundled into the standalone mathematical unit suite.
