# D1 Migration SQLite Compatibility Fix

## Root Cause

All five D1 migration files used MySQL-style inline `INDEX` declarations inside
`CREATE TABLE` statements. Cloudflare D1 is built on SQLite, which does **not**
support inline `INDEX` clauses within `CREATE TABLE`. This caused every
migration to fail with:

```text
near "INDEX": syntax error
```

In SQLite, indexes must be created with separate `CREATE INDEX` statements
after the table is created.

## Files Changed

| File                                             |
| ------------------------------------------------ |
| `migrations/0001_init_auth_schema.sql`           |
| `migrations/0002_sleep_records_reflections.sql`  |
| `migrations/0003_reminder_settings.sql`          |
| `migrations/0004_sync_and_conflict_metadata.sql` |
| `migrations/0005_program_progress.sql`           |

## Inline Indexes Removed

All inline `INDEX idx_xxx (column)` lines were removed from inside every
`CREATE TABLE` block across all five migration files. Dangling commas after
the final column or constraint in each `CREATE TABLE` were also removed.

### Summary count

| Migration                       | Tables                                                   | Inline INDEXes removed |
| ------------------------------- | -------------------------------------------------------- | ---------------------- |
| 0001_init_auth_schema           | 3 (users, sessions, otp_challenges)                      | 10                     |
| 0002_sleep_records_reflections  | 3 (sleep_records, reflections, sync_metadata)            | 7                      |
| 0003_reminder_settings          | 3 (reminder_settings, lesson_progress, user_preferences) | 4                      |
| 0004_sync_and_conflict_metadata | 3 (idempotency_keys, sync_conflicts, sync_log)           | 5                      |
| 0005_program_progress           | 1 (program_progress)                                     | 3                      |
| **Total**                       | **13**                                                   | **29**                 |

## Standalone Indexes Added

Each removed inline index was replaced with a standalone
`CREATE INDEX IF NOT EXISTS idx_xxx ON table(column);` statement placed
immediately after its corresponding `CREATE TABLE` block.

All original index names and indexed column names are preserved exactly.

### Index list by table

| Table               | Index                                 | Column             |
| ------------------- | ------------------------------------- | ------------------ |
| `users`             | `idx_users_email_normalized`          | `email_normalized` |
| `users`             | `idx_users_email_hash`                | `email_hash`       |
| `users`             | `idx_users_deleted_at`                | `deleted_at`       |
| `sessions`          | `idx_sessions_user_id`                | `user_id`          |
| `sessions`          | `idx_sessions_token_hash`             | `token_hash`       |
| `sessions`          | `idx_sessions_expires_at`             | `expires_at`       |
| `sessions`          | `idx_sessions_revoked_at`             | `revoked_at`       |
| `otp_challenges`    | `idx_otp_challenges_email_normalized` | `email_normalized` |
| `otp_challenges`    | `idx_otp_challenges_expires_at`       | `expires_at`       |
| `otp_challenges`    | `idx_otp_challenges_consumed_at`      | `consumed_at`      |
| `sleep_records`     | `idx_sleep_records_user_id`           | `user_id`          |
| `sleep_records`     | `idx_sleep_records_local_date`        | `local_date`       |
| `sleep_records`     | `idx_sleep_records_updated_at`        | `updated_at`       |
| `reflections`       | `idx_reflections_user_id`             | `user_id`          |
| `reflections`       | `idx_reflections_local_date`          | `local_date`       |
| `reflections`       | `idx_reflections_updated_at`          | `updated_at`       |
| `sync_metadata`     | `idx_sync_metadata_user_id`           | `user_id`          |
| `reminder_settings` | `idx_reminder_settings_user_id`       | `user_id`          |
| `reminder_settings` | `idx_reminder_settings_enabled`       | `enabled`          |
| `lesson_progress`   | `idx_lesson_progress_user_id`         | `user_id`          |
| `user_preferences`  | `idx_user_preferences_user_id`        | `user_id`          |
| `idempotency_keys`  | `idx_idempotency_keys_expires_at`     | `expires_at`       |
| `sync_conflicts`    | `idx_sync_conflicts_user_id`          | `user_id`          |
| `sync_conflicts`    | `idx_sync_conflicts_resolved_at`      | `resolved_at`      |
| `sync_log`          | `idx_sync_log_user_id`                | `user_id`          |
| `sync_log`          | `idx_sync_log_created_at`             | `created_at`       |
| `program_progress`  | `idx_program_progress_user_id`        | `user_id`          |
| `program_progress`  | `idx_program_progress_updated_at`     | `updated_at`       |
| `program_progress`  | `idx_program_progress_status`         | `status`           |

