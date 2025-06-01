import * as admin from 'firebase-admin';
import { onDocumentUpdated, Change, QueryDocumentSnapshot, FirestoreEvent } from 'firebase-functions/v2/firestore';

if (admin.apps.length === 0) {
 console.log('Initializing Firebase Admin SDK...');
 try {
 admin.initializeApp({
 projectId: process.env.GCLOUD_PROJECT,
 });
 console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
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
export const denormalizeUserProfileOnUpdate = onDocumentUpdated(
  {
    document: '/userProfiles/{userId}', // The path to the documents to listen to
    database: 'hamfounderdatabase', // Explicitly set the database ID
    region: 'us-central1', // <--- منطقه اجرای تابع تغییر یافته
  },
  async (event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, { userId: string }>) => {

        // Runtime check for the environment variable is no longer strictly necessary for database access,
        // but can be kept for logging if desired.
        // const runtimeHamfounderDbId = process.env.HAMFOUNDER_DATABASE_ID;
        // if (!runtimeHamfounderDbId) {
        //     console.error("HAMFOUNDER_DATABASE_ID environment variable is NOT set during runtime execution!");
        //     return null;
        // } else {
        //      console.log(`HAMFOUNDER_DATABASE_ID is set to ${runtimeHamfounderDbId} during runtime execution.\`);
        // }


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

        const displayNameChanged = (newValue?.displayName ?? '') !== (previousValue?.displayName ?? '');
        const profileImageUrlChanged = (newValue.profileImageUrl ?? '') !== (previousValue.profileImageUrl ?? '');

        if (!displayNameChanged && !profileImageUrlChanged) {
            console.log('Display name and profile image URL did not change. Exiting.');
            return null;
        }

        const userId = event.params.userId;
        const updatedDisplayName = newValue.displayName as string | undefined;
        const updatedProfileImageUrl = newValue.profileImageUrl as string | undefined;

        // Use the 'specificDb' instance for all Firestore operations
        const projectsRef: admin.firestore.CollectionReference = specificDb.collection('projects');

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
