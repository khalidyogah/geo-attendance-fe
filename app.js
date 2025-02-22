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
  const targetLat = -7.371674041595145; // Example target latitude
  const targetLon = 112.77672769904683; // Example target longitude
  const radius = 0.01; // Radius in degrees (approx. 1 km)

  // Check if User is Within Radius
  if (isUserWithinRadius(userLat, userLon, targetLat, targetLon, radius)) {
    // Send Login Request to Backend
    fetch('https://be-geo-attendance.socrates-exp.asia/login', {
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
