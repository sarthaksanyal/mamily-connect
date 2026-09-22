const roleButtons = document.querySelectorAll(".role-option");
const authHeading = document.querySelector(".auth-head h2");
const authSubtitle = document.querySelector(".auth-head p");
const emailLabel = document.querySelector('label[for="email"]');
const loginButtonText = document.querySelector(".login-button span");
const submitButton = document.querySelector(".login-button");
const passwordInput = document.getElementById("password");
const passwordToggle = document.querySelector(".password-toggle");
const loginForm = document.querySelector(".login-form");

const roleConfig = {
  employee: {
    heading: "Employee Sign in",
    subtitle: "Sign in to Access Your Employee Dashboard",
    emailLabel: "Employee Email",
    buttonText: "Sign in as an Employee",
  },
  manager: {
    heading: "HR / Manager Sign in",
    subtitle: "Sign in to Access the HR/Manager Dashboard",
    emailLabel: "HR / Manager Email",
    buttonText: "Sign in as HR / Manager",
  },
};

let activeRole = "employee";

function updateRoleUI(role) {
  activeRole = role;
  roleButtons.forEach((button) => {
    const isActive = button.dataset.role === role;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  const config = roleConfig[role];
  authHeading.textContent = config.heading;
  authSubtitle.textContent = config.subtitle;
  emailLabel.textContent = config.emailLabel;
  loginButtonText.textContent = config.buttonText;
}

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updateRoleUI(button.dataset.role);
  });
});

passwordToggle.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  passwordToggle.textContent = isPassword ? "Hide" : "Show";
  passwordToggle.setAttribute(
    "aria-label",
    isPassword ? "Hide password" : "Show password",
  );
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter both your email and password.");
    return;
  }

  if (activeRole === "employee") {
    window.location.href = "employeedashboard.html";
    return;
  }

  window.location.href = "hr-managerdashboard.html";
});

submitButton.addEventListener("mouseenter", () => {
  submitButton.style.transform = "translateY(-1px)";
});

submitButton.addEventListener("mouseleave", () => {
  submitButton.style.transform = "";
});

updateRoleUI(activeRole);
