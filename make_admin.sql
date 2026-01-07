-- SQL command to make user admin
-- Update the role from 'user' to 'admin' for the specified user

UPDATE "public"."user_profiles"
SET "role" = 'admin', "updated_at" = NOW()
WHERE "id" = '734ebe9d-700f-476a-89c9-059cf8bb4089'
   OR "email" = 'cashlink256@gmail.com';

-- Verify the update
SELECT "id", "email", "name", "role", "updated_at"
FROM "public"."user_profiles"
WHERE "id" = '734ebe9d-700f-476a-89c9-059cf8bb4089';

