# TABLEFLOW — Premium QR Restaurant Ordering & Operations Platform

> **Phase 1 Frontend Architecture & Shared State Foundation**  
> Temporary brand: **THE SAFFRON PAVILION** (Fully configurable in Admin Settings)

TABLEFLOW is a production-oriented, mobile-first QR dining and operations platform connecting restaurant guests, waitstaff, kitchen expeditors, and administrators.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 3. Production Build Validation
```bash
npm run build
```
Builds cleanly with TypeScript checking into `dist/`.

---

## 🍽️ The 4 Core Interfaces

| Interface | Route | Target User & Experience |
|---|---|---|
| **Portal Hub** | `/` | Role launcher, system metrics, and end-to-end testing overview |
| **Customer QR Menu** | `/menu/:tableCode` (e.g. `/menu/T-04`) | Mobile-first warm cream aesthetic, culinary cards, dietary badges, search, cart drawer, and checkout |
| **Live Order Tracker** | `/track/:orderId` | Live multi-stage progress timeline (Placed → Confirmed → Cooking → Ready → Served), waiter summoning |
| **Waiter Dispatch** | `/staff/orders` | Operations dark slate UI, accept/reject tickets with required reasons, send to kitchen, mark served, bill settlement |
| **Kitchen Display (KDS)** | `/kitchen` | High-contrast tablet UI, active cooking timers, delay warnings, portion checklist, pass expediting |
| **Admin Portal** | `/admin` | Executive KPIs, menu catalog & instant Sold Out toggles, table QR tent cards & printable sheets, staff roster, payments ledger, analytics reports, and branding settings |

---

## 🔄 Live Synchronized State (Cross-Tab & LocalStorage)

All 4 interfaces are unified under a central `RestaurantContext` with automatic `localStorage` persistence and cross-tab storage event listeners. Actions in one tab or role immediately update all other views:

1. **Guest Order Submission**: Diner adds dishes at Table 04 and places order → Waiter Dashboard immediately rings with a new order ticket and blinking counter badge.
2. **Staff Acceptance & Dispatch**: Waiter clicks **Accept** and **Send to Kitchen** → Order immediately queues on the Kitchen Display System (KDS).
3. **Chefs Cook & Plate**: Kitchen clicks **Start Cooking** → Customer's `/track/:orderId` route updates to *"Chefs are crafting your dishes"*. Chef clicks **Plated & Ready** → Waiter Dashboard highlights *"Ready to Serve"*.
4. **Service & Settlement**: Waiter delivers to table and marks **Served**. The bill can be settled with one click in Waiter or Admin Ledger.
5. **Admin Availability Toggle**: Admin toggles a dish to **Sold Out** in `/admin/menu` → Customer QR menu immediately badges it *"Sold Out Today"* and disables adding it to cart.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) + custom luxury color palette (Warm Cream `#FAF8F5`, Forest Green `#132E22`, Muted Gold `#C5A880`, Slate `#090D14`)
- **Typography**: Playfair Display (Serif headers), Plus Jakarta Sans (Body), Outfit (Display)
- **Animations & Micro-interactions**: `motion/react` (Motion for React)
- **Icons**: `lucide-react`
- **QR Engine**: `qrcode.react` (SVG / Canvas generation for table badges and printable tent cards)
- **Celebrations**: `canvas-confetti`

---

## 📁 Project Structure

