# Chotto Matcha Loyalty App - Agent Reference

Date: 2026-05-19
Repo: `/Users/lesmon/bscale-labs/projects/clients/chotto-matcha/loyalty-app`
Branch observed: `main`
Status: points-based demo/early core build; not complete against Appendix A.

Use this document as the handoff reference for a new agent. It summarizes what is actually implemented in the repository, what was verified, and what remains to close the Appendix A feature scope.

## Verification Performed

The following commands passed:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

`pnpm build` completed successfully on Next.js 16.2.4. It warned that `BETTER_AUTH_SECRET` in `.env.local` is too short / low entropy and should be replaced before production.

## Current Stack

- Next.js App Router with route prefixes by role:
  - `/customer/*`
  - `/cashier/*`
  - `/manager/*`
- React 19, Next 16, Tailwind CSS.
- Drizzle ORM over Postgres.
- better-auth with email/password and magic-link plugin.
- Resend integration for magic-link/invitation emails.
- S3-compatible storage adapter for reward images and uploaded assets.

Key files:

- `db/schema.ts` - main data model.
- `lib/auth/server.ts` - better-auth config.
- `lib/auth/session.ts` - server-side role/session guards.
- `lib/data/transactions.ts` - earn, redeem, and manual adjustment transaction logic.
- `app/customer/actions.ts` - customer signup.
- `app/cashier/actions.ts` - cashier shift and customer transaction actions.
- `app/manager/actions.ts` - manager CRUD/settings actions.
- `feature.md` - generated feature inventory from a prior audit.
- `docs/handoff.md` - older planned-build handoff; useful background, but some items are stale versus current code.

## Data Model Reality

The current model is points-only.

Implemented tables/concepts:

- Auth users, sessions, accounts, verification rows.
- Role assignments: `customer`, `cashier`, `manager`.
- Staff profiles and staff role details, including cashier branch assignment and PIN hash.
- Customers with `pointsBalance`.
- Branches.
- Assets.
- Rewards with `pointCost`, `type`, `stockCount`, `active`.
- Transactions with `pointsDelta`, bill/reward/reason metadata.
- Organization config as key/value rows.

Important limitation: there is no stamp/visit balance column, no reward stamp cost, no transaction stamp delta, and no loyalty mechanic enum/config that switches between point-based and visit-based modes.

## Auth And Access Control

Implemented:

- Server-side session lookup through better-auth.
- Role checks for customer/manager/cashier.
- Access-denied pages per role.
- Customer and manager email/password login.
- Magic-link sending for existing users.
- Customer self-signup with name/email/phone/password.
- Logout routes for customer, manager, and cashier.
- Cashier PIN shift cookie.

Partial or missing:

- Customer signup creates a user and sends a sign-in link, but route guards do not require `emailVerified`.
- Cashier has no separate email/password branch-device login UI; `/cashier/login` redirects to `/cashier`.
- Build warns that local `BETTER_AUTH_SECRET` is not production-grade.

## Customer App Current State

Implemented or mostly implemented:

- `/customer/login` - email/password plus magic link.
- `/customer/signup` - self-signup.
- `/customer` - home dashboard with greeting, points balance, tier progress, featured rewards, recent activity.
- `/customer/rewards` - active rewards catalog split into "Ready for you" and "Soon".
- `/customer/activity` - transaction/activity journal.
- `/customer/profile` - name, tier, email, phone, tier ladder, notification/preference placeholder links, sign out.
- `/customer/qr` - customer identification screen with customer ID and a visual code placeholder.

Known gaps:

- The QR is not a real QR code. It renders a deterministic grid pattern from `customer.id`; it is labeled as a QR placeholder in the markup.
- Reward category filter chips are static UI only.
- There are no separate reward detail pages.
- Notification and preference links intentionally point to `#`.
- Customer flow does not enforce email verification before access.

Relevant files:

- `app/customer/page.tsx`
- `app/customer/rewards/page.tsx`
- `app/customer/qr/page.tsx`
- `app/customer/activity/page.tsx`
- `app/customer/profile/page.tsx`
- `components/customer/reward-card.tsx`

## Cashier Station Current State

Implemented or mostly implemented:

- `/cashier` - active cashier selector by branch plus PIN entry.
- PIN start writes a signed shift cookie.
- End shift clears shift cookie.
- Reset device signs out and clears cashier shift.
- `/cashier/identify` - member list and scan-looking UI.
- `/cashier/customer/[id]` - member detail with phone, tier, points, recent customer activity, award/redeem actions.
- `/cashier/award` - bill total entry, earn preview, confirm points award.
- `/cashier/redeem` - active reward list, ready/locked states, confirm redemption.
- Backend award/redeem logic checks active staff, branch, customer, reward, stock, and sufficient balance.