## Other MySQL Syntax Repaired

A full audit of all five migration files was performed for the following
MySQL-only syntax patterns:

```
AUTO_INCREMENT
UNSIGNED
ENGINE=
CHARSET
COLLATE
KEY
UNIQUE KEY
ENUM
JSONB
ON UPDATE CURRENT_TIMESTAMP
DEFAULT TRUE
DEFAULT FALSE
```

**No occurrences found.** The only MySQL-incompatible syntax was the inline
`INDEX` declarations. All `PRIMARY KEY`, `UNIQUE`, `REFERENCES`, `DEFAULT`,
and `TEXT`/`INTEGER` type usage is valid SQLite.

## Local Migration Result

Command: `npx wrangler d1 migrations apply somna-db --local`

**Result: ✅ All 5 migrations applied successfully**

```
0001_init_auth_schema.sql           ✅
0002_sleep_records_reflections.sql  ✅
0003_reminder_settings.sql          ✅
0004_sync_and_conflict_metadata.sql ✅
0005_program_progress.sql           ✅
```

Command: `npx wrangler d1 migrations list somna-db --local`

**Result: ✅ No migrations to apply (none pending)**

## Table List

Command:

```sql
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
```

**Application tables (13):**

| #   | Table               |
| --- | ------------------- |
| 1   | `idempotency_keys`  |
| 2   | `lesson_progress`   |
| 3   | `otp_challenges`    |
| 4   | `program_progress`  |
| 5   | `reflections`       |
| 6   | `reminder_settings` |
| 7   | `sessions`          |
| 8   | `sleep_records`     |
| 9   | `sync_conflicts`    |
| 10  | `sync_log`          |
| 11  | `sync_metadata`     |
| 12  | `user_preferences`  |
| 13  | `users`             |

System tables (managed by D1/SQLite): `_cf_METADATA`, `d1_migrations`, `sqlite_sequence`.

## Index List

Command:

```sql
SELECT name, tbl_name FROM sqlite_master WHERE type='index' ORDER BY tbl_name, name;
```

All 29 explicit `idx_*` indexes are present. Additionally, SQLite auto-generates
`sqlite_autoindex_*` indexes for `UNIQUE` and `PRIMARY KEY` constraints (these
are expected and correct — not user-defined).

**Explicit indexes by table:**

| Table               | Explicit Indexes |
| ------------------- | ---------------- |
| `idempotency_keys`  | 1                |
| `lesson_progress`   | 1                |
| `otp_challenges`    | 3                |
| `program_progress`  | 3                |
| `reflections`       | 3                |
| `reminder_settings` | 2                |
| `sessions`          | 4                |
| `sleep_records`     | 3                |
| `sync_conflicts`    | 2                |
| `sync_log`          | 2                |
| `sync_metadata`     | 1                |
| `user_preferences`  | 1                |
| `users`             | 3                |
| **Total**           | **29**           |

## Test Result

Command: `npm test` (vitest run)

**Result: ✅ 569 tests passed across 34 test files, 0 failed**

```
Test Files  34 passed (34)
     Tests  569 passed (569)
  Duration  8.54s
```

## Build Result

Command: `npm run build` (vite build)

**Result: ✅ Build succeeded**

```
✓ built in 4.47s
```

## What Was NOT Changed

Per requirements:

- No tables or columns were renamed
- No foreign key behavior was changed
- No UNIQUE constraints were modified
- No new business features were added
- No speculative schema changes were made
- Remote migrations were not applied (only local validation)

---

## Final Verdict

✅ **D1 MIGRATIONS LOCALLY VERIFIED**
