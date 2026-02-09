export const docs = `
# SnapURL 🚀

**Upload images. Get URLs. Done.**

SnapURL is a developer‑focused SaaS image upload and delivery platform designed for avatars, social media assets, and application‑only image usage. It provides a secure, fast, and simple API to upload images and retrieve public URLs, backed by a full dashboard, API key management, and authentication.

---

## Table of Contents

* [Overview](#overview)
* [Key Features](#key-features)
* [Use Cases](#use-cases)
* [Architecture (High‑Level)](#architecture-highlevel)
* [Authentication & API Keys](#authentication--api-keys)
* [API Reference](#api-reference)

  * [Upload Single Image](#upload-single-image)
* [Security Considerations](#security-considerations)
* [Rate Limiting](#rate-limiting)
* [Error Handling](#error-handling)
* [Dashboard](#dashboard)
* [Best Practices](#best-practices)
* [FAQ](#faq)

---

## Overview

SnapURL abstracts away image storage, validation, and delivery so developers can focus on building products instead of managing files. With one API call, you can upload an image and instantly receive a publicly accessible URL optimized for application use.

SnapURL is **not** a general‑purpose media CDN for heavy video or untrusted uploads. It is optimized for **application‑controlled images** such as:

* User avatars
* Profile pictures
* Thumbnails
* App‑generated assets

---

## Key Features

* ⚡ **Fast image uploads** with minimal latency
* 🔑 **API key–based authentication**
* 📦 **Single‑image upload API** (simple by design)
* 🌍 **Public image URLs** ready to embed anywhere
* 🧑‍💻 **Developer dashboard**
* 🔐 **Secure, scoped access** per project
* 📊 **Usage visibility** (uploads, bandwidth)

---

## Use Cases

* Store and serve **user avatars** in SaaS products
* Upload **social media preview images**
* Host **application‑generated images** (charts, exports, thumbnails)
* Replace local image handling in frontend apps

---

## Architecture (High‑Level)

\`\`\`
Client (Web / Mobile / Server)
        │
        │ multipart/form‑data
        ▼
SnapURL API ──▶ Validation ──▶ Secure Storage ──▶ Public URL
        │
        ▼
   Dashboard & API Keys
\`\`\`

---

## Authentication & API Keys

All API requests must be authenticated using an **API key**.

* API keys are generated in the SnapURL Dashboard
* Each key is scoped to a specific project
* Keys must be kept secret and never exposed in public repositories

### Auth Header

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

---

## API Reference

### Upload Single Image

Uploads a single image and returns a public URL.

**Endpoint**

\`\`\`
POST http://exmaple.com/api/images/upload
\`\`\`

> ⚠️ This URL is a placeholder. Replace with your actual SnapURL API domain in production.

---

### Request Headers

| Header        | Value               | Required |
| ------------- | ------------------- | -------- |
| Authorization | Bearer \`API_KEY\`    | ✅        |
| Content-Type  | multipart/form-data | ✅        |

---

### Request Body (multipart/form‑data)

| Field | Type | Required | Description                                 |
| ----- | ---- | -------- | ------------------------------------------- |
| image | File | ✅        | Image file to upload (jpg, png, webp, etc.) |

---

### Example cURL

\`\`\`bash
curl -X POST http://exmaple.com/api/images/upload \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image=@avatar.png"
\`\`\`

---

### Successful Response (201)

\`\`\`json
{
  "success": true,
  "data": {
    "id": "img_9f82k2",
    "url": "https://cdn.snapurl.dev/images/img_9f82k2.png",
    "width": 512,
    "height": 512,
    "size": 34211,
    "contentType": "image/png",
    "createdAt": "2026-02-01T10:20:30Z"
  }
}
\`\`\`

---

### Error Responses

#### 400 – Invalid File

\`\`\`json
{
  "success": false,
  "error": "Invalid image format"
}
\`\`\`

#### 401 – Unauthorized

\`\`\`json
{
  "success": false,
  "error": "Invalid or missing API key"
}
\`\`\`

#### 413 – File Too Large

\`\`\`json
{
  "success": false,
  "error": "Image exceeds maximum allowed size"
}
\`\`\`

---

## Security Considerations

* Only authenticated requests are allowed
* File type validation is enforced server‑side
* Executable and non‑image files are rejected
* Public URLs are **read‑only**
* API keys can be rotated from the dashboard

---

## Rate Limiting

To ensure platform stability, SnapURL enforces rate limits per API key.

Typical limits:

* **Uploads:** X requests / minute
* **Burst protection:** Enabled

(Exact limits depend on your plan.)

---

## Dashboard

The SnapURL Dashboard allows you to:

* Create and revoke API keys
* View uploaded images
* Monitor usage and bandwidth
* Manage projects and environments

---

## Best Practices

* Upload images from **backend services** when possible
* Never expose API keys in frontend code
* Validate image size and type client‑side before upload
* Cache returned URLs in your database
* Use SnapURL only for application‑owned assets

---

## FAQ

### Is SnapURL free?

SnapURL offers free and paid plans depending on storage and bandwidth usage.

### Can I delete images?

Image deletion is managed from the dashboard (or via future API versions).

### Is image optimization supported?

Automatic optimization may be applied depending on your plan and image type.

---

## SnapURL Philosophy

> **Simple API. Predictable behavior. Zero file‑handling headaches.**

SnapURL is built for developers who want image uploads to *just work*.

`;
