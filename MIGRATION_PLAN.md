# User Roles Migration Plan

## Overview
We are updating the user role system from a single role per user to multiple roles per user. This will allow users to have different capabilities based on their roles, such as Basic, Applicant, Employer, Author, Sponsor, and Admin.

## Current Structure
- Users have a single `role` field of type `UserRole` enum
- Default role is `REGULAR`
- Roles: `REGULAR`, `BASIC`, `AUTHOR`, `SPONSOR`, `ADMIN`

## New Structure
- Keep the existing `role` field for backward compatibility
- Add a new `roles` relation to a `UserRoles` model
- Rename `REGULAR` to `BASIC` in the enum
- Add new roles: `APPLICANT` and `EMPLOYER`
- Final roles: `BASIC`, `APPLICANT`, `EMPLOYER`, `AUTHOR`, `SPONSOR`, `ADMIN`
- Each user can have multiple roles

## Migration Steps

### 1. Update Prisma Schema
1. Modify `UserRole` enum:
   - Remove `REGULAR`
   - Add `BASIC`, `APPLICANT`, `EMPLOYER`
2. Add new `UserRoles` model with `userId` and `role` fields
3. Update `User` model to include a relation to `UserRoles`
4. Change default role from `REGULAR` to `BASIC`

### 2. Generate and Run the Migration
```bash
npx prisma migrate dev --name multiple_user_roles
```

### 3. Run the Migration Script
This script will:
1. For each user, copy their current role to the new `user_roles` table
2. For users with `REGULAR` role, assign them a `BASIC` role in the new table
3. Update all users with `REGULAR` role to `BASIC` in the legacy role field

```bash
node prisma/migrations/migration_roles.js
```

### 4. Update Code to Support Multiple Roles
1. Update `AuthContext.js` to check for roles in both the legacy field and the new relation
2. Add new helper functions for role checking:
   - `hasRole(role)` - Checks if a user has a specific role
   - `hasAnyRole([roles])` - Checks if a user has any of the specified roles
   - `hasAllRoles([roles])` - Checks if a user has all of the specified roles
3. Update API endpoints to include roles in the response

### 5. Verify Migration
1. Check that all existing users have been assigned the correct roles
2. Test the role checking functions with different combinations of roles
3. Ensure that all features that rely on roles continue to work correctly

## Rollback Plan (if needed)
1. Revert schema changes
2. Run a reverse migration to remove the `user_roles` table
3. Restore any users that had `BASIC` role to `REGULAR` if needed

## Notes
- This migration maintains backward compatibility by keeping the original `role` field
- No data loss will occur as we're only adding new capabilities
- The approach allows for a gradual transition to the new role system 