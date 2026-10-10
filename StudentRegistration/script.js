const form = document.querySelector("#registration-form");
const successMessage = document.querySelector("#success-message");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirm-password");
const passwordButton = document.querySelector("#toggle-password");

function showError(field, message) {
  const error = document.getElementById(field.dataset.error);
  field.classList.add("error");
  error.textContent = message;
}

function clearError(field) {
  const error = document.getElementById(field.dataset.error);
  field.classList.remove("error");
  error.textContent = "";
}

function validateField(field) {
  let message = "";
  const value = field.type === "checkbox" ? "" : field.value.trim();

  if (field.type !== "checkbox") {
    field.value = value;
  }

  if (field.type === "checkbox" && !field.checked) {
    message = field.dataset.errorMsg;
  } else if (field.type !== "checkbox" && !value) {
    message = field.dataset.errorMsg;
  } else if (field.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    message = "Please enter a valid email address.";
  } else if (field.id === "phone" && (!/^\+?[\d\s()-]{7,20}$/.test(value) || value.replace(/\D/g, "").length < 7)) {
    message = "Use at least 7 digits; +, spaces, parentheses, and dashes are allowed.";
  } else if (field.id === "birth-date" && value > todayAsText()) {
    message = "Date of birth cannot be in the future.";
  } else if (field.id === "password" && value.length < 8) {
    message = "Password must be at least 8 characters.";
  } else if (field.id === "confirm-password" && value !== password.value) {
    message = "Passwords do not match.";
  }

  if (message) {
    showError(field, message);
    return false;
  }

  clearError(field);
  return true;
}

function todayAsText() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function validateGender() {
  const genderField = document.querySelector("#gender-field");
  const selectedGender = form.querySelector('input[name="gender"]:checked');

  if (!selectedGender) {
    showError(genderField, genderField.dataset.errorMsg);
    return false;
  }

  clearError(genderField);
  return true;
}

form.addEventListener("submit", function(event) {
  event.preventDefault();
  successMessage.textContent = "";

  let valid = true;
  form.querySelectorAll("[data-error]:not(#gender-field)").forEach(function(field) {
    if (!validateField(field)) {
      valid = false;
    }
  });

  if (!validateGender()) {
    valid = false;
  }

  if (valid) {
    successMessage.textContent = "Registration successful!";
  }
});

form.addEventListener("input", function(event) {
  const field = event.target;

  if (field.matches("[data-error]") && field.classList.contains("error")) {
    validateField(field);
  }

  if (field === password && confirmPassword.classList.contains("error")) {
    validateField(confirmPassword);
  }
});

form.addEventListener("change", function(event) {
  if (event.target.name === "gender") {
    validateGender();
  } else if (event.target.matches("[data-error]") && event.target.classList.contains("error")) {
    validateField(event.target);
  }
});

passwordButton.addEventListener("click", function() {
  const showPassword = password.type === "password";
  password.setAttribute("type", showPassword ? "text" : "password");
  passwordButton.textContent = showPassword ? "Hide" : "Show";
  passwordButton.setAttribute("aria-pressed", showPassword);
  passwordButton.classList.toggle("active", showPassword);
});

form.addEventListener("reset", function() {
  form.querySelectorAll("[data-error]").forEach(clearError);
  successMessage.textContent = "";
  password.setAttribute("type", "password");
  passwordButton.textContent = "Show";
  passwordButton.setAttribute("aria-pressed", "false");
  passwordButton.classList.toggle("active", false);
});
