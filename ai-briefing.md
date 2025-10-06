
*   **Authentication:** Firebase Authentication manages user identity.
*   **Authorization for Storage:** Access to \`/confidential-kb/\` in Firebase Storage is governed by Security Rules requiring the user's auth token to have two custom claims: \`whitelisted: true\` AND \`ndaAccepted: true\`.
*   **Content Security Policy (CSP):** To prevent cross-site scripting (XSS) and other injection attacks, a strict CSP is enforced via a `<meta>` tag in `index.html`. This policy was updated to include a `media-src` directive, specifically allowing audio streaming from `https://firebasestorage.googleapis.com`, which resolved a critical playback issue.
*   **Custom Claims Management (Dual-Function Approach):**
    1.  **NDA Acceptance (\`ndaAccepted\`):** Set via a **Callable** Cloud Function (\`acceptNdaAndSetClaim\`). This is a direct, user-initiated action.
    2.  **Whitelisting (\`whitelisted\`):** Set via a **Firestore-triggered** Cloud Function (\`syncWhitelistClaims\`). This is an automated, backend process that listens for changes to the canonical whitelist document (\`config/access_control\`).
