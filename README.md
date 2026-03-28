# Zap Form — Setup Guide

A static HTML contact form connected to **Supabase** (data storage) and **Zapier** (Gmail notifications), hosted on **Vercel**.

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

-- Allow anonymous inserts (public form)
alter table submissions enable row level security;

create policy "Allow public inserts"
  on submissions for insert
  to anon
  with check (true);
```

3. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL` in `script.js`
   - **anon / public key** → `SUPABASE_ANON_KEY` in `script.js`

---

## 2. Zapier Setup

1. Go to [zapier.com](https://zapier.com) → **Create Zap**.
2. **Trigger** → choose *Webhooks by Zapier* → *Catch Hook* → copy the webhook URL → paste as `ZAPIER_WEBHOOK_URL` in `script.js`.
3. **Action 1** → *Gmail* → *Send Email*
   - To: your notification email
   - Subject: `New form submission from {{name}}`
   - Body: `Name: {{name}}\nEmail: {{email}}\nMessage: {{message}}`
4. *(Optional)* **Action 2** → *Supabase* → *Create Row* (alternative to the direct REST call if you prefer Zapier to handle storage too).
5. Turn the Zap **ON**.

---

## 3. Update script.js

Open `script.js` and replace the three placeholder values at the top:

```js
const SUPABASE_URL      = "https://<your-project-ref>.supabase.co";
const SUPABASE_ANON_KEY = "<your-anon-key>";
const ZAPIER_WEBHOOK_URL  = "https://hooks.zapier.com/hooks/catch/<your-hook-id>/";
```

---

## 4. Deploy to Vercel

```bash
# Install Vercel CLI (once)
npm i -g vercel

# From the project folder
vercel
```

Or connect the GitHub repo in the [Vercel dashboard](https://vercel.com/new) for automatic deployments on every push.

---

## File Structure

```
zap-form/
├── index.html    # Contact form
├── style.css     # Styles
├── script.js     # Supabase + Zapier logic
├── vercel.json   # Vercel config
└── README.md
```
