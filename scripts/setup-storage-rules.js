// Firebase Storage Security Rules
// Copy these rules to your Firebase Console > Storage > Rules

const storageRules = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Images can be read by anyone, but only authenticated users can write
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
`

console.log("Firebase Storage Security Rules:")
console.log(storageRules)
console.log("\nCopy the above rules to your Firebase Console:")
console.log("1. Go to Firebase Console > Storage > Rules")
console.log("2. Replace the existing rules with the rules above")
console.log("3. Click 'Publish' to apply the changes")