```
d:/ksv_files/Hotel_bookings/
├── index.html
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json
├── package.json
└── src/
    ├── types/
    │   └── index.ts                 # Strongly typed models: MenuItem, Order, Table, Staff, Settings
    ├── data/
    │   └── initialData.ts           # Realistic multi-stage Indian fine-dining menu and orders
    ├── context/
    │   └── RestaurantContext.tsx    # Central state provider with cross-tab reactive persistence
    ├── lib/
    │   └── utils.ts                 # INR currency (₹) formatter, timestamps, elapsed timers
    ├── components/
    │   └── common/
    │       ├── DemoBanner.tsx       # Top floating role switcher and demo reset controls
    │       ├── DietaryBadge.tsx     # Indian Veg / Non-Veg / Vegan / Egg badges
    │       └── StatusBadge.tsx      # Multi-stage order status & payment badges
    ├── features/
    │   ├── portal/
    │   │   └── LandingPortalPage.tsx# 4-role welcome launcher
    │   ├── customer/
    │   │   ├── components/
    │   │   │   ├── MenuHeader.tsx   # Table detection & Wi-Fi credentials drawer
    │   │   │   ├── CategoryTabs.tsx # Horizontal scrollable category filter
    │   │   │   ├── FoodCard.tsx     # Card with zoom, dietary badges, in-cart stepper
    │   │   │   ├── FoodDetailModal.tsx # Spice levels, cooking notes, portion stepper
    │   │   │   ├── CartDrawer.tsx   # Itemized subtotal, GST, service charge, grand total
    │   │   │   └── CheckoutModal.tsx# Dine-in checkout, guest notes, demo payments
    │   │   └── pages/
    │   │       ├── MenuPage.tsx     # Full customer QR experience (/menu/:tableCode)
    │   │       └── OrderTrackPage.tsx# Live timeline tracking (/track/:orderId)
    │   ├── staff/
    │   │   ├── components/
    │   │   │   ├── OrderCard.tsx    # Waiter ticket card with status actions
    │   │   │   ├── RejectReasonModal.tsx # Required rejection reason dialog
    │   │   │   └── OrderDetailsModal.tsx # Ticket inspector & counter bill settlement
    │   │   └── pages/
    │   │       └── WaiterDashboardPage.tsx # Waiter operations desk (/staff/orders)
    │   ├── kitchen/
    │   │   ├── components/
    │   │   │   ├── KitchenTicket.tsx# High-contrast ticket with delay timers & item checklist
    │   │   └── pages/
    │   │       └── KitchenDisplayPage.tsx # Tablet-optimized KDS (/kitchen)
    │   └── admin/
    │       ├── components/
    │       │   ├── AdminLayout.tsx  # Responsive sidebar navigation
    │       │   ├── MenuItemFormModal.tsx # CRUD modal for dishes
    │       │   └── TableQrModal.tsx # QR tent card modal with print action
    │       └── pages/
    │           ├── AdminOverviewPage.tsx  # Executive KPIs & live order stream (/admin)
    │           ├── AdminMenuPage.tsx      # Catalog management & availability toggle (/admin/menu)
    │           ├── AdminTablesPage.tsx    # Table manager & printable QR sheets (/admin/tables)
    │           ├── AdminStaffPage.tsx     # Staff directory & shifts (/admin/staff)
    │           ├── AdminPaymentsPage.tsx  # Orders & payments ledger (/admin/payments)
    │           ├── AdminReportsPage.tsx   # Sales charts & hourly volume (/admin/reports)
    │           └── AdminSettingsPage.tsx  # Brand info, GST %, service charges, Wi-Fi (/admin/settings)
    ├── App.tsx                      # Central router
    ├── main.tsx                     # React root
    └── index.css                    # Tailwind CSS v4 & custom design tokens
```

---

## ⚖️ Phase 1 Scope & Mock Boundaries

### ✅ Fully Implemented in Phase 1:
- All 4 functional interfaces with rich visual aesthetics and micro-interactions.
- Central shared state engine synchronizing order updates across all screens and browser tabs in real-time.
- Customer menu browsing, item modals with spice adjustments, cart drawer, checkout, and order tracking.
- Waiter order management (Accept, Reject with required reason, Send to Kitchen, Mark Served).
- Kitchen ticket queue, delay alerts, interactive item checkboxes, and pass expediting.
- Admin menu catalog with live Sold Out toggling, table QR tent cards and printable sheets, staff roles, payment ledger, and customizable settings.
- Universal top `DemoBanner` dock with instant role switching, table selection, and demo reset.

### 🔒 Explicitly Out of Scope (Deferred to Phase 2):
- Production Supabase database connection and live WebSocket channels.
- Real production staff JWT authentication & Row Level Security (RLS) enforcement.
- Razorpay / payment gateway charges (clearly labeled as Phase 1 Demo).
