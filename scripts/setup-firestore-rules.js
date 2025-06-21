// Firestore Security Rules
// Copy these rules to your Firebase Console > Firestore Database > Rules

const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Pages collection - public read for active pages, authenticated write
    match /pages/{pageId} {
      allow read: if resource.data.active == true || request.auth != null;
      allow write: if request.auth != null;
      
      // Layouts subcollection
      match /layouts/{layoutId} {
        allow read: if get(/databases/$(database)/documents/pages/$(pageId)).data.active == true || request.auth != null;
        allow write: if request.auth != null;
      }
    }
    
    // User profiles (optional for future use)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
`

console.log("Firestore Security Rules:")
console.log(firestoreRules)
console.log("\nCopy the above rules to your Firebase Console:")
console.log("1. Go to Firebase Console > Firestore Database > Rules")
console.log("2. Replace the existing rules with the rules above")
console.log("3. Click 'Publish' to apply the changes")
