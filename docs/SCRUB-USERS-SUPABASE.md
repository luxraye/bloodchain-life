# Supabase Auth scrub (pair with SCRUB-USERS.sql)

Postgres [`SCRUB-USERS.sql`](./SCRUB-USERS.sql) clears `public.users`. **Login still uses Supabase Auth** (`auth.users`). Do both.

## Option A — Dashboard (simplest)

1. Supabase → **Authentication** → **Users**
2. Delete every user except `giftjrnakedi@gmail.com` (or delete all, then re-invite yourself).
3. Open **giftjrnakedi@gmail.com** → **Edit user** → **App metadata** (raw JSON):

```json
{
  "role": "SUPER_ADMIN"
}
```

4. **User metadata** (optional):

```json
{
  "name": "Gift Jr Nakedi"
}
```

5. Copy the user **UUID** → run the Postgres insert in `SCRUB-USERS.sql` with that UUID in `"supabaseId"`,  
   **or** run:

```sql
UPDATE users
SET "supabaseId" = '<paste-supabase-uuid-here>',
    role = 'SUPER_ADMIN',
    status = 'ACTIVE'
WHERE email = 'giftjrnakedi@gmail.com';
```

6. Set / reset password in Supabase if needed.

## Option B — High Command Keymaster (after you can sign in as admin)

If one `ADMIN` / `SUPER_ADMIN` account still works:

1. Run Postgres scrub (without deleting that user), **or** scrub all and use Option A for Supabase only.
2. High Command → **Users** → provision staff with roles (see role list in README below).

`createUser` writes `app_metadata.role` in Supabase and a matching Prisma row.

## High Command access

Apps read **`app_metadata.role`** from the JWT. For High Command you need:

`ADMIN`, `SUPER_ADMIN`, or `MOH_AUDITOR`

(`SUPER_ADMIN` is the broadest; use that for your account.)
