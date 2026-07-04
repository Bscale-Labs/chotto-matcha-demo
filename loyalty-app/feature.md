# Chotto Matcha Loyalty Feature Inventory

Extracted from the current codebase on 2026-05-13.

This document is organized by feature rather than by route. "Visible across multiple screens" means the feature is either rendered directly on more than one screen or materially affects multiple screens through shared data, navigation, role checks, or actions.

## Public Entry And Shared Surfaces

| Feature | Current behavior | Source screens / modules | Visible across multiple screens |
| --- | --- | --- | --- |
| Product entry hub | Root page links into the customer app, cashier tablet, manager console, and design system. | `/`, `/customer`, `/cashier`, `/manager`, `/design-system` | Yes. It exposes all app surfaces from one entry screen. |
| Shared brand system | Common Chotto Matcha brand mark appears in public, customer, cashier, and manager layouts. | `components/shared/brand.tsx`, customer shell, cashier shell, manager shell | Yes. It anchors all role surfaces. |
| Shared UI primitives | Reusable buttons, cards, pills, modals, headings, tables, stats, inputs, and toasts support the role apps. | `components/shared/*` | Yes. These components are used throughout customer, cashier, and manager screens. |
| Design system reference | Dedicated design-system page is linked from the public entry hub for visual QA and component reference. | `/design-system` | No. It is a standalone internal/reference screen. |

## Authentication And Access Control

| Feature | Current behavior | Source screens / modules | Visible across multiple screens |
| --- | --- | --- | --- |
| Better Auth session handling | Server-side session lookup gates role-specific routes and redirects unauthenticated users to the correct login path. | `lib/auth/server.ts`, `lib/auth/session.ts`, `/api/auth/[...all]` | Yes. Every protected customer, cashier, and manager screen depends on it. |
| Role authorization | Users must have the matching `customer`, `cashier`, or `manager` role before protected data is returned. | `userRoles` schema, `requireCustomerSession`, `requireCashierSession`, `requireManagerSession` | Yes. It applies across all three role surfaces. |
| Access denied states | Separate access-denied screens explain missing or inactive profile links for each role. | `/customer/access-denied`, `/cashier/access-denied`, `/manager/access-denied` | Yes. Same authorization pattern, role-specific copy. |
| Password and magic-link sign in | Login forms accept email/password and can send secure email sign-in links. | `/customer/login`, `/manager/login`, `components/auth/email-login-form.tsx` | Yes. Customer and manager login use the same form. |
| Customer signup | Customers can create an account with name, email, phone, and password; a sign-in link is attempted after account creation. | `/customer/signup`, `app/customer/actions.ts`, `components/customer/customer-signup-form.tsx` | No. Signup is a dedicated onboarding screen, though the resulting profile appears across customer, cashier, and manager views. |
| Logout and session reset | Role-specific logout routes and shell actions clear sessions or shift state. | `/customer/logout`, `/manager/logout`, `/cashier/logout`, customer profile, cashier shell, manager shell | Yes. Sign-out controls appear in role shells or profile screens. |

## Customer App Features

| Feature | Current behavior | Source screens / modules | Visible across multiple screens |
| --- | --- | --- | --- |
| Customer shell and bottom navigation | Authenticated customer screens share top brand/profile access and bottom nav for Home, Rewards, Scan, Journal, and Profile. | `components/customer/customer-shell.tsx`, `components/customer/bottom-nav.tsx` | Yes. It appears across customer home, rewards, QR, activity, and profile. |
| Points balance | Customer point total is displayed prominently and drives affordability, tier progress, QR metadata, and manager/cashier views. | `/customer`, `/customer/rewards`, `/customer/qr`, `/customer/profile`, `/cashier/customer/[id]`, `/manager/customers` | Yes. This is one of the most cross-screen features. |
| Loyalty tiers | Points map to Seedling, Whisk, and Ceremony tiers with progress to the next tier. | `lib/loyalty.ts`, `components/customer/tier-badge.tsx`, `/customer`, `/customer/qr`, `/customer/profile`, `/cashier/customer/[id]`, `/manager/customers` | Yes. Tier state appears in customer, cashier, and manager contexts. |
| Customer home dashboard | Home shows greeting, balance, tier progress, QR/rewards shortcuts, featured rewards, and recent activity. | `/customer` | Yes. It previews rewards, QR, points, tiers, and activity from other feature areas. |
| Customer QR / scan code | QR screen renders a customer-id-based visual code placeholder and shows current points and tier status. | `/customer/qr` | Yes. It is used by the cashier identify workflow conceptually, but the code is currently a generated placeholder rather than a real QR library output. |
| Rewards catalog | Active rewards are split into "Ready for you" and "Soon" based on customer balance and stock. Reward cards show cost, stock, progress, and needed points. | `/customer/rewards`, `components/customer/reward-card.tsx`, `lib/data/rewards.ts`, `lib/points.ts` | Yes. Rewards also appear on customer home, cashier redemption, and manager reward management. |
| Reward filtering UI | Filter buttons for All, Drinks, Treats, and Merch are rendered. | `/customer/rewards` | No. Buttons are currently static UI; there is no implemented filter state or query behavior. |
| Activity journal | Activity screen lists recent earn, redeem, and manual adjustment transactions, with all-time earned points and moments logged. | `/customer/activity`, `lib/data/customers.ts`, `lib/data/rewards.ts`, `lib/data/branches.ts` | Yes. Transaction data also appears on customer home and manager ledger screens. |
| Customer profile | Profile screen shows initials, name, tier, email, phone, tier ladder, placeholder preference links, and sign out. | `/customer/profile` | Yes. Customer identity appears on customer profile, cashier lookup/detail, manager members, and transaction tables. |
| Customer profile preferences placeholders | Notifications and Preferences links are rendered but point to `#`. | `/customer/profile` | No. These are visible placeholders only on the profile screen. |
| Customer PWA manifest | Manifest starts the standalone app at `/customer` with Chotto Matcha theme colors. | `public/manifest.json` | No. Manifest is app-level metadata; icons are currently empty. |

