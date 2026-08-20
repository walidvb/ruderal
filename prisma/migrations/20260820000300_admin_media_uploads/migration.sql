-- ---------------------------------------------------------------------------
-- Admin media uploads
--
-- The admin edit forms upload images straight to the `media` bucket from the
-- browser, using the publishable key under the signed-in admin's session, so
-- the `authenticated` role needs write access to `storage.objects` for that
-- bucket. `admins` has no policies at all (see 20260820000200_admins), so a
-- plain policy referencing it directly would always see zero rows for the
-- `authenticated` role. `is_admin()` is SECURITY DEFINER to read past that,
-- but it takes no argument and only ever answers "is the *calling* session an
-- admin" -- it can't be used to probe anyone else's status.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION "public"."is_admin"()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM "public"."admins"
    WHERE "email" = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

REVOKE ALL ON FUNCTION "public"."is_admin"() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO authenticated;

CREATE POLICY "Admins can manage media objects"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'media' AND public.is_admin())
    WITH CHECK (bucket_id = 'media' AND public.is_admin());
