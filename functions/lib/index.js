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
exports.denormalizeUserProfileOnUpdate = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-functions/v2/firestore");
if (admin.apps.length === 0) {
    console.log('Initializing Firebase Admin SDK...');
    try {
        admin.initializeApp({
            projectId: process.env.GCLOUD_PROJECT,
        });
        console.log('Firebase Admin SDK initialized successfully.');
    }
    catch (error) {
        console.error('Error initializing Firebase Admin SDK:', error); // Corrected error logging
    }
}
// We no longer need to get hamfounderDbId here as we will explicitly set the database ID inside the function
// const hamfounderDbId = process.env.HAMFOUNDER_DATABASE_ID;
// if (!hamfounderDbId) {
//     console.error("HAMFOUNDER_DATABASE_ID environment variable is not set during build time.");
//     // This warning is for build time, runtime check is below
// }
// We no longer need to configure the default Firestore instance here
// const db = admin.firestore();
// if (hamfounderDbId) {
//     db.settings({
//         databaseId: hamfounderDbId,
//         ignoreUndefinedProperties: true, // Often useful
//     });
//     console.log(`Firestore instance configured for database: ${hamfounderDbId} at build time.`);
// } else {
//     console.warn("HAMFOUNDER_DATABASE_ID not set at build time, configuring default Firestore database.");
// }
// The 2nd generation trigger definition - Added explicit database and region definition
exports.denormalizeUserProfileOnUpdate = (0, firestore_1.onDocumentUpdated)({
    document: '/userProfiles/{userId}', // The path to the documents to listen to
    database: 'hamfounderdatabase', // Explicitly set the database ID
    region: 'us-central1', // <--- منطقه اجرای تابع تغییر یافته
}, async (event) => {
    // Runtime check for the environment variable is no longer strictly necessary for database access,
    // but can be kept for logging if desired.
    // const runtimeHamfounderDbId = process.env.HAMFOUNDER_DATABASE_ID;
    // if (!runtimeHamfounderDbId) {
    //     console.error("HAMFOUNDER_DATABASE_ID environment variable is NOT set during runtime execution!");
    //     return null;
    // } else {
    //      console.log(`HAMFOUNDER_DATABASE_ID is set to ${runtimeHamfounderDbId} during runtime execution.\`);
    // }
    var _a, _b, _c, _d;
    if (!event.data) {
        console.log("No data found in event.data. Exiting.");
        return null;
    }
    // Explicitly get the Firestore instance for 'hamfounderdatabase' inside the function
    const specificDb = admin.firestore();
    specificDb.settings({
        databaseId: 'hamfounderdatabase', // Explicitly set the database ID
        ignoreUndefinedProperties: true,
    });
    // Verify that the event is indeed from the expected database
    const eventDatabaseId = event.data.after.ref.firestore.databaseId;
    const expectedDatabaseId = 'hamfounderdatabase'; // Explicitly define the expected database ID
    if (eventDatabaseId !== expectedDatabaseId) {
        console.warn(`Trigger event is from database ${eventDatabaseId}, but expected ${expectedDatabaseId}. Exiting.`);
        return null; // Or handle this discrepancy as needed
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
    // Use the 'specificDb' instance for all Firestore operations
    const projectsRef = specificDb.collection('projects');
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