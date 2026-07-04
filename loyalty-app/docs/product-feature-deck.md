# Chotto Matcha Loyalty App

## Product Feature Reference

This document summarizes the Chotto Matcha loyalty experience in product-facing language. It is organized by surface so it can be used for stakeholder review, handoff, or scope alignment.

---

## 1. Product Overview

Chotto Matcha Loyalty is a multi-surface loyalty platform for members, cashiers, and managers.

The product gives customers a simple way to track rewards, gives staff a fast counter workflow for earning and redeeming loyalty value, and gives managers the operational tools to maintain rewards, customers, staff, branches, and transaction history.

Core surfaces:

- Customer App
- Cashier Station
- Manager Console
- Shared Loyalty Ledger
- Shared Brand and UI System

---

## 2. Customer App

The customer app is a mobile-first loyalty experience for Chotto Matcha members.

### Account Access

- Email and password login
- Customer self-signup
- Magic-link sign-in support
- Persistent customer session
- Customer sign-out

### Home Dashboard

- Personalized greeting
- Current points balance
- Current loyalty tier
- Progress toward the next tier
- Quick access to customer QR/code display
- Quick access to rewards
- Recent activity preview

### Rewards Catalog

- Browse active rewards
- Reward cards with:
  - Reward name
  - Description
  - Point cost
  - Stock availability
  - Progress toward redemption
  - Ready/locked state based on customer balance
- Rewards grouped by availability:
  - Ready for you
  - Soon

### Customer Identification

- Customer can display their member code in-app
- Member code includes customer identity for cashier lookup
- Customer name and balance context shown on the code screen

### Activity Journal

- Customer can view earn, redemption, and adjustment history
- Activity rows show:
  - Transaction type
  - Date
  - Branch or reward context
  - Points added or deducted

### Profile

- Customer name
- Email
- Phone number
- Current loyalty tier
- Tier ladder
- Notification placeholder
- Preference placeholder
- Sign-out action

---

## 3. Cashier Station

The cashier station is a tablet-friendly counter workflow for identifying members, awarding points, and redeeming rewards.

### Shift Start

- Cashier roster by branch
- Cashier selection
- PIN-based shift start
- Active shift state
- Branch and cashier shown in the station header

### Shift Controls

- End shift
- Reset device/session
- Return to cashier selector

### Member Identification

- Member lookup screen
- Customer list fallback
- Manual member search fields
- Member detail handoff after selection

### Member Detail

- Customer name
- Phone number
- Current tier
- Current points balance
- Recent customer activity
- Award points action
- Redeem reward action

### Award Points

- Enter customer bill total
- Preview earned points before confirming
- Earn rate applied from manager settings
- Confirm award
- Customer balance updates
- Ledger row is created

### Redeem Reward

- View active rewards
- See which rewards are ready or locked
- Confirm reward redemption
- Customer points are deducted
- Reward stock is decremented when stock is tracked
- Ledger row is created

### Redemption Protection

Redemption is blocked when:

- Customer has insufficient points
- Reward is inactive
- Reward is out of stock
- Customer is inactive or missing
- Cashier or branch is inactive or invalid

---

## 4. Manager Console

The manager console is the operational back office for the loyalty program.

### Manager Access

- Email and password login
- Magic-link sign-in support
- Manager role authorization
- Manager sign-out

### Dashboard

- Active member count
- Total points issued
- Total points redeemed
- Branch count
- Recent ledger rows

### Reward Management

- View all rewards
- Add new rewards
- Edit existing rewards
- Archive rewards
- Restore archived rewards
- Manage stock count
- Upload reward images
- Replace reward images
- Image file type validation
- Image size validation

Reward fields include:

- Name
- Description
- Image
- Point cost
- Type
- Stock count
- Active/archive status

### Branch Management

- View branches
- Create branch
- Edit branch
- Deactivate branch
- Reactivate branch

Branch fields include:

- Branch name
- Address
- Active status

### Staff Management

