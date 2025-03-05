
// const URL= "'https://be-geo-attendance.socrates-exp.asia"
const URL= 'http://localhost:3000'

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


// 🔹 Show Forms Function
function showForm(type) {
  document.getElementById("formTitle").innerText = {
    login: "Login",
    forgotPassword: "Reset Password",
    changePassword: "Change Password",
    changePhone: "Change Phone"
  }[type];

  // Remove required attributes from everyone
  document.querySelectorAll("#userForm").forEach((form) => {
    form.querySelectorAll("input").forEach((input) => input.removeAttribute("required"));
  });
  

  // Hide all sections
  ["loginFields", "forgotPasswordFields", "changePasswordFields", "changePhoneFields"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });

  // Show the selected section
  if (type === "login") {
    document.getElementById("loginFields").classList.remove("hidden");
  } else {
    document.getElementById(type + "Fields").classList.remove("hidden");
  }
}

document.getElementById("userForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const formType = document.getElementById("formTitle").innerText;
  let endpoint = "";
  let payload = {};
  
  if (formType === "Login") {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        console.log("userLat,userLon");

        endpoint = "/login";
        payload = {
          username: document.getElementById("username").value,
          password: document.getElementById("password").value,
          userLat: userLat, // Attach latitude
          userLon: userLon  // Attach longitude
        };

        sendRequest(endpoint, payload);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Location access denied. Enable location to proceed.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else if (formType === "Reset Password") {
    endpoint = "/reset-link";
    payload = { username: document.getElementById("forgotUsername").value };
  } else if (formType === "Change Password") {
    endpoint = "/change-password";
    payload = {
      username: document.getElementById("passwordUsername").value,
      currentPassword: document.getElementById("currentPassword").value,
      newPassword: document.getElementById("newPassword").value
    };
  } else if (formType === "Change Phone") {
    endpoint = "/change-phone";
    payload = {
      username: document.getElementById("phoneUsername").value,
      password: document.getElementById("phonePassword").value,
      currentPhone: document.getElementById("currentPhone").value,
      newPhone: document.getElementById("newPhone").value
    };
  }

  // Send request
  fetch(URL+endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error("Error:", error));
});

showForm('login');