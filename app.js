
const URL= "https://be-geo-attendance.socrates-exp.asia"
// const URL= 'http://localhost:3000'

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

// Handle Login Form Submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Get User's Location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        checkLocationAndLogin(username, password, userLat, userLon);
      },
      (error) => {
        console.error('Geolocation Error:', error);
        alert(getGeolocationErrorMessage(error));
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});

// Check Location and Send Login Request
function checkLocationAndLogin(username, password, userLat, userLon) {
  const targetLat = -7.3651716839194465; // Example target latitude
  const targetLon = 112.75982261252922; // Example target longitude
  const radius = 0.01; // Radius in degrees (approx. 1 km)

  // Check if User is Within Radius
  if (isUserWithinRadius(userLat, userLon, targetLat, targetLon, radius)) {
    alert('masok');
    // Send Login Request to Backend
    fetch(URL+'/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, userLat, userLon })
    })
    .then(response => response.json())
    .then(data => {
      alert(data.success ? 'Login successful!' : 'Login failed: ' + data.message);
    });
  } else {
    alert('You are not in the allowed location.');
  }
}

// Helper Function: Check if User is Within Allowed Radius
function isUserWithinRadius(userLat, userLon, targetLat, targetLon, radius) {
  const latDiff = Math.abs(userLat - targetLat);
  const lonDiff = Math.abs(userLon - targetLon);
  return latDiff <= radius && lonDiff <= radius;
}

// Helper Function: Geolocation Error Messages
function getGeolocationErrorMessage(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'You denied the request for geolocation. Please enable it in your browser settings.';
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable.';
    case error.TIMEOUT:
      return 'The request to get your location timed out.';
    default:
      return 'An unknown error occurred.';
  }
}

// document.addEventListener("DOMContentLoaded", function () {
//   // Select Forms
//   const loginForm = document.getElementById("loginForm");
//   const forgotPasswordForm = document.getElementById("forgotPasswordForm");
//   const changePasswordForm = document.getElementById("changePasswordForm");

//   // 🔹 Handle Login Submission
//   if (loginForm) {
//     loginForm.addEventListener("submit", function (event) {
//       event.preventDefault();
//       const username = document.getElementById("username").value;
//       const password = document.getElementById("password").value;

//       fetch("http://localhost:3000/login", {
//       // fetch("https://be-geo-attendance.socrates-exp.asia/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.success) {
//             alert("Login successful!");
//             // Redirect or handle session
//           } else {
//             alert("Login failed: " + data.message);
//           }
//         })
//         .catch((error) => {
//           console.error("Login Error:", error);
//         });
//     });
//   }

  // 🔹 Handle Reset Password Submission
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const npk = document.getElementById("forgotUsername").value;

      fetch(URL+"/reset-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ npk }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          console.error("Reset Password Error:", error);
        });
    });
  }

  // 🔹 Handle Change Password Submission
  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("passwordUsername").value;
      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;

      fetch(URL+"/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, currentPassword, newPassword }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          console.error("Change Password Error:", error);
        });
    });
  }

  // 🔹 Handle Change Phone Submission
  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("phoneUsername").value;
      const password = document.getElementById("phonePassword").value;
      const currentPhone = document.getElementById("currentPhone").value;
      const newPhone = document.getElementById("newPhone").value;

      fetch(URL+"/change-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, currentPhone, newPhone }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          console.error("Change Password Error:", error);
        });
    });
  }
// });

// 🔹 Show Forms Function
function showLogin() {
  document.getElementById("loginPage").classList.remove("hidden");
  document.getElementById("forgotPasswordPage").classList.add("hidden");
  document.getElementById("changePasswordPage").classList.add("hidden");
  document.getElementById("changePhonePage").classList.add("hidden");
}

function showForgotPassword() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("forgotPasswordPage").classList.remove("hidden");
  document.getElementById("changePasswordPage").classList.add("hidden");
  document.getElementById("changePhonePage").classList.add("hidden");
}

function showChangePassword() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("forgotPasswordPage").classList.add("hidden");
  document.getElementById("changePasswordPage").classList.remove("hidden");
  document.getElementById("changePhonePage").classList.add("hidden");
}

function showChangePhone() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("forgotPasswordPage").classList.add("hidden");
  document.getElementById("changePasswordPage").classList.add("hidden");
  document.getElementById("changePhonePage").classList.remove("hidden");
}
