// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWtAjBA2cBNZdMnR9s88uyV6h61RFMmw0",
  authDomain: "deve-3b098.firebaseapp.com",
  databaseURL: "https://deve-3b098-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "deve-3b098",
  storageBucket: "deve-3b098.firebasestorage.app",
  messagingSenderId: "709312232350",
  appId: "1:709312232350:web:0428b59946fa7ca102348f"
};

// Firebase'i başlat
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Database fonksiyonları
function loadFromDatabase(key) {
    return database.ref(key).once('value').then(snapshot => {
        return snapshot.val() || {};
    });
}
