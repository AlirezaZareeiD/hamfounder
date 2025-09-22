
import * as admin from 'firebase-admin';
import { onDocumentUpdated, Change, QueryDocumentSnapshot, FirestoreEvent } from 'firebase-functions/v2/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

// Simplified and more robust initialization, done only once.
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Initialize DB connection once and reuse across function invocations.
const db = admin.firestore();
db.settings({
    databaseId: 'hamfounderdatabase',
    ignoreUndefinedProperties: true,
});

// Recursive function to deeply sanitize data for JSON serialization
const sanitizeForJSON = (data: any): any => {
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
        const sanitizedObject: { [key: string]: any } = {};
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


const getProfileCompletionPercentage = (profile: any): number => {
    if (!profile) return 0;

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

    if (totalPossiblePoints === 0) return 0;

    return Math.round((userScore / totalPossiblePoints) * 100);
};

const isProfileConsideredComplete = (percentage: number): boolean => {
  return percentage === 100;
};

export const getUserReport = onCall(
    { 
        region: 'us-central1', 
        timeoutSeconds: 300, 
        memory: '1GiB'
    },
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
        }

        const adminEmail = 'alireza.zareidowlatabadi@gmail.com';
        if (request.auth.token.email !== adminEmail) {
            throw new HttpsError('permission-denied', 'You do not have permission to access this resource.');
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

        } catch (error) {
            console.error("Error generating user report:", error);
            const errorDetails = error instanceof Error 
                ? { name: error.name, message: error.message, stack: error.stack }
                : { detail: String(error) };
                
            throw new HttpsError('internal', 'An error occurred while generating the report.', errorDetails);
        }
    }
);

export const denormalizeUserProfileOnUpdate = onDocumentUpdated(
  {
    document: '/userProfiles/{userId}',
    database: 'hamfounderdatabase',
    region: 'us-central1',
  },
  async (event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, { userId: string }>) => {

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

        const displayNameChanged = (newValue?.displayName ?? '') !== (previousValue?.displayName ?? '');
        const profileImageUrlChanged = (newValue.profileImageUrl ?? '') !== (previousValue.profileImageUrl ?? '');

        if (!displayNameChanged && !profileImageUrlChanged) {
            console.log('Display name and profile image URL did not change. Exiting.');
            return null;
        }

        const userId = event.params.userId;
        const updatedDisplayName = newValue.displayName as string | undefined;
        const updatedProfileImageUrl = newValue.profileImageUrl as string | undefined;

        const projectsRef: admin.firestore.CollectionReference = db.collection('projects');

        const userProjectsSnapshot: admin.firestore.QuerySnapshot = await projectsRef.where('ownerId', '==', userId).get();

        const updatePromises: Promise<admin.firestore.WriteResult>[] = [];
        userProjectsSnapshot.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
            const projectRef: admin.firestore.DocumentReference = projectsRef.doc(doc.id);
            const updateData: { [key: string]: any } = {};

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
  }
);
