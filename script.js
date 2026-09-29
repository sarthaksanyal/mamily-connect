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
  ".dashboard-view, .team-members-view, .employees-view, .attendance-view",
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
    employeelassName = "employee-team";
    employeeTeam.textContent = team;

    employeeRow.append(avatar, employeeDetails, employeeTeam);
    Object.entries({ name, role, team, ...profileData }).forEach(
      ([key, value]) => {
        employeeRow.dataset[key] = value;
      },
    );
    addEmployeeActions(employeeRow);
    employeeDirectory.append(employeeRow);
    window.refreshAttendanceEmployeeList?.();

    updateEmployeeCount();
    addEmployeeForm.reset();
    addEmployeeForm.hidden = true;
    showAddEmployeeButton.hidden = false;
  });
}

const teamView = document.getElementById("teams-view");
const createTeamForm = document.getElementById("create-team");
const showCreateTeamButton = document.getElementById("show-create-team");
const cancelCreateTeamButton = document.getElementById("cancel-create-team");
const employeeRoster = new Map();

if (teamView && createTeamForm && showCreateTeamButton) {
  document
    .querySelectorAll("#employee-directory .employee-row")
    .forEach((row) => {
      const name = row
        .querySelector(".employee-details h3")
        ?.textContent.trim();
      const role = row.querySelector(".employee-details p")?.textContent.trim();
      if (name) {
        employeeRoster.set(name, role || "Employee");
      }
    });

  createTeamForm
    .querySelectorAll("select[name='team-employees'] option")
    .forEach((option) => {
      if (!employeeRoster.has(option.value)) {
        employeeRoster.set(option.value, "Employee");
      }
    });

  function getInitials(name) {
    return name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function getTeamMembers(teamCard) {
    return [...teamCard.querySelectorAll(".team-member-details strong")].map(
      (member) => member.textContent.trim(),
    );
  }

  function updateTeamCount(teamCard) {
    const count = teamCard.querySelectorAll(".team-member").length;
    const countLabel = teamCard.querySelector(".team-card-header .team-count");
    if (countLabel) {
      countLabel.textContent = `${count} member${count === 1 ? "" : "s"}`;
    }
  }

  function refreshMemberSelect(teamCard) {
    const select = teamCard.querySelector(".team-member-form select");
    if (!select) {
      return;
    }
    const currentMembers = new Set(getTeamMembers(teamCard));
    select.replaceChildren(new Option("Select an employee", ""));
    employeeRoster.forEach((role, name) => {
      if (!currentMembers.has(name)) {
        select.append(new Option(name, name));
      }
    });
  }

  function createMember(name) {
    const member = document.createElement("div");
    member.className = "team-member";

    const avatar = document.createElement("span");
    avatar.className = "member-avatar";
    avatar.textContent = getInitials(name);

    const details = document.createElement("div");
    details.className = "team-member-details";
    const employeeName = document.createElement("strong");
    employeeName.textContent = name;
    const employeeRole = document.createElement("span");
    employeeRole.textContent = employeeRoster.get(name) || "Employee";
    details.append(employeeName, employeeRole);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "employee-action-button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${name} from team`);

    member.append(avatar, details, removeButton);
    return member;
  }

  function createTeamCard(teamName, teamLead, memberNames) {
    const card = document.createElement("article");
    card.className = "team-card";
    const header = document.createElement("div");
    header.className = "team-card-header";
    const titleBlock = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = teamName;
    const lead = document.createElement("p");
    lead.textContent = teamLead
      ? `Led by ${teamLead}`
      : "No team lead assigned";
    titleBlock.append(title, lead);
    const count = document.createElement("span");
    count.className = "team-count";
    header.append(titleBlock, count);
    const members = document.createElement("div");
    members.className = "team-members-list";
    memberNames.forEach((name) => members.append(createMember(name)));

    const form = document.createElement("form");
    form.className = "team-member-form";
    const label = document.createElement("label");
    label.textContent = "Add a member";
    const controls = document.createElement("div");
    const select = document.createElement("select");
    select.innerHTML = '<option value="">Select an employee</option>';
    const addButton = document.createElement("button");
    addButton.type = "submit";
    addButton.className = "secondary-button";
    addButton.textContent = "Add";
    controls.append(select, addButton);
    form.append(label, controls);

    card.append(header, members, form);
    teamView.querySelector(".team-grid").append(card);
    updateTeamCount(card);
    refreshMemberSelect(card);
  }

  teamView.querySelectorAll(".team-card").forEach((teamCard) => {
    updateTeamCount(teamCard);
    refreshMemberSelect(teamCard);
  });

  function setCreateTeamFormVisibility(isVisible) {
    createTeamForm.hidden = !isVisible;
    showCreateTeamButton.setAttribute("aria-expanded", String(isVisible));
    if (isVisible) {
      createTeamForm.elements["team-name"].focus();
    } else {
      createTeamForm.reset();
      showCreateTeamButton.focus();
    }
  }

  showCreateTeamButton.addEventListener("click", () => {
    setCreateTeamFormVisibility(true);
  });

  cancelCreateTeamButton?.addEventListener("click", () => {
    setCreateTeamFormVisibility(false);
  });

  createTeamForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const teamName = createTeamForm.elements["team-name"].value.trim();
    const teamLead = createTeamForm.elements["team-lead"].value;
    const selectedMembers = [
      ...createTeamForm.elements["team-employees"].selectedOptions,
    ].map((option) => option.value);

    if (!teamName || selectedMembers.length === 0) {
      createTeamForm.reportValidity();
      return;
    }

    createTeamCard(teamName, teamLead, selectedMembers);
    createTeamForm.reset();
    const teamTotal = teamView.querySelector(".teams-page-header .team-count");
    if (teamTotal) {
      teamTotal.textContent = `${teamView.querySelectorAll(".team-card").length} teams`;
    }
    setCreateTeamFormVisibility(false);
  });

  teamView.addEventListener("submit", (event) => {
    const memberForm = event.target.closest(".team-member-form");
    if (!memberForm) {
      return;
    }
    event.preventDefault();
    const teamCard = memberForm.closest(".team-card");
    const select = memberForm.querySelector("select");
    if (!select.value) {
      select.focus();
      return;
    }
    teamCard
      .querySelector(".team-members-list")
      .append(createMember(select.value));
    memberForm.reset();
    updateTeamCount(teamCard);
    refreshMemberSelect(teamCard);
  });

  teamView.addEventListener("click", (event) => {
    const removeButton = event.target.closest(
      ".team-member .employee-action-button",
    );
    if (!removeButton) {
      return;
    }
    const teamCard = removeButton.closest(".team-card");
    removeButton.closest(".team-member").remove();
    updateTeamCount(teamCard);
    refreshMemberSelect(teamCard);
  });
}

