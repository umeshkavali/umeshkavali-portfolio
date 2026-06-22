async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("login-message");

  if (!email || !password) {
    msg.style.color = "red";
    msg.innerText = "Please fill in all fields.";
    return;
  }

  try {
    msg.style.color = "blue";
    msg.innerText = "Signing in...";

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      msg.style.color = "green";
      msg.innerText = "Sign in successful!";
      // Redirect to home after 1 second
      setTimeout(() => { window.location.href = "index.html"; }, 1000);
    } else {
      msg.style.color = "red";
      msg.innerText = result.error;
    }
  } catch (error) {
    msg.style.color = "red";
    msg.innerText = "Something went wrong. Please try again.";
  }
}