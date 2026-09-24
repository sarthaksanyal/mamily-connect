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

if (roleButtons.length > 0) {
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
}

const navigationItems = document.querySelectorAll(".nav-item[data-view]");
const dashboardViews = document.querySelectorAll(
  ".dashboard-view, .team-members-view, .employees-view",
);
const dashboardHeading = document.querySelector(".topbar-dashboard h1");
navigationItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    const selectedView = document.getElementById(item.dataset.view);
    navigationItems.forEach((navigationItem) => {
      navigationItem.classList.toggle("active", navigationItem === item);
    });
    dashboardViews.forEach((view) => {
      view.hidden = view !== selectedView;
    });
    dashboardHeading.textContent = item.dataset.title || "Dashboard";
  });
});

const addEmployeeForm = document.getElementById("add-employee-form");
const showAddEmployeeButton = document.getElementById("show-add-employee");
const cancelAddEmployeeButton = document.getElementById("cancel-add-employee");
const employeeDirectory = document.getElementById("employee-directory");
const employeeCount = document.getElementById("employee-count");
const employeeSearch = document.getElementById("employee-search");
const employeeProfileDialog = document.getElementById(
  "employee-profile-dialog",
);
const profileView = document.getElementById("profile-view");
const profileDetails = document.getElementById("profile-details");
const profileEditForm = document.getElementById("profile-edit-form");
let editingEmployeeRow = null;

