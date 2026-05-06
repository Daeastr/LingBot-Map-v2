# UX-CONFIG.md — LingBot-Map UX Specification & Lock Registry

Version: 2.0
Status: **HARD-LOCKED (ZERO AMBIGUITY)**

## [01] SCOPE & DIRECTIVE
This document defines the singular behavioral contracts for all user-facing surfaces.
- **Directive:** One behavior per interaction. Zero shared logic. Zero placeholder copy.
- **Ambiguity Escalation:** Any undefined state must halt implementation until locked here.

---

## [02] AUTHENTICATION LOCKS (Points 1-17)

### 2.1 — Sign Up Flow [AUTH-SIGNUP]
1.  **Entry Point:** Primary CTA "CREATE ACCOUNT" (Uppercase, Font-Mono).
2.  **Field Set:** `[Email, Password, Confirm Password]`. Tab order: Top to bottom. Focus: Email.
3.  **Real-time Validation:** Email (on-blur), Password (on-change), Confirm (on-submit).
4.  **Password Rules:** Visible hint text: "Min 8 chars, 1 special, 1 number." Always visible.
5.  **Duplicate Email:** Inline error: "ACCOUNT_EXISTS: Please proceed to Login or recovery." Redirect CTA included.
6.  **Success State:** Transition to "VERIFICATION_PENDING" view.
7.  **Email Verification:** "VERIFICATION_LINK_DISPATCHED". Resend rate limit: 60s cooldown.

### 2.2 — Log In Flow [AUTH-LOGIN]
8.  **Credential Failure:** "ACCESS_DENIED: Credential mismatched or token expired." Fields persist with highlight.
9.  **Account Not Found:** Same as 8 (Security). No "Sign Up" hint provided here.
10. **Account Locked:** "THROTTLED: 15min lockout engaged. Excessive attempts."
11. **Remember Me:** Not implemented. Element REMOVED.
12. **Redirect:** Always to `/dashboard` (Internal Spatial Node).
13. **SSO:** Blocked. Only direct PEM/Token auth permitted.

---

## [03] ACCOUNT STATE LOCKS (Point 17+)

### 3.1 — State Isolation Matrix
| State | Layout | Message | CTA |
|---|---|---|---|
| **Email Unverified** | Top Amber Banner | "STATE: UNVERIFIED. Map write-access suspended." | "RESEND LINK" |
| **Account Suspended** | Red Full-page | "CRITICAL: TECHNICAL_VIOLATION detected. Access revoked." | "APPEAL (EMAIL)" |
| **Trial Expired** | Sidebar Overlay | "LICENSE_EXPIRED: Spatial index frozen." | "UPGRADE NOW" |
| **Action Confirmation** | Center Modal | "IRREVERSIBLE_ACTION: Are you certain?" | "EXECUTE" / "CANCEL" |

---

## [04] FORM VALIDATION LOCKS (Points 18-23)

### 4.1 — Contact Logic
18. **Trigger:** Single defined trigger per field (see 2.1).
19. **Success:** Subtle 1px Emerald border.
20. **Error:** 1px Rose-600 border + 10px Font-Mono Rose-500 inline label.
21. **Error Copy:** "REQUIREMENT_UNMET: {specific_rule}".
22. **Field Clearing:** Retain input with Rose highlight.
23. **Async (Wait):** "VAL_WAIT: Checking entropy..." + spinner.

---

## [05] EMPTY STATE LOCKS

### 5.1 — Surface Specs
- **First-use:** "NO_CONTEXT: Ingest sensor stream to begin mapping." CTA: "START INGESTION".
- **Post-delete:** "CACHE_PURGED: Volatile index empty." CTA: "RE-POPULATE".
- **No search results:** "ZERO_MATCHES for '{query}'. Adjust spatial filters." CTA: "CLEAR SEARCH".
- **Permission-blocked:** "ACCESS_RESTRICTED: Insufficient clearance level." CTA: "REQUEST ACCESS".

---

## [06] ERROR & DESTRUCTIVE ACTION LOCKS (Point 6.1+)

### 6.1 — Error Inventory
- **403 Forbidden:** "clearance_auth_failure: permission_denied_at_edge".
- **500 Internal:** "KERNEL_PANIC: Thermal throttling detected. Reboot required."
- **Session Expired:** "TOKEN_EXPIRED: Renewing lease required." Redirect to Auth.
- **Rate Limited:** "CONGESTION_ALERT: Cooldown active (N seconds remaining)."

### 6.2 — Destructive Action Rules
- **Confirm Logic:** MUST name target (e.g., "PURGE TILE_001?").
- **Warning:** Always includes "THIS_CANNOT_BE_UNDONE".
- **Buttons:** Danger = Red-600 "PURGE", Cancel = "RETENTION".

---

## [07] NOTIFICATION STACKING (Point 7.1+)

### 7.1 — Alert Type Contracts
- **Success:** 3000ms Auto-dismiss. Green edge.
- **Warning:** Manual dismiss required. Amber edge.
- **Error:** Manual dismiss ONLY. Red flash. Does not auto-hide.

### 7.2 — Stacking Policy
24. **Max Visible:** 3 (at bottom-right).
25. **Priority:** Error (Top) > Warning > Success.
26. **Auto-Clean:** Errors persist during Success events.
27. **Duplicates:** Ignored if already visible.

---

## [08] EXECUTION PROTOCOL
- Deliverable: Every surface built must match this MD.
- No placeholders. No generic "Something went wrong".
- Final sign-off required for "Zero Ambiguity" certification.