Known gaps:

- No real camera access, QR decoding, or backend QR verification.
- Search inputs on identify screen are not wired; manual lookup is currently a full active-customer list.
- No cashier-side recent transactions list for the device/branch, aside from the selected customer detail's recent activity.
- No cashier-specific PWA manifest. The only manifest starts at `/customer`.
- No visit/stamp award path.

Relevant files:

- `app/cashier/page.tsx`
- `app/cashier/identify/page.tsx`
- `app/cashier/customer/[id]/page.tsx`
- `app/cashier/award/page.tsx`
- `app/cashier/redeem/page.tsx`
- `app/cashier/actions.ts`
- `components/cashier/start-shift-form.tsx`
- `components/cashier/award-points-form.tsx`

## Manager Console Current State

Implemented or mostly implemented:

- `/manager/login` - email/password plus magic link.
- `/manager` - dashboard with active members, points issued, points redeemed, branch count, recent ledger rows.
- Reward CRUD:
  - list, add, edit, archive/restore, stock adjust.
  - image upload and replacement with type/size validation.
- Branch CRUD:
  - list, create, edit, deactivate/reactivate.
- Staff CRUD:
  - list, create cashier/manager, assign branch for cashier, set/reset PIN, edit, deactivate/reactivate.
  - staff creation generates temporary password and attempts magic-link email.
- Customer CRUD:
  - search by name/email/phone, create, edit, deactivate/reactivate.
  - customer creation generates temporary password and attempts magic-link email.
- Manual point adjustment:
  - requires reason.
  - requires non-zero integer delta.
  - blocks negative resulting balance.
- Transaction ledger:
  - lists transactions with labels for customer/staff/branch/reward.
  - filters type, branch, customer ID, and from date.
- Settings:
  - earn rate and organization display name.

Known gaps:

- No transaction CSV export.
- No transaction detail pages.
- Transaction ledger search/filter UI has no `to` date input, although the backend filter type includes `to`.
- Settings do not include loyalty mechanic toggle.
- Settings do not include organization logo upload; the UI explicitly says logo upload remains out of scope.
- No visit/stamp mechanic controls.
- Invitations send sign-in links and expose a temporary password state, but there is no explicit "temporary credentials" email body.

Relevant files:

- `app/manager/page.tsx`
- `app/manager/rewards/page.tsx`
- `app/manager/branches/page.tsx`
- `app/manager/staff/page.tsx`
- `app/manager/customers/page.tsx`
- `app/manager/transactions/page.tsx`
- `app/manager/settings/page.tsx`
- `app/manager/actions.ts`

## Shared Surfaces Current State

Implemented:

- Product entry hub at `/`.
- Internal design-system page at `/design-system`.
- Shared UI components under `components/shared`.
- Customer, cashier, and manager shells/navigation.
- Chotto Matcha visual identity through shared colors, typography, and brand components.

Known gap:

- PWA support is minimal. `public/manifest.json` has `start_url: "/customer"` and `icons: []`; no separate cashier manifest is present.

## Appendix A Gap Diff

Legend:

- Done - materially available for ordinary operational use.
- Partial - visible or partially backed by data, but not complete enough for scope.
- Missing - not implemented.

### A.1 Customer App

| Feature | Status | Notes |
| --- | --- | --- |
| Login email/password | Done | Customer login form supports password and magic link. |
| Customer self-signup | Partial | Account creation exists; email verification is not enforced. |
| Points/stamp balance and tier display | Partial | Points and tiers exist; stamps do not. |
| Rewards catalog with cost, stock, progress | Done | Active reward cards show cost, stock, and progress. |
| Profile | Done | Name, tier, email, phone, sign out. |
| Customer identification at cashier via QR | Partial | Customer shows visual code and ID; not a real QR. |
| Name/email lookup backup | Partial | Cashier list shows name/phone; no functional search/filter and no email display there. |
| Recent activity on dashboard | Done | Home shows recent activity. |
| Notification/preference placeholders | Done | Links exist as placeholders. |
| Functional reward category filtering | Missing | Filter buttons are static. |
| Separate reward detail pages | Missing | No reward detail route. |

### A.2 Cashier Station

