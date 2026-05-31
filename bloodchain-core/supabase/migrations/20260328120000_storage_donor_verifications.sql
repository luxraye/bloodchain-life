-- Supabase Storage: donor ID / verification documents (Azure, TrustBadge, DonorProfile)
-- Apply in Supabase Dashboard → SQL Editor, or via `supabase db push` if CLI is linked.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'donor-verifications',
  'donor-verifications',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "donor_verifications_insert_own" on storage.objects;
drop policy if exists "donor_verifications_select_own" on storage.objects;
drop policy if exists "donor_verifications_update_own" on storage.objects;
drop policy if exists "donor_verifications_delete_own" on storage.objects;

-- Authenticated users may manage objects only under a folder named with their auth UID (e.g. {uuid}/file.pdf)
create policy "donor_verifications_insert_own"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'donor-verifications'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "donor_verifications_select_own"
on storage.objects for select to authenticated
using (
  bucket_id = 'donor-verifications'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "donor_verifications_update_own"
on storage.objects for update to authenticated
using (
  bucket_id = 'donor-verifications'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "donor_verifications_delete_own"
on storage.objects for delete to authenticated
using (
  bucket_id = 'donor-verifications'
  and (storage.foldername(name))[1] = auth.uid()::text
);
