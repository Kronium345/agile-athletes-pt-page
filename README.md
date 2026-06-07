# Agile Athletes — Trainer Partner Landing Page

Static marketing page for personal trainer outreach. Deploy to **`https://agileathletes.app/trainers/`** or **`https://trainers.agileathletes.app`**.

## Local preview

```bash
cd trainer-landing
npm install
npm run dev
```

Opens at `http://127.0.0.1:3000`. No build step — production is plain HTML/CSS/JS.

Alternatively, open `index.html` in a browser or use any static file server.

## Project structure

```
trainer-landing/
├── index.html
├── css/styles.css
├── js/main.js
├── assets/
│   ├── logo.png
│   ├── favicon.png
│   ├── og-image.png          # 1200×630 for social previews
│   └── screenshots/            # Add App Store screenshots here
├── package.json                # Dev tooling only
└── README.md
```

## Configured links

| Item | Value |
|------|--------|
| App Store | [Agile Athletes on the App Store](https://apps.apple.com/gb/app/agile-athletes/id6758623960) |
| Privacy policy | [privacypolicies.com live policy](https://www.privacypolicies.com/live/a6611016-131d-4c88-a822-cbedda90c615) |
| Contact email | `kroniumtechlimited123@gmail.com` |
| Google Play | “Android coming soon” badge |

### Screenshots (`assets/screenshots/`)

| File | Used for |
|------|----------|
| `app-image-1.png` | Hero + preview carousel |
| `app-image-2.png` | Rest timer |
| `app-image-3.png` | Guided workout |
| `app-image-4.png` | Exercise detail & set tracking |
| `app-image-5.png` | Exercise library |
| `app-image-6.png` | Home with activity history |

### Environment variables (`.env`)

Copy `.env.example` to `.env` and fill in your EmailJS credentials:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `CONTACT_EMAIL` | Fallback contact / mailto recipient |
| `MAILTO_SUBJECT` | Subject line when EmailJS is not configured |
| `EMAILJS_PUBLIC_KEY` | EmailJS public key |
| `EMAILJS_SERVICE_ID` | EmailJS service ID |
| `EMAILJS_TEMPLATE_ID` | EmailJS template ID |

Run `npm run config` (or `npm run dev`) to generate `js/config.js` from `.env`.  
**Do not commit** `.env` or `js/config.js`.

On **Vercel/Netlify**, set the same variables in the project dashboard — the `build` script reads them from the environment at deploy time.

### Partner form (EmailJS)

If EmailJS IDs are empty in `.env`, submit falls back to **mailto** (unreliable on mobile).

1. Create a free account at [emailjs.com](https://www.emailjs.com/).
2. Add an **Email Service** (Gmail → `kroniumtechlimited123@gmail.com`).
3. Edit your **Contact Us** template (or create a new one) with the settings below.
4. Add keys to `.env`, then run `npm run config`.
5. EmailJS → Account → Security → add these to **Allowed origins**:
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
   - `https://agileathletes.app`
   - `https://trainers.agileathletes.app`

   A **403 Forbidden** error almost always means the current URL is missing from this list.

#### Template settings (EmailJS dashboard)

| Field | Value |
|-------|--------|
| **Template name** | Early Trainer Partner |
| **Subject** | `Early Trainer Partner enquiry — {{from_name}}` |
| **To Email** | `kroniumtechlimited123@gmail.com` |
| **Reply To** | `{{reply_to}}` |

#### Template content (paste into the Content editor)

Switch to **Code** view if the visual editor strips layout, then paste:

```html
<p>A new early trainer partner enquiry was submitted via agileathletes.app/trainers.</p>

<p><strong>{{from_name}}</strong> would like to learn more about Phase 1.</p>

<table style="border-collapse:collapse;width:100%;max-width:480px;font-family:sans-serif;font-size:14px;">
  <tr>
    <td style="padding:8px 12px;border:1px solid #eee;background:#fafafa;font-weight:600;">Name</td>
    <td style="padding:8px 12px;border:1px solid #eee;">{{from_name}}</td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #eee;background:#fafafa;font-weight:600;">Email</td>
    <td style="padding:8px 12px;border:1px solid #eee;">{{reply_to}}</td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #eee;background:#fafafa;font-weight:600;">Instagram / LinkedIn</td>
    <td style="padding:8px 12px;border:1px solid #eee;">{{handle}}</td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #eee;background:#fafafa;font-weight:600;">Location</td>
    <td style="padding:8px 12px;border:1px solid #eee;">{{location}}</td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #eee;background:#fafafa;font-weight:600;">Specialties</td>
    <td style="padding:8px 12px;border:1px solid #eee;">{{specialties}}</td>
  </tr>
</table>

<p style="margin-top:16px;font-weight:600;">Message</p>
<p style="margin:0;padding:12px;border:1px solid #eee;border-radius:8px;background:#fff;">{{message}}</p>

<p style="margin-top:20px;color:#666;font-size:13px;">Reply directly to this email to respond to {{from_name}}.</p>
```

**Variables used** (must match exactly — the site sends these automatically):

```
{{from_name}}
{{reply_to}}
{{user_email}}
{{handle}}
{{location}}
{{specialties}}
{{message}}
```

Copy the **Template ID** into `.env` as `EMAILJS_TEMPLATE_ID`, then run `npm run config`.

#### Troubleshooting: `412 Gmail_API: Request had insufficient authentication scopes`

This is **not a site bug** — EmailJS reached Gmail, but Google did not grant send permission. Fix it in the EmailJS dashboard (not in code):

**Option A — Reconnect Gmail (quick try)**

1. [EmailJS → Email Services](https://dashboard.emailjs.com/admin)
2. Open your Gmail service (`service_7sa1mrd` or whatever is in `.env`)
3. Click **Disconnect** next to your Gmail account
4. Optional but recommended: [Google Account → Third-party access](https://myaccount.google.com/permissions) → remove **EmailJS**
5. Back in EmailJS, click **Connect Account** and sign in with `kroniumtechlimited123@gmail.com`
6. On Google’s consent screen, **enable all permissions** — especially **“Send email on your behalf”** (Google often leaves these unchecked by default)
7. Click **Update Service**
8. Use EmailJS’s **Send test email** on that service page — must succeed before testing the landing page

**Option B — New Gmail service (if reconnect fails)**

1. Delete the broken Gmail service
2. **Add new service → Gmail** → connect with permissions enabled
3. Copy the new **Service ID** into `.env` → `npm run config`
4. In your template, set the service to the new one (or it uses default)

**Option C — SMTP instead of Gmail OAuth (most reliable for personal Gmail)**

1. Enable [2-Step Verification](https://myaccount.google.com/security) on your Google account
2. Create an [App Password](https://myaccount.google.com/apppasswords) (name it e.g. `EmailJS`)
3. EmailJS → **Add new service → SMTP server**
   - Host: `smtp.gmail.com`
   - Port: `587`
   - User: `kroniumtechlimited123@gmail.com`
   - Password: the 16-character app password (not your normal Gmail password)
   - Security: TLS
4. Send test email from EmailJS
5. Update `EMAILJS_SERVICE_ID` in `.env` with the new SMTP service ID → `npm run config`

## Deploy to Vercel

### Option A — `/trainers` path on `agileathletes.app`

**Subfolder deploy (recommended):**

```
website/
├── index.html              # optional stub for apex /
└── trainers/
    ├── index.html          # this landing page
    ├── css/
    ├── js/
    └── assets/
```

Push to GitHub, import in Vercel, set root to the repo. The page will be at `/trainers/`.

**Separate project with rewrites** — add `vercel.json` at project root:

```json
{
  "rewrites": [
    { "source": "/trainers", "destination": "/" },
    { "source": "/trainers/:path*", "destination": "/:path*" }
  ]
}
```

### Option B — `trainers.agileathletes.app` (simplest)

1. Deploy this folder as a Vercel/Netlify project.
2. Add custom domain: `trainers.agileathletes.app`.
3. DNS: **CNAME** `trainers` → your host URL (e.g. `your-project.vercel.app`).
4. SSL is automatic.

## DNS checklist (apex `agileathletes.app`)

| Record | Purpose |
|--------|---------|
| `A` / `ALIAS` `@` → Vercel/Netlify | Apex domain |
| `CNAME` `www` → host | Optional www |
| `CNAME` `trainers` → host | Subdomain approach |

`.app` domains require HTTPS — Vercel/Netlify handle this automatically.

## Performance & accessibility

- Mobile-first layout (breakpoints 768px, 1024px)
- Semantic HTML, focus states, lazy-load images below the fold
- Target Lighthouse mobile score 90+

## Out of scope (v1)

- Login / trainer profile creation on web
- Stripe Connect onboarding
- CMS or multi-page site

---

**Agile Athletes** · Kronium Tech Limited · iOS live · Android coming soon
