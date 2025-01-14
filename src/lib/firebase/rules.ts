// Firebase Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }
    
    // Experiences collection
    match /experiences/{experienceId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && 
        isOwner(resource.data.userId);
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if isAuthenticated() && (
        isOwner(resource.data.guestUserId) || 
        isOwner(resource.data.hostUserId)
      );
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (
        isOwner(resource.data.guestUserId) || 
        isOwner(resource.data.hostUserId)
      );
    }
  }
}