| Feature | Status | Notes |
| --- | --- | --- |
| Shift selector | Done | Active cashiers listed by branch. |
| PIN shift start/end/reset | Done | PIN start, end shift, reset route exist. |
| Member lookup by phone/name/list | Partial | List exists; search inputs are inert. |
| Member detail view | Done | Name, phone, tier, points. |
| Award points or stamps | Partial | Points only. |
| Redeem reward | Done | Active rewards, confirm flow. |
| Redemption blocking | Done | Backend blocks insufficient points, inactive reward, no stock. |
| Camera scanning with backend verification | Missing | Scan UI only. |
| Cashier-side recent transactions list | Missing | Only selected member recent activity exists. |
| Cashier PWA manifest | Missing | Only customer-start manifest exists. |

### A.3 Manager Console

| Feature | Status | Notes |
| --- | --- | --- |
| Login email/password | Done | Manager login exists. |
| Dashboard | Done | Key counts and recent ledger rows exist. |
| Reward CRUD | Done | Add/edit/archive/restore/stock. |
| Reward image upload validation | Done | File type and size validation. |
| Branch CRUD | Done | Create/edit/deactivate/reactivate. |
| Staff CRUD | Done | Create/edit/PIN/deactivate/reactivate; branch assignment for cashier. |
| Customer CRUD | Done | Search/create/edit/deactivate/reactivate. |
| Manual point/stamp adjustment | Partial | Point adjustment only; no stamps. |
| Transaction ledger filters | Partial | Type/branch/customer/from; UI lacks `to`. |
| Transaction CSV export | Missing | No route/action/button. |
| Settings mechanic toggle/rate/name/logo | Partial | Earn rate and org name only; no mechanic toggle or logo upload. |
| Staff invitation emails | Partial | Magic-link invite attempted; temp password shown in UI state. |
| Customer invitation emails | Partial | Same pattern as staff. |
| Transaction detail pages | Missing | No route. |

### A.4 Auth And Access Control

| Feature | Status | Notes |
| --- | --- | --- |
| Server-side session lookup with role gating | Done | Implemented in `lib/auth/session.ts`. |
| Role authorization | Done | Customer/cashier/manager role checks. |
| Access-denied screens | Done | Separate routes exist. |
| Password sign-in for managers | Done | `/manager/login`. |
| PIN-based cashier shifts | Done | Signed shift cookie. |
| Logout and session reset | Done | Role logout/reset routes. |
| Magic-link email sign-in | Done | Subject to provider/env. |
| Customer signup with email verification | Partial | Signup exists; verification requirement is not enforced. |

### A.5 Loyalty Mechanic, Data Model, And Ledger

| Feature | Status | Notes |
| --- | --- | --- |
| Multi-role data model | Done | Users, roles, staff, customers, rewards, transactions, branches, org config. |
| Configurable loyalty mechanic | Missing | No point/visit switch, stamp model, or change-control handling. |
| Point-based loyalty | Done | `floor(bill amount * earn rate)`. |
| Visit-based loyalty | Missing | No stamp/visit credit support. |
| Redemption rule | Done | Active reward + balance + stock. |
| Manual adjustment rule | Done for points | Reason/non-zero/no negative; no stamps. |
| Transaction stamping | Partial | Points delta, bill/reward/reason, customer/staff/branch/timestamp exist; no stamp delta. |
| Status filters affect visibility/writes | Done | Active states are used in key read/write paths. |

### A.6 Shared Surfaces

| Feature | Status | Notes |
| --- | --- | --- |
| Reusable UI components | Done | Shared buttons/cards/modals/tables/inputs/etc. |
| Chotto Matcha brand identity | Done | Applied across role surfaces. |
| Product entry hub | Done | Root page links surfaces and design system. |
| Internal design system reference | Done | `/design-system`. |

## Suggested Implementation Order For Next Agent

1. Implement real customer QR generation and cashier QR scan verification.
2. Wire cashier manual search by name/phone/email.
3. Add functional reward filtering and reward detail pages.
4. Add cashier branch/device recent transactions list.
5. Add transaction CSV export and transaction detail pages.
6. Add org logo upload in settings.
7. Decide whether Appendix A requires stamps for launch. If yes, introduce a proper loyalty mechanic migration rather than bolting stamps onto `pointsBalance`.
8. Add cashier-specific PWA manifest and proper icons.
9. Enforce customer email verification if required for launch.
10. Replace weak `BETTER_AUTH_SECRET` before any production deployment.

## Cautions For The Next Agent

- Do not trust route names alone. Several required features have UI placeholders without operational behavior.
- The current code uses server actions heavily; preserve that pattern unless there is a strong reason to add API routes.
- Keep ledger writes transactional. `lib/data/transactions.ts` is the critical integrity layer.
- Be careful with existing untracked files in the worktree. At audit time, screenshots, snapshots, `feature.md`, and `tmp/` were untracked.
- `docs/handoff.md` is useful for original intent, but this file is the current-state reference.