## Cashier App Features

| Feature | Current behavior | Source screens / modules | Visible across multiple screens |
| --- | --- | --- | --- |
| Cashier shift selector | Cashier station lists active cashiers by branch; selecting a cashier and entering a PIN starts a shift cookie. | `/cashier`, `components/cashier/start-shift-form.tsx`, `app/cashier/actions.ts`, `lib/auth/shift.ts` | Yes. The active shift label appears throughout the cashier shell. |
| Cashier shell and navigation | Active cashier screens share brand, session label, End shift, Reset device, and nav links for Shift and Identify. | `components/cashier/cashier-shell.tsx`, `components/cashier/cashier-nav.tsx` | Yes. It appears on cashier shift, identify, member detail, award, and redeem screens. |
| End shift | Clears the cashier shift cookie and returns the station to the cashier selector. | `components/cashier/cashier-shell.tsx`, `app/cashier/actions.ts` | Yes. It is available from cashier shell screens. |
| Reset cashier device | Posts to the cashier logout route to reset the device session. | `components/cashier/cashier-shell.tsx`, `/cashier/logout` | Yes. It is available from cashier shell screens. |
| Member identification | Identify screen shows camera-scan UI and a manual member lookup list with phone/name search input. | `/cashier/identify` | Yes. It links into member detail, award, and redeem flows. Camera wiring is explicitly marked as future/demo placeholder. |
| Member detail | Shows active customer name, phone, tier, current points, and actions to award points or redeem rewards. | `/cashier/customer/[id]` | Yes. It bridges lookup, points awarding, redemption, customer identity, and loyalty tiers. |
| Award points | Cashier enters bill total, previews earned points using earn rate, confirms, and writes an earn transaction. | `/cashier/award`, `components/cashier/award-points-form.tsx`, `awardCustomerPoints`, `awardPoints` | Yes. The resulting points and ledger updates affect customer, cashier, and manager screens. |
| Redeem reward | Cashier sees active rewards, marks each reward Ready or Locked based on points, stock, and active state, then confirms redemption. | `/cashier/redeem`, `redeemCustomerReward`, `redeemReward` | Yes. It consumes customer points, decrements reward stock, and creates ledger rows visible elsewhere. |
| Cashier reward availability | Redemption is blocked by insufficient points, inactive rewards, or out-of-stock limited rewards. | `lib/points.ts`, `lib/data/transactions.ts`, `/cashier/redeem` | Yes. Same affordability and stock rules affect customer rewards and manager inventory. |
| Cashier login route | `/cashier/login` redirects to `/cashier`; there is no separate email/password branch-device login UI in the current code. | `/cashier/login`, `/cashier` | No. The implemented cashier access model is the station selector plus PIN shift. |

## Manager App Features