const attendanceView = document.querySelector(".attendance-view");
if (attendanceView) {
  const monthLabel = attendanceView.querySelector("[data-month-label]");
  const calendar = attendanceView.querySelector("[data-attendance-calendar]");
  const summary = attendanceView.querySelector("[data-attendance-summary]");
  const previousMonthButton = attendanceView.querySelector("[data-month-prev]");
  const nextMonthButton = attendanceView.querySelector("[data-month-next]");
  const employeeList = attendanceView.querySelector(
    "[data-attendance-employees]",
  );
  const today = new Date();
  let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedEmployeeIndex = 0;

  function getAttendanceStatus(date, employeeIndex) {
    if (date > today) {
      return "upcoming";
    }
    if (date.getDay() === 0 || date.getDay() === 6) {
      return "weekend";
    }
    return (date.getDate() + employeeIndex) % 9 === 0 ? "absent" : "present";
  }

  function getAttendanceTimes(date, employeeIndex) {
    const minuteOffset = (date.getDate() * 7 + employeeIndex * 11) % 50;
    const checkIn = new Date(2000, 0, 1, 9, minuteOffset);
    const checkOut = new Date(2000, 0, 1, 17, (minuteOffset + 25) % 60);
    return {
      checkIn: checkIn.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }),
      checkOut: checkOut.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }),
    };
  }

  function renderAttendanceCalendar(employeeIndex) {
    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();
    const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const counts = { present: 0, absent: 0 };
    const cells = [];

    monthLabel.textContent = displayedMonth.toLocaleDateString([], {
      month: "long",
      year: "numeric",
    });

    for (let blankDay = 0; blankDay < firstDayOffset; blankDay += 1) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "attendance-day empty-day";
      emptyCell.setAttribute("aria-hidden", "true");
      cells.push(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const status = getAttendanceStatus(date, employeeIndex);
      const cell = document.createElement("article");
      cell.className = `attendance-day ${status}-day`;
      cell.setAttribute("role", "gridcell");

      const dateNumber = document.createElement("strong");
      dateNumber.className = "attendance-date-number";
      dateNumber.textContent = String(day);
      cell.append(dateNumber);

      const statusLabel = document.createElement("span");
      statusLabel.className = "attendance-status";
      statusLabel.textContent = status[0].toUpperCase() + status.slice(1);
      cell.append(statusLabel);

      if (status === "present") {
        counts.present += 1;
        const times = getAttendanceTimes(date, employeeIndex);
        const checkIn = document.createElement("small");
        checkIn.textContent = `In ${times.checkIn}`;
        const checkOut = document.createElement("small");
        checkOut.textContent = `Out ${times.checkOut}`;
        cell.append(checkIn, checkOut);
      } else if (status === "absent") {
        counts.absent += 1;
        ["In --", "Out --"].forEach((punchLabel) => {
          const punch = document.createElement("small");
          punch.textContent = punchLabel;
          cell.append(punch);
        });
      }
      cells.push(cell);
    }

    calendar.replaceChildren(...cells);
    const trackedDays = counts.present + counts.absent;
    const rate = trackedDays
      ? Math.round((counts.present / trackedDays) * 100)
      : 0;
    summary.replaceChildren();
    [
      ["Present", counts.present],
      ["Absent", counts.absent],
      ["Attendance rate", `${rate}%`],
    ].forEach(([label, value]) => {
      const metric = document.createElement("div");
      metric.className = "attendance-metric";
      const metricLabel = document.createElement("span");
      metricLabel.textContent = label;
      const metricValue = document.createElement("strong");
      metricValue.textContent = String(value);
      metric.append(metricLabel, metricValue);
      summary.append(metric);
    });
  }

  if (employeeList) {
    function renderEmployeeList() {
      const employeeRows = document.querySelectorAll(
        "#employee-directory .employee-row",
      );
      employeeList.replaceChildren();

      employeeRows.forEach((row, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "attendance-employee-button";
        button.dataset.employeeIndex = String(index);
        const name = document.createElement("strong");
        name.textContent = row.querySelector(
          ".employee-details h3",
        ).textContent;
        const role = document.createElement("small");
        role.textContent = row.querySelector(".employee-details p").textContent;
        button.append(name, role);
        button.setAttribute(
          "aria-pressed",
          String(index === selectedEmployeeIndex),
        );
        employeeList.append(button);
      });

      if (employeeRows.length) {
        selectedEmployeeIndex = Math.min(
          selectedEmployeeIndex,
          employeeRows.length - 1,
        );
        employeeList
          .querySelectorAll(".attendance-employee-button")
          .forEach((button) => {
            button.setAttribute(
              "aria-pressed",
              String(
                Number(button.dataset.employeeIndex) === selectedEmployeeIndex,
              ),
            );
          });
        renderAttendanceCalendar(selectedEmployeeIndex);
      } else {
        employeeList.textContent = "No employees to display.";
        calendar.replaceChildren();
        summary.replaceChildren();
        monthLabel.textContent = "";
      }
    }

    employeeList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-employee-index]");
      if (!button) {
        return;
      }
      selectedEmployeeIndex = Number(button.dataset.employeeIndex);
      renderEmployeeList();
    });

    window.refreshAttendanceEmployeeList = renderEmployeeList;
    renderEmployeeList();
  } else {
    renderAttendanceCalendar(selectedEmployeeIndex);
  }

  previousMonthButton.addEventListener("click", () => {
    displayedMonth = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth() - 1,
      1,
    );
    if (employeeList) {
      renderEmployeeList();
    } else {
      renderAttendanceCalendar(selectedEmployeeIndex);
    }
  });

  nextMonthButton.addEventListener("click", () => {
    displayedMonth = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth() + 1,
      1,
    );
    if (employeeList) {
      renderEmployeeList();
    } else {
      renderAttendanceCalendar(selectedEmployeeIndex);
    }
  });
}
