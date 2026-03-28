# Zap Form

A static HTML contact form hosted on **Vercel**. Form submissions are sent to a **Zapier** webhook which handles both Gmail notifications and Supabase data storage.

## Architecture

```
User submits form
      │
      ▼
Zapier Webhook
      ├── Action 1: Gmail → Send email notification
      └── Action 2: Supabase → Insert row into submissions table
```

---

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → create a new project.
2. Open the **SQL Editor** and run:

```sql
create table submissions (
  id         bigint generated always as identity primary key,
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz default now()
);
```

> No RLS policy needed — Zapier connects via the service role key which bypasses RLS.

3. Go to **Project Settings → API** and copy the **service role key** for use in Zapier.

---

## 2. Zapier Setup

1. Go to [zapier.com](https://zapier.com) → **Create Zap**.
2. **Trigger** → *Webhooks by Zapier* → *Catch Hook* → copy the webhook URL.
3. **Action 1** → *Gmail* → *Send Email*
   - To: your notification email
   - Subject: `New form submission from {{name}}`
   - Body: `Name: {{name}}\nEmail: {{email}}\nMessage: {{message}}`
4. **Action 2** → *POST* → Type *json*
   - URL: `input supbase url with table`
   - Map fields: `name`, `email`, `message` → `{{name}}`, `{{email}}`, `{{message}}`
5. Turn the Zap **ON**.

---

## 3. Update script.js

Paste your Zapier webhook URL at the top of `script.js`:

```js
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/<your-hook-id>/";
```

> The request is sent without a `Content-Type` header to avoid a CORS preflight error — Zapier still parses the JSON body correctly.

---

## 4. Deploy to Vercel via GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<your-username>/zap-form.git
git branch -M main
git push -u origin main
```

Then go to [vercel.com/new](https://vercel.com/new) → import the repo → deploy. No build settings needed.

Every `git push` to `main` triggers an automatic redeployment.

---

## File Structure

```
zap-form/
├── index.html    # Contact form
├── style.css     # Styles
├── script.js     # Zapier webhook logic
├── vercel.json   # Vercel config
└── README.md
```
