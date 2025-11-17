<!-- d705c25a-e041-4e52-b662-00af82f52e52 15cc60e6-3bd1-4a1e-8031-f5a2d1fbb509 -->
# Hospitality-Driven Frontend Refactor Plan (All 16 Pages)

## Scope

Targets: `page-admin-dashboard.xml`, `page-admin-menu.xml`, `page-admin-reservations.xml`, `page-admin-users.xml`, `page-admin-delivery-dashboard.xml`, `page-delivery-management.xml`, `page-payments.xml`, `page-checkout.xml`, `page-payment.xml`, `page-home.xml`, `page-customer-dashboard.xml`, `page-customer-orders.xml`, `page-customer-order-detail.xml`, `page-customer-reservations.xml`, `page-delivery-tracking.xml`, plus supporting docs (`Hospitality_UX_Report.md`).

## Steps

1. **Design Baseline**

- Reconfirm palette, typography, spacing from `docs/101-DESIGN-PRINCIPLES-COMPLIANCE.md`.
- Audit each XML file to capture existing sections/components before redesign.

2. **UX-Sensory Enhancements**

- `page-home.xml`: Convert `<section id="menu">` to High-Fidelity Gallery/Carousel; add hi-res image + optional video slots; maintain Playfair Display hero typography.
- `page-admin-menu.xml`: Same immersive gallery structure for menu management, with media metadata.
- `page-customer-dashboard.xml`: Add `<section id="ai-chefs-recommendation">` with chef video + CTA.

3. **UX-Hospitality Personalization**

- `page-customer-dashboard.xml`: Replace welcome text with data-driven greetings (frequent diner vs. celebration scenarios). Preserve Playfair Display styling.
- `page-customer-reservations.xml`: Add structured `Special Requests` tags (anniversary, allergy, seating) with optional custom note; ensure admin sees these tags.

4. **UX-Timeliness & Realtime Alerts**

- `page-customer-order-detail.xml`: Expand `OrderStatusTimeline` to 5 detailed stages (order received → chef verifying → cooking → plating/packaging → courier departure) linked to delivery tracking.
- `page-admin-dashboard.xml` & `page-delivery-dashboard.xml`: Add `<section id="ai-bottleneck-alerts">` showing AI delay warnings with recommended actions; ensure styling stays premium.
- `page-delivery-tracking.xml`: Reflect new timeline states and alert hooks.

5. **UX-Gourmet Checkout & Payment**

- `page-checkout.xml`: Redesign as multi-step wizard (Customer Details → AI Sommelier Pairing → Payment). Add AI pairing suggestions with optional add-to-order CTA, plus pickup-specific arrival reminder.
- `page-payment.xml`: Reword experience to “Experience Confirmation”, reflect pairing selections, maintain premium tone.

6. **Administrative Surfaces**

- `page-admin-reservations.xml`: Display structured special-request tags, add filter/action controls.
- `page-admin-users.xml`: Ensure modal reflects personalized data points (celebration notes, VIP tiers) while staying elegant.
- `page-payments.xml`: Update stats/list to include pairing add-ons and hospitality messaging.
- `page-delivery-management.xml`: Tie into real-time statuses from dashboards.

7. **Delivery Experience**

- `page-delivery-dashboard.xml` & `page-delivery-management.xml`: Visualize chef/delivery delays, integrate AI rerouting suggestions aligned with brand tone.

8. **Documentation Deliverables**

- Export all updated XML into `./restaurant_ux_enhanced/`.
- Write `Hospitality_UX_Report.md` summarizing per-page enhancements (sensory, hospitality, timeliness) and how constraints (brand, performance, clarity) were met.

9. **Validation & Performance Checklist**

- Ensure CTA hierarchy, color limits, typography, opt-out paths for AI suggestions, and performance notes (lazy loading media) are documented before final handoff.

### To-dos

- [ ] Reconfirm palette and typography constraints before editing
- [ ] Enhance admin menu and customer dashboard per sensory set
- [ ] Personalize customer dashboard/reservations
- [ ] Add real-time status to order detail/admin dashboard
- [ ] Refactor checkout wizard with AI pairing
- [ ] Align admin reservations/users with new data
- [ ] Upgrade delivery dashboard alerting
- [ ] Author Hospitality_UX_Report.md summary