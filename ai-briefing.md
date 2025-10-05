---
project_name: Hamfounder
global_objective: "Develop a secure, dynamic Co-FounderPrivateRepository page accessible only to whitelisted users, with content conditional on NDA acceptance."
sessions:
  - session_summary: "The initial 'Missing or insufficient permissions' error was identified as a race condition. The frontend was attempting to access Storage before the backend Cloud Function could set the necessary `ndaAccepted` custom claim. To resolve this, the architecture was changed from an event-driven function to a direct request/response model. A new Callable Cloud Function, `acceptNdaAndSetClaim`, was created to atomically set the custom claim and update the user's Firestore document. The frontend was rewritten to call this new function, wait for its completion, and then refresh the auth token before attempting to access documents."
  - session_summary: "The 'Missing or insufficient permissions' error persisted even after implementing the callable function. The root cause was discovered to be the user's auth token lacking a `whitelisted: true` custom claim, which is mandated by Storage security rules. This led to a comprehensive solution: 1) A new Firestore-triggered Cloud Function, `syncWhitelistClaims`, was created to automatically add the `whitelisted: true` claim to a user's auth token whenever their UID is added to the `config/access_control` document. 2) An initial pathing error in the function was identified and corrected. 3) The function was deployed, and a manual trigger (removing and re-adding the user's UID in the `config/access_control` document) successfully updated the user's claims. 4) The user signed out and back in to refresh their token, which finally contained both `ndaAccepted: true` and `whitelisted: true`, granting them access. The system is now fully functional and secure."
current_status: "The access control system is now correctly implemented and fully operational. The frontend, backend (Cloud Functions), and security rules are all in alignment."
---

### Key Technical Architecture & Decisions:

*   **Authentication:** Firebase Authentication manages user identity.
*   **Authorization for Storage:** Access to `/confidential-kb/` in Firebase Storage is governed by Security Rules requiring the user's auth token to have two custom claims: `whitelisted: true` AND `ndaAccepted: true`.
*   **Custom Claims Management (Dual-Function Approach):**
    1.  **NDA Acceptance (`ndaAccepted`):** Set via a **Callable** Cloud Function (`acceptNdaAndSetClaim`). This is a direct, user-initiated action.
    2.  **Whitelisting (`whitelisted`):** Set via a **Firestore-triggered** Cloud Function (`syncWhitelistClaims`). This is an automated, backend process that listens for changes to the canonical whitelist document (`config/access_control`).
*   **Single Source of Truth:** The `config/access_control` Firestore document is the definitive source for determining which users are on the whitelist.
*   **Frontend Logic:** The React/TypeScript frontend must first ensure the `ndaAccepted` claim is set (by calling `acceptNdaAndSetClaim`) and then rely on the backend to have already set the `whitelisted` claim. A token refresh (`user.getIdToken(true)`) is critical after a claim is expected to have been changed.
