import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyC5616FooIAGd1evh7Hl09eQYT8iUs5UJY",
    authDomain: "authentication-9e325.firebaseapp.com",
    projectId: "authentication-9e325",
    storageBucket: "authentication-9e325.appspot.com",
    messagingSenderId: "609048115020",
    appId: "1:609048115020:web:a971e409c5264beb2141e9",
    measurementId: "G-EHRPDJKLWY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

document.getElementById("btnSubmit").addEventListener("click", function () {
    event.preventDefault();
    var email = document.getElementById("registerEmail").value;
    var password = document.getElementById("registerPassword").value;
    var FullName = document.getElementById("fullName").value;
    var confirmPassword = document.getElementById("confirm-password").value;
    if (password !== confirmPassword) {
        console.error("Passwords do not match.");
        alert("Passwords don't match");
        return;
    }
    createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        const user = userCredential.user;
        const userId = user.uid;
        const fullName = FullName;
        const email = user.email;
        const photourl = user?.photoURL;

        await setDoc(doc(db, "users", userId), {
            fullName: fullName,
            userId: userId,
            email: email,
            photourl: photourl,
        }).catch((error) => {
            const errorCode = error.code;
            console.log(error.message)
        })
        alert("Registration successful");
        window.location.href = 'login.html'
    }).catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.log(errorMessage);
        alert(errorMessage);
    });
});

document.getElementById("btnLogIn").addEventListener("click", function () {
    event.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        const user = await userCredential.user;
        // console.log(user);
        const authToken = await user.getIdToken(); // Get the authentication token
        const expires = new Date();
        expires.setTime(expires.getTime() + 1 * 60 * 60 * 1000);
        document.cookie = `authToken=${authToken}; expires=${expires.toUTCString()}; path=/;`;
        alert(user.email + " Login Successfully");
        window.location.href = 'index.html';
    }).catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.log(errorMessage);
        alert(errorMessage);
    });
});


document.getElementById("btnGoogleLogin").addEventListener("click", async () => {
    try {
        // Change signInWithPopup to signInWithRedirect
        await signInWithRedirect(auth, provider);
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
    }
});

// Handle the redirect result
getRedirectResult(auth)
    .then(async (result) => {
        if (result.user) {
            const user = result.user;
            const authToken = await user.getIdToken();
            // console.log('Auth Token:', authToken);

            // // Decode the JWT token to get the payload
            const tokenParts = authToken.split('.');
            const encodedPayload = tokenParts[1];
            const decodedPayload = atob(encodedPayload);
            const payload = JSON.parse(decodedPayload);
            // console.log('Decoded Payload:', payload);

            if (payload.exp) {
                const expirationTimestamp = payload.exp;
                const expirationDate = new Date(expirationTimestamp * 1000);
                console.log(expirationDate)
                document.cookie = `authToken=${authToken}; expires=${expirationDate.toUTCString()}; path=/;`;
            } else {
                console.log("Token does not contain an 'exp' claim.");
            }
            const userId = user.uid;
            const fullName = user.displayName;
            const email = user.email;
            const photourl = user.photoURL;

            await setDoc(doc(db, "users", userId), {
                fullName: fullName,
                userId: userId,
                email: email,
                photourl: photourl,
            }).catch((error) => {
                const errorCode = error.code;
                console.log(error.message)
            })
            alert(`${fullName} Login Successfully`)
            window.location.href = 'index.html';
        }
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
    });


document.getElementById("logout").addEventListener("click", function () {
    signOut(auth).then(() => {
        localStorage.removeItem('authToken');
        console.log("sign out successfull");
        alert("Sign out successfull")
    }).catch((err) => {
        const errorMessage = err.message;
        console.log("err" + errorMessage)
    })
})