- View staff
- Create cashier accounts
- Create manager accounts
- Assign cashiers to branches
- Set cashier PINs
- Reset cashier PINs
- Edit staff profiles
- Deactivate staff
- Reactivate staff
- Send account invitation links
- Generate temporary account credentials

Staff fields include:

- Name
- Email
- Role
- Branch assignment
- PIN status
- Active status

### Customer Management

- Search customers by name, email, or phone
- Create customer accounts
- Edit customer profiles
- Deactivate customers
- Reactivate customers
- Send customer invitation links
- Generate temporary account credentials

Customer fields include:

- Name
- Email
- Phone
- Tier
- Points balance
- Active status

### Manual Balance Adjustments

- Add or remove customer points
- Required adjustment reason
- Prevents adjustments that would create a negative balance
- Creates a manual transaction row in the ledger

### Transaction Ledger

- View earn, redemption, and manual adjustment transactions
- Filter transactions by:
  - Type
  - Branch
  - Customer
  - Date
- Rows include:
  - Date
  - Customer
  - Staff member
  - Branch
  - Transaction type or reward
  - Bill total when applicable
  - Points delta

### Settings

- Configure earn rate
- Configure organization display name

---

## 5. Loyalty System

The loyalty system connects customer, cashier, and manager workflows through a shared balance and transaction ledger.

### Points Earning

- Cashier enters bill total
- Earn rate is applied
- Points are calculated with floor-based rounding
- Customer balance increases
- Earn transaction is recorded

### Reward Redemption

- Reward must be active
- Customer must have enough points
- Reward must have stock when stock is tracked
- Customer balance decreases
- Reward stock decreases when applicable
- Redemption transaction is recorded

### Manual Adjustments

- Manager can add or subtract points
- Reason is required
- Adjustment must be a non-zero integer
- Balance cannot go below zero
- Manual transaction is recorded

### Tiers

- Customer tier is derived from points balance
- Current tier appears across customer, cashier, and manager views
- Customer sees progress toward next tier

---

## 6. Shared Platform Features

### Role-Based Surfaces

- Customer app for members
- Cashier station for branch staff
- Manager console for operations
- Product entry hub linking all surfaces

### Access Control

- Server-side session lookup
- Customer role authorization
- Cashier role and shift authorization
- Manager role authorization
- Separate access-denied screens by role

### Shared Data Model

The system shares one operational data model across:

- Users
- Roles
- Staff
- Customers
- Branches
- Rewards
- Assets
- Transactions
- Organization configuration

### Shared UI System

- Reusable buttons
- Cards
- Inputs
- Tables
- Pills
- Modals
- Toasts
- Navigation shells
- Brand components
- Internal design system reference

### Brand Experience

- Chotto Matcha visual identity applied across customer, cashier, and manager surfaces
- Consistent typography, color, spacing, and component language
- Product hub and internal design system reference page

---

## 7. Feature Summary By User

### Customers Can

- Create an account
- Sign in
- View points balance
- Track tier status
- Browse rewards
- See reward affordability
- Show member code at the counter
- Review recent activity
- View profile and contact details
- Sign out

### Cashiers Can

- Start a PIN-protected shift
- Identify members
- View customer details
- Award points from a bill total
- Redeem eligible rewards
- End shift
- Reset the cashier device session

### Managers Can

- Monitor loyalty program activity
- Manage rewards and stock
- Upload reward images
- Manage branches
- Manage staff and PINs
- Manage customers
- Adjust customer balances with reasons
- Review the transaction ledger
- Configure earn rate and organization name

---

## 8. Product Value

For customers:

- A simple loyalty experience that makes points, tiers, and rewards easy to understand.

For cashiers:

- A fast counter workflow for identifying members, awarding points, and redeeming rewards.

For managers:

- A centralized console for managing loyalty operations, staff, branches, customers, rewards, and ledger history.

For the business:

- One shared system of record for member balances, reward inventory, and loyalty transactions.
