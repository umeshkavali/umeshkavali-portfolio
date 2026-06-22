async function signUp() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("signup-message");

  if (!firstName || !lastName || !email || !password) {
    msg.style.color = "red";
    msg.innerText = "Please fill in all fields.";
    return;
  }

  try {
    msg.style.color = "blue";
    msg.innerText = "Creating account...";

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      msg.style.color = "green";
      msg.innerText = result.message;
    } else {
      msg.style.color = "red";
      msg.innerText = result.error;
    }
  } catch (error) {
    msg.style.color = "red";
    msg.innerText = "Something went wrong. Please try again.";
  }
}