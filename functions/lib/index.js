"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.denormalizeUserProfileOnUpdate = exports.getUserReport = exports.acceptNdaAndSetClaim = exports.syncWhitelistClaims = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();
db.settings({
    databaseId: 'hamfounderdatabase',
    ignoreUndefinedProperties: true,
});
// ===================================================================
// START: WHITELIST CLAIM SYNC FUNCTION (PATH CORRECTED)
// ===================================================================
/**
 * This function triggers on any update to the access control document.
 * It syncs the `whitelisted` custom claim for all users listed in the document.
 */
exports.syncWhitelistClaims = (0, firestore_1.onDocumentUpdated)({
    // CORRECTED PATH:
    document: 'config/access_control',
    database: 'hamfounderdatabase',
    region: 'us-central1',
    memory: '256MiB'
}, async (event) => {
    if (!event.data) {
        console.log("No data associated with the event. Exiting.");
        return;
    }
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    // The field containing the UIDs is named 'whitelisted_cofounder_uids'
    const uidsBefore = new Set((beforeData === null || beforeData === void 0 ? void 0 : beforeData.whitelisted_cofounder_uids) || []);
    const uidsAfter = new Set((afterData === null || afterData === void 0 ? void 0 : afterData.whitelisted_cofounder_uids) || []);
    const promises = [];
    // Process users added to the whitelist
    for (const uid of uidsAfter) {
        if (!uidsBefore.has(uid)) {
            console.log(`User ${uid} added to whitelist. Setting claim via config/access_control.`);
            promises.push(setWhitelistClaim(uid, true));
        }
    }
    // Process users removed from the whitelist
    for (const uid of uidsBefore) {
        if (!uidsAfter.has(uid)) {
            console.log(`User ${uid} removed from whitelist. Removing claim via config/access_control.`);
            promises.push(setWhitelistClaim(uid, false));
        }
    }
    await Promise.all(promises);
    console.log("Whitelist claims sync from config/access_control completed.");
});
/**
 * Helper function to set or remove the 'whitelisted' custom claim for a user.
 */
async function setWhitelistClaim(uid, isWhitelisted) {
    try {
        const user = await admin.auth().getUser(uid);
        const existingClaims = user.customClaims || {};
        const newClaims = Object.assign(Object.assign({}, existingClaims), { whitelisted: isWhitelisted });
        // To ensure a claim is removed, we might need to set it to null or remove the key.
        // For simplicity and to match the logic, we set it to false if not whitelisted.
        if (!isWhitelisted) {
            newClaims.whitelisted = false;
        }
        await admin.auth().setCustomUserClaims(uid, newClaims);
        console.log(`Successfully set custom claim 'whitelisted: ${newClaims.whitelisted}' for user ${uid}.`);
    }
    catch (error) {
        console.error(`Failed to set whitelist claim for user ${uid}:`, error);
    }
}
// ===================================================================
// END: WHITELIST CLAIM SYNC FUNCTION
// ===================================================================
exports.acceptNdaAndSetClaim = (0, https_1.onCall)({
    region: 'us-central1',
    timeoutSeconds: 60,
    memory: '256MiB'
}, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    const uid = request.auth.uid;
    try {
        const user = await admin.auth().getUser(uid);
        const existingClaims = user.customClaims || {};
        const newClaims = Object.assign(Object.assign({}, existingClaims), { ndaAccepted: true });
        await admin.auth().setCustomUserClaims(uid, newClaims);
        console.log(`Successfully set custom claims for user: ${uid}`, newClaims);
        const userProfileRef = db.collection('userProfiles').doc(uid);
        await userProfileRef.update({
            ndaAccepted: true,
            ndaAcceptedTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Successfully updated Firestore profile for user: ${uid}`);
        return {
            status: 'success',
            message: 'NDA accepted and access granted.'
        };
    }
    catch (error) {
        console.error(`Error in acceptNdaAndSetClaim for user ${uid}:`, error);
        throw new https_1.HttpsError('internal', 'An error occurred while processing the NDA acceptance.', error);
    }
});
// Recursive function to deeply sanitize data for JSON serialization
const sanitizeForJSON = (data) => {
    if (data === null || data === undefined) {
        return null; // Return null for both null and undefined
    }
    // Firestore Timestamps
    if (data instanceof admin.firestore.Timestamp) {
        return data.toDate().toISOString();
    }
    // Arrays
    if (Array.isArray(data)) {
        return data.map(item => sanitizeForJSON(item));
    }
    // Objects
    if (typeof data === 'object') {
        const sanitizedObject = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key];
                sanitizedObject[key] = sanitizeForJSON(value);
            }
        }
        return sanitizedObject;
    }
    // Primitives (string, number, boolean)
    return data;
};
const getProfileCompletionPercentage = (profile) => {
    if (!profile)
        return 0;
    const fields = [
        'firstName', 'lastName', 'tagline', 'location', 'personalSummary',
        'role', 'lookingFor', 'businessStage', 'companyName'
    ];
    const completedFields = fields.filter(field => {
        const value = profile[field];
        return typeof value === 'string' && value.trim() !== '';
    }).length;
    const skillsBonus = (Array.isArray(profile.skills) && profile.skills.length > 0) ? 1 : 0;
    const interestsBonus = (Array.isArray(profile.interests) && profile.interests.length > 0) ? 1 : 0;
    const totalPossiblePoints = fields.length + 2;
    const userScore = completedFields + skillsBonus + interestsBonus;
    if (totalPossiblePoints === 0)
        return 0;
    return Math.round((userScore / totalPossiblePoints) * 100);
};
const isProfileConsideredComplete = (percentage) => {
    return percentage === 100;
};
exports.getUserReport = (0, https_1.onCall)({
    region: 'us-central1',
    timeoutSeconds: 300,
    memory: '1GiB'
}, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    const adminEmail = 'alireza.zareidowlatabadi@gmail.com';
    if (request.auth.token.email !== adminEmail) {
        throw new https_1.HttpsError('permission-denied', 'You do not have permission to access this resource.');
    }
    try {
        const [listUsersResult, profilesSnapshot, projectsSnapshot] = await Promise.all([
            admin.auth().listUsers(1000),
            db.collection('userProfiles').get(),
            db.collection('projects').get()
        ]);
        const profilesMap = new Map();
        profilesSnapshot.forEach(doc => {
            profilesMap.set(doc.id, doc.data());
        });
        const projectCounts = new Map();
        projectsSnapshot.forEach(doc => {
            const ownerId = doc.data().ownerId;
            if (ownerId) {
                projectCounts.set(ownerId, (projectCounts.get(ownerId) || 0) + 1);
            }
        });
        const userReport = listUsersResult.users.map(user => {
            const profile = profilesMap.get(user.uid);
            const projectCount = projectCounts.get(user.uid) || 0;
            const completionPercentage = getProfileCompletionPercentage(profile);
            const isComplete = isProfileConsideredComplete(completionPercentage);
            const sanitizedProfileData = sanitizeForJSON(profile);
            return {
                uid: user.uid,
                email: user.email || 'N/A',
                isProfileComplete: isComplete,
                profileCompletionPercentage: completionPercentage,
                projectCount: projectCount,
                lastSignInTime: user.metadata.lastSignInTime,
                profileData: sanitizedProfileData,
            };
        });
        return userReport;
    }
    catch (error) {
        console.error("Error generating user report:", error);
        const errorDetails = error instanceof Error
            ? { name: error.name, message: error.message, stack: error.stack }
            : { detail: String(error) };
        throw new https_1.HttpsError('internal', 'An error occurred while generating the report.', errorDetails);
    }
});
exports.denormalizeUserProfileOnUpdate = (0, firestore_1.onDocumentUpdated)({
    document: '/userProfiles/{userId}',
    database: 'hamfounderdatabase',
    region: 'us-central1',
}, async (event) => {
    var _a, _b, _c, _d;
    if (!event.data) {
        console.log("No data found in event.data. Exiting.");
        return null;
    }
    const eventDatabaseId = event.data.after.ref.firestore.databaseId;
    const expectedDatabaseId = 'hamfounderdatabase';
    if (eventDatabaseId !== expectedDatabaseId) {
        console.warn(`Trigger event is from database ${eventDatabaseId}, but expected ${expectedDatabaseId}. Exiting.`);
        return null;
    }
    console.log(`Trigger event is from the expected database: ${eventDatabaseId}`);
    const newValue = event.data.after.data();
    const previousValue = event.data.before.data();
    if (!newValue && !previousValue) {
        console.log("No data found in event.data.after or event.data.before. Exiting.");
        return null;
    }
    const displayNameChanged = ((_a = newValue === null || newValue === void 0 ? void 0 : newValue.displayName) !== null && _a !== void 0 ? _a : '') !== ((_b = previousValue === null || previousValue === void 0 ? void 0 : previousValue.displayName) !== null && _b !== void 0 ? _b : '');
    const profileImageUrlChanged = ((_c = newValue.profileImageUrl) !== null && _c !== void 0 ? _c : '') !== ((_d = previousValue.profileImageUrl) !== null && _d !== void 0 ? _d : '');
    if (!displayNameChanged && !profileImageUrlChanged) {
        console.log('Display name and profile image URL did not change. Exiting.');
        return null;
    }
    const userId = event.params.userId;
    const updatedDisplayName = newValue.displayName;
    const updatedProfileImageUrl = newValue.profileImageUrl;
    const projectsRef = db.collection('projects');
    const userProjectsSnapshot = await projectsRef.where('ownerId', '==', userId).get();
    const updatePromises = [];
    userProjectsSnapshot.forEach((doc) => {
        const projectRef = projectsRef.doc(doc.id);
        const updateData = {};
        if (displayNameChanged && updatedDisplayName !== undefined) {
            updateData['ownerInfo.displayName'] = updatedDisplayName;
        }
        if (profileImageUrlChanged && updatedProfileImageUrl !== undefined) {
            updateData['ownerInfo.profileImageUrl'] = updatedProfileImageUrl;
        }
        if (Object.keys(updateData).length > 0) {
            updatePromises.push(projectRef.update(updateData));
        }
    });
    await Promise.all(updatePromises);
    console.log(`Denormalized user profile for user ${userId} in ${updatePromises.length} projects.`);
    return null;
});
//# sourceMappingURL=index.js.map