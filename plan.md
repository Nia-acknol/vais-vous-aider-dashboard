# Implementation Plan - SMARTBRAISE RDC

Digital platform for managing ecological charcoal in DRC.

## Scope & Non-Goals
- **Goals**: 
  - User authentication (Admin/Client).
  - Order management with deposits and tracking.
  - Real-time stock tracking for charcoal and raw materials.
  - Production management linked to material consumption.
  - Admin dashboard with statistics and charts.
- **Non-Goals**: 
  - External payment gateway integration (simulated via status updates).
  - Real-time GPS tracking of deliveries.
  - Real-world printer integration for labels.

## User Constraints & Persistence
- **Constraint**: No server-side database (PostgreSQL/Flask) is available in this specific session.
- **Strategy**: 
  - The application will be built as a high-fidelity **React/Frontend-only** application.
  - Data persistence will be simulated using `localStorage`.
  - Authentication will be simulated via client-side state and protected routes.
  - The requested Flask/PostgreSQL structure will be provided as *reference files* (code blocks/scripts) in the documentation or specific files, but the *runnable* preview will be the React app.

## Affected Areas
- **Frontend**: All UI components (Bootstrap/Tailwind-like styling via shadcn/ui), Chart.js for data visualization, state management for "database" simulation.
- **Auth**: Mock login/registration with role-based access.

## Ordered Phases

### Phase 1: Foundation & Data Layer (frontend_engineer)
- Create a `src/lib/mockData.ts` or `src/lib/store.ts` to manage `localStorage` for:
  - Users (Admin/Client)
  - Products (10kg, 25kg, 50kg bags)
  - Materials (Wood, labels, eco-bags)
  - Orders & Payments
  - Stocks & Movements
- Setup basic layout with navigation.

### Phase 2: Authentication & Role-Based Access (frontend_engineer)
- Implement Login/Register pages.
- Create an AuthProvider to manage sessions.
- Redirect users based on roles (Admin -> Dashboard, Client -> Shop).

### Phase 3: Client Experience (Orders) (frontend_engineer)
- Product listing/Selection.
- Order form: Bag count, weight, delivery/pickup, deposit calculation.
- "My Orders" view for clients.

### Phase 4: Admin Dashboard & Statistics (frontend_engineer)
- Widgets: Daily revenue, pending orders, low stock alerts.
- Charts: Sales trends (Chart.js), popular products.
- Order Management: List with actions (Validate, Deliver, Cancel).

### Phase 5: Stock & Production Management (frontend_engineer)
- Stock list with visual alerts (red for < 10 bags).
- Production form: Verify raw materials, convert materials to charcoal bags, update logs.
- Activity logs table.

### Phase 6: Exporting Reference Backend Code (quick_fix_engineer)
- Create `backend_reference/` directory (informational).
- Write `models.py` (SQLAlchemy), `app.py` (Flask skeleton), and `requirements.txt` as requested by the user, even though they won't run in the current environment.

## Open Questions
- Should we use a specific currency for the RDC context (CDF or USD)? *Assumption: Use USD with local formatting.*
- Is the "partial payment" a fixed percentage or user-input? *Assumption: Allow user to input deposit amount.*