if (addEmployeeForm && showAddEmployeeButton && employeeDirectory) {
  const profileFields = [
    ["Employee ID", "employeeId"],
    ["Name", "name"],
    ["Job Title", "role"],
    ["Team", "team"],
    ["Email", "email"],
    ["Contact Number", "contact"],
    ["Job Location", "location"],
    ["Bank Details", "bank"],
    ["Joining Date", "joiningDate"],
    ["Shift Start Time", "shiftStart"],
    ["Shift End Time", "shiftEnd"],
  ];

  function getEmployeeData(employeeRow) {
    return {
      employeeId: employeeRow.dataset.employeeId || "",
      name: employeeRow.querySelector(".employee-details h3").textContent,
      role: employeeRow.querySelector(".employee-details p").textContent,
      team: employeeRow.querySelector(".employee-team").textContent,
      email: employeeRow.dataset.email || "",
      contact: employeeRow.dataset.contact || "",
      location: employeeRow.dataset.location || "",
      bank: employeeRow.dataset.bank || "",
      joiningDate: employeeRow.dataset.joiningDate || "",
      shiftStart: employeeRow.dataset.shiftStart || "",
      shiftEnd: employeeRow.dataset.shiftEnd || "",
    };
  }

  function addEmployeeActions(employeeRow) {
    if (employeeRow.querySelector(".employee-actions")) {
      return;
    }

    const actions = document.createElement("div");
    actions.className = "employee-actions";
    [
      ["view", "View"],
      ["edit", "Edit"],
      ["delete", "Delete"],
    ].forEach(([action, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `employee-action-button ${action}-employee-button`;
      button.dataset.action = action;
      button.textContent = label;
      button.setAttribute(
        "aria-label",
        `${label}: ${getEmployeeData(employeeRow).name}`,
      );
      actions.append(button);
    });
    employeeRow.append(actions);
  }

  function updateEmployeeActionLabels(employeeRow) {
    const employeeName = getEmployeeData(employeeRow).name;
    employeeRow.querySelectorAll("[data-action]").forEach((button) => {
      const actionLabel = button.textContent;
      button.setAttribute("aria-label", `${actionLabel}: ${employeeName}`);
    });
  }

  function updateEmployeeCount() {
    const currentCount =
      employeeDirectory.querySelectorAll(".employee-row").length;
    employeeCount.textContent = `${currentCount} employees`;
  }

  function showProfile(employeeRow) {
    const employeeData = getEmployeeData(employeeRow);
    document.getElementById("profile-dialog-title").textContent =
      employeeData.name;
    profileDetails.replaceChildren();

    profileFields.forEach(([label, key]) => {
      const term = document.createElement("dt");
      term.textContent = label;
      const description = document.createElement("dd");
      description.textContent = employeeData[key] || "Not provided";
      profileDetails.append(term, description);
    });

    profileView.hidden = false;
    profileEditForm.hidden = true;
    employeeProfileDialog.showModal();
  }

  function startEditingEmployee(employeeRow) {
    const employeeData = getEmployeeData(employeeRow);
    editingEmployeeRow = employeeRow;
    document.getElementById("profile-dialog-title").textContent =
      `Edit ${employeeData.name}`;
    document.getElementById("profile-name").value = employeeData.name;
    document.getElementById("profile-role").value = employeeData.role;
    document.getElementById("profile-team").value = employeeData.team;
    document.getElementById("profile-email").value = employeeData.email;
    document.getElementById("profile-contact").value = employeeData.contact;
    document.getElementById("profile-location").value = employeeData.location;
    document.getElementById("profile-bank").value = employeeData.bank;
    document.getElementById("profile-joining-date").value =
      employeeData.joiningDate;
    document.getElementById("profile-shift-start").value =
      employeeData.shiftStart;
    document.getElementById("profile-shift-end").value = employeeData.shiftEnd;
    profileView.hidden = true;
    profileEditForm.hidden = false;
    employeeProfileDialog.showModal();
  }

  employeeDirectory
    .querySelectorAll(".employee-row")
    .forEach(addEmployeeActions);

  showAddEmployeeButton.addEventListener("click", () => {
    addEmployeeForm.hidden = false;
    showAddEmployeeButton.hidden = true;
    document.getElementById("new-employee-name").focus();
  });

  cancelAddEmployeeButton.addEventListener("click", () => {
    addEmployeeForm.reset();
    addEmployeeForm.hidden = true;
    showAddEmployeeButton.hidden = false;
  });

  employeeSearch.addEventListener("input", () => {
    const searchTerm = employeeSearch.value.trim().toLowerCase();
    const employeeRows = employeeDirectory.querySelectorAll(".employee-row");

    employeeRows.forEach((employeeRow) => {
      const employeeText = employeeRow.textContent.toLowerCase();
      employeeRow.hidden =
        searchTerm !== "" && !employeeText.includes(searchTerm);
    });
  });

  employeeDirectory.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) {
      return;
    }

    const employeeRow = actionButton.closest(".employee-row");
    if (actionButton.dataset.action === "view") {
      showProfile(employeeRow);
    } else if (actionButton.dataset.action === "edit") {
      startEditingEmployee(employeeRow);
    } else if (window.confirm(`Delete ${getEmployeeData(employeeRow).name}?`)) {
      employeeRow.remove();
      updateEmployeeCount();
    }
  });

  document
    .getElementById("close-profile-dialog")
    .addEventListener("click", () => {
      employeeProfileDialog.close();
    });

  document
    .getElementById("cancel-profile-edit")
    .addEventListener("click", () => {
      employeeProfileDialog.close();
    });

  profileEditForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const updatedData = {
      name: document.getElementById("profile-name").value.trim(),
      role: document.getElementById("profile-role").value.trim(),
      team: document.getElementById("profile-team").value.trim(),
      email: document.getElementById("profile-email").value.trim(),
      contact: document.getElementById("profile-contact").value.trim(),
      location: document.getElementById("profile-location").value.trim(),
      bank: document.getElementById("profile-bank").value.trim(),
      joiningDate: document.getElementById("profile-joining-date").value,
      shiftStart: document.getElementById("profile-shift-start").value,
      shiftEnd: document.getElementById("profile-shift-end").value,
    };

    editingEmployeeRow.querySelector(".employee-details h3").textContent =
      updatedData.name;
    editingEmployeeRow.querySelector(".employee-details p").textContent =
      updatedData.role;
    editingEmployeeRow.querySelector(".employee-team").textContent =
      updatedData.team;
    editingEmployeeRow.querySelector(".member-avatar").textContent =
      updatedData.name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    Object.entries(updatedData).forEach(([key, value]) => {
      editingEmployeeRow.dataset[key] = value;
    });
    updateEmployeeActionLabels(editingEmployeeRow);
    employeeProfileDialog.close();
  });

  addEmployeeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("new-employee-name").value.trim();
    const role = document.getElementById("new-employee-role").value.trim();
    const team = document.getElementById("new-employee-team").value;
    const profileData = {
      employeeId: document.getElementById("employee-id").value.trim(),
      email: document.getElementById("email-id").value.trim(),
      contact: document.getElementById("contact-number").value.trim(),
      location: document.getElementById("job-location").value.trim(),
      bank: document.getElementById("bank-account").value.trim(),
      joiningDate: document.getElementById("joining-date").value,
      shiftStart: document.getElementById("shift-timing").value,
      shiftEnd: document.getElementById("shift-end-time").value,
    };
    const initials = name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const employeeRow = document.createElement("article");
    employeeRow.className = "employee-row";

    const avatar = document.createElement("span");
    avatar.className = "member-avatar";
    avatar.textContent = initials;

    const employeeDetails = document.createElement("div");
    employeeDetails.className = "employee-details";

    const employeeName = document.createElement("h3");
    employeeName.textContent = name;
    const employeeRole = document.createElement("p");
    employeeRole.textContent = role;
    employeeDetails.append(employeeName, employeeRole);

    const employeeTeam = document.createElement("span");
    employeeTeam.className = "employee-team";
    employeeTeam.textContent = team;

    employeeRow.append(avatar, employeeDetails, employeeTeam);
    Object.entries({ name, role, team, ...profileData }).forEach(
      ([key, value]) => {
        employeeRow.dataset[key] = value;
      },
    );
    addEmployeeActions(employeeRow);
    employeeDirectory.append(employeeRow);

    updateEmployeeCount();
    addEmployeeForm.reset();
    addEmployeeForm.hidden = true;
    showAddEmployeeButton.hidden = false;
  });
}