| Feature | Current behavior | Source screens / modules | Visible across multiple screens |
| --- | --- | --- | --- |
| Manager shell and navigation | Manager screens share brand, signed-in user pill, sign out, and navigation for Dashboard, Rewards, Branches, Staff, Customers, Transactions, and Settings. | `components/manager/manager-shell.tsx`, `components/manager/manager-nav.tsx` | Yes. It appears across all manager screens. |
| Manager dashboard | Dashboard shows active members, all-time points issued, all-time points redeemed, branch count, and recent ledger rows. | `/manager`, `lib/data/dashboard.ts`, `lib/data/manager.ts` | Yes. It summarizes customers, points, branches, and transactions from other feature areas. |
| Reward management | Managers can list rewards, add rewards, edit rewards, upload/replace reward images, archive/restore rewards, and adjust stock. | `/manager/rewards`, `/manager/rewards/new`, `/manager/rewards/[id]/edit`, `app/manager/actions.ts` | Yes. Reward data is visible in customer catalog, cashier redemption, and manager catalog screens. |
| Reward image storage | Reward image uploads validate file type and size, store object metadata, and expose images through upload routes. | `app/manager/actions.ts`, `lib/storage`, `/api/uploads/[...key]`, `assets` schema | Yes. Images can show in manager rewards and customer reward cards. |
| Branch management | Managers can list, create, edit, deactivate, and reactivate branches. | `/manager/branches`, `/manager/branches/new`, `/manager/branches/[id]/edit`, `app/manager/actions.ts` | Yes. Branches appear in cashier sessions, customer activity labels, manager dashboard, staff assignment, and transactions. |
| Staff management | Managers can list staff, create cashier or manager accounts, assign cashiers to branches, set/reset cashier PINs, edit staff, and deactivate/reactivate staff. | `/manager/staff`, `/manager/staff/new`, `/manager/staff/[id]/edit`, `components/manager/staff-create-form.tsx`, `app/manager/actions.ts` | Yes. Staff appears in cashier shift selection and manager transaction labels. |
| Staff invitations | Creating staff generates a temporary password and attempts to send an email sign-in link. | `createStaffAccount`, `components/manager/staff-create-form.tsx` | Yes. It connects manager administration with cashier/manager login. |
| Customer management | Managers can search members by name, email, or phone; create customers; edit contact details; deactivate/reactivate customers. | `/manager/customers`, `/manager/customers/new`, `/manager/customers/[id]/edit`, `components/manager/customer-create-form.tsx`, `app/manager/actions.ts` | Yes. Customer profiles are visible in customer, cashier, and manager surfaces. |
| Manual point adjustment | Managers can add or remove customer points with a required reason; adjustment writes a manual transaction and prevents negative balances. | `/manager/customers`, `adjustCustomerPoints`, `manualAdjustPoints` | Yes. Adjustments affect customer balance, customer activity, manager dashboard, and manager transactions. |
| Customer invitations | Manager-created customers get a temporary password and an attempted customer sign-in link. | `createCustomerAccount`, `components/manager/customer-create-form.tsx` | Yes. It connects manager customer creation with customer login/profile visibility. |
| Transaction ledger | Manager transaction screen lists transactions with filters for type, branch, customer ID, and date start. Rows include member, staff, branch, type/reward, bill, and points. | `/manager/transactions`, `listTransactionsWithLabels` | Yes. Ledger rows are created by cashier award/redeem and manager manual adjustment flows, and summarized on customer and manager dashboards. |
| Settings | Managers can edit earn rate and organization display name. Logo upload is explicitly out of scope in the UI. | `/manager/settings`, `updateSettings`, `lib/data/org-config.ts` | Yes. Earn rate affects cashier award previews and earn transaction calculations; org name affects display config. |

## Data, Rules, And Ledger Features

| Feature | Current behavior | Source screens / modules | Visible across multiple screens |
| --- | --- | --- | --- |
| Multi-role data model | Database separates auth users, role assignments, staff profiles, cashier branch details, customers, rewards, assets, transactions, branches, and org config. | `db/schema.ts` | Yes. All role surfaces share the same underlying data. |
| Points earning rule | Points are calculated as `floor(bill total * earn rate)` in the client preview and as `floor(billTotalCents * earnRate / 100)` in server writes. | `lib/points.ts`, `lib/data/transactions.ts`, `/cashier/award`, `/manager/settings` | Yes. This rule connects manager settings, cashier award, customer balances, and transaction history. |
| Points redemption rule | Rewards require active status, sufficient points, and stock if stock-limited; redemption deducts points and decrements stock in a transaction. | `lib/points.ts`, `lib/data/transactions.ts`, `/cashier/redeem` | Yes. It affects cashier redemption, customer catalog affordability, manager stock, and ledger views. |
| Manual adjustment rule | Manager adjustments require a reason, require non-zero integer delta, and cannot make customer balances negative. | `manualAdjustPoints`, `/manager/customers` | Yes. It affects customer balances and transaction views. |
| Transaction stamping | Earn, redeem, and manual rows track customer, staff, branch when applicable, points delta, bill/reward/reason, and timestamp. | `transactions` schema, `lib/data/transactions.ts` | Yes. Transactions appear on customer home, customer activity, manager dashboard, and manager transactions. |
| Active/inactive status filters | Customer, branch, staff, and reward activity states gate visibility and writes. | `db/schema.ts`, session guards, `listActiveRewards`, `listActiveBranches`, transaction actions | Yes. Status affects customer catalogs, cashier lookup/redeem/award flows, manager tables, and access controls. |

## Current Placeholders Or Gaps Visible In Code

| Area | What is visible now | Notes |
| --- | --- | --- |
| Customer QR | Visual code generated from customer ID | It is marked as an aria-labeled QR placeholder, not a real scannable QR implementation. |
| Cashier scanner | Camera scan panel | The page copy says camera wiring will land later; demo uses manual lookup. |
| Customer reward filters | Filter chips are shown | They do not currently filter the reward list. |
| Customer reward detail | Reward cards exist | There is no separate reward detail route in the current route tree. |
| Cashier recent transactions | Ledger writes exist | The cashier UI does not currently show a recent device transaction list. |
| Manager transaction export/detail | Filterable transaction table exists | CSV export and transaction detail pages are not implemented in the current route tree. |
| Manager org logo | Settings mentions logo asset | Logo upload remains out of scope in the visible UI. |
| PWA icons and cashier PWA scope | Manifest exists with `/customer` start URL | Icons array is empty and there is no separate cashier-specific manifest in the current code. |
