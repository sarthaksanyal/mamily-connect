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
  ".dashboard-view, .team-members-view, .profile-view, .employees-view, .attendance-view, .performance-view, .feedback-view, .meetings-view, .task-view, .work-log-view, .notification-view",
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
    if (
      item.dataset.view === "work-log" &&
      window.matchMedia("(max-width: 980px)").matches
    ) {
      selectedView.scrollIntoView({ block: "start" });
    }
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
      actions.append(button);
    });
    employeeRow.append(actions);
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
    window.refreshMeetingEmployeeList?.();

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
      cells.push(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const status = getAttendanceStatus(date, employeeIndex);
      const cell = document.createElement("article");
      cell.className = `attendance-day ${status}-day`;

      const dateNumber = document.createElement("strong");
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
            button.classList.toggle(
              "selected",
              Number(button.dataset.employeeIndex) === selectedEmployeeIndex,
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

const leaveStorageKey = "mamily-connect-leave-state-v1";
const leaveStateSeed = {
  balances: {
    "Sarthak Sanyal": {
      total: 18,
      used: 6,
      available: 12,
      categories: {
        casual: { total: 8, used: 3, available: 5 },
        sick: { total: 6, used: 2, available: 4 },
        earned: { total: 4, used: 1, available: 3 },
      },
    },
    "Ananya Roy": {
      total: 18,
      used: 8,
      available: 10,
      categories: {
        casual: { total: 8, used: 4, available: 4 },
        sick: { total: 6, used: 3, available: 3 },
        earned: { total: 4, used: 1, available: 3 },
      },
    },
    "Mandeep Kaur": {
      total: 18,
      used: 10,
      available: 8,
      categories: {
        casual: { total: 8, used: 5, available: 3 },
        sick: { total: 6, used: 4, available: 2 },
        earned: { total: 4, used: 1, available: 3 },
      },
    },
    "Jaya Kapoor": {
      total: 18,
      used: 3,
      available: 15,
      categories: {
        casual: { total: 8, used: 1, available: 7 },
        sick: { total: 6, used: 1, available: 5 },
        earned: { total: 4, used: 1, available: 3 },
      },
    },
    "Neha Kapoor": {
      total: 18,
      used: 9,
      available: 9,
      categories: {
        casual: { total: 8, used: 4, available: 4 },
        sick: { total: 6, used: 3, available: 3 },
        earned: { total: 4, used: 2, available: 2 },
      },
    },
    "Daksh Ojha": {
      total: 18,
      used: 8,
      available: 10,
      categories: {
        casual: { total: 8, used: 3, available: 5 },
        sick: { total: 6, used: 3, available: 3 },
        earned: { total: 4, used: 2, available: 2 },
      },
    },
  },
  requests: [
    {
      id: "leave-seed-1",
      employee: "Sarthak Sanyal",
      category: "casual",
      duration: "full-day",
      startDate: "2026-10-05",
      endDate: "2026-10-05",
      reason: "Personal reasons",
      days: 1,
      status: "pending",
    },
    {
      id: "leave-seed-2",
      employee: "Ananya Roy",
      category: "sick",
      duration: "full-day",
      startDate: "2026-10-01",
      endDate: "2026-10-01",
      reason: "Sick",
      days: 1,
      status: "pending",
    },
    {
      id: "leave-seed-3",
      employee: "Mandeep Kaur",
      category: "casual",
      duration: "short-leave",
      startDate: "2026-09-30",
      endDate: "2026-09-30",
      startTime: "16:00",
      endTime: "18:00",
      reason: "Personal reasons",
      days: 0,
      status: "pending",
    },
    {
      id: "leave-seed-4",
      employee: "Daksh Ojha",
      category: "casual",
      duration: "short-leave",
      startDate: "2026-09-30",
      endDate: "2026-09-30",
      startTime: "09:00",
      endTime: "11:00",
      reason: "Medical",
      days: 0,
      status: "pending",
    },
  ],
};

function copyLeaveState(state) {
  return JSON.parse(JSON.stringify(state));
}

function loadLeaveState() {
  try {
    const storedState = window.localStorage.getItem(leaveStorageKey);
    if (storedState) {
      return JSON.parse(storedState);
    }
    const initialState = copyLeaveState(leaveStateSeed);
    window.localStorage.setItem(leaveStorageKey, JSON.stringify(initialState));
    return initialState;
  } catch {
    return copyLeaveState(leaveStateSeed);
  }
}

let leaveState = loadLeaveState();

function saveLeaveState() {
  try {
    window.localStorage.setItem(leaveStorageKey, JSON.stringify(leaveState));
  } catch {
    return;
  }
}

function getLeaveCategoryLabel(category) {
  return (
    {
      casual: "Casual Leave",
      sick: "Sick Leave",
      earned: "Earned Leave",
    }[category] || "Leave"
  );
}

function formatLeaveDate(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString([], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function updateEmployeeLeaveBalances() {
  const leaveView = document.getElementById("leaves");
  if (!leaveView) {
    return;
  }

  const employeeName =
    document.querySelector(".user-chip strong")?.textContent.trim() ||
    "Sarthak Sanyal";
  const balance = leaveState.balances[employeeName];
  if (!balance) {
    return;
  }

  const summaryValues = leaveView.querySelectorAll(
    ".stats-grid .stat-card strong",
  );
  [balance.available, balance.total, balance.used].forEach((value, index) => {
    if (summaryValues[index]) {
      summaryValues[index].textContent = String(value);
    }
  });

  leaveView.querySelectorAll("table tbody tr").forEach((row) => {
    const categoryName = row
      .querySelector("th")
      ?.textContent.trim()
      .toLowerCase();
    if (!categoryName) {
      return;
    }
    if (categoryName === "total") {
      row.cells[1].textContent = String(balance.total);
      row.cells[2].textContent = String(balance.used);
      row.cells[3].textContent = String(balance.available);
      return;
    }
    const category = categoryName.split(" ")[0];
    const categoryBalance = balance.categories[category];
    if (categoryBalance) {
      row.cells[1].textContent = String(categoryBalance.total);
      row.cells[2].textContent = String(categoryBalance.used);
      row.cells[3].textContent = String(categoryBalance.available);
    }
  });
}

function updateManagerLeaveBalances() {
  const leaveView = document.getElementById("leave-requests");
  if (!leaveView) {
    return;
  }

  leaveView.querySelectorAll("table tbody tr").forEach((row) => {
    const employeeName = row.querySelector("th")?.textContent.trim();
    const balance = leaveState.balances[employeeName];
    if (!balance) {
      return;
    }
    row.cells[2].textContent = String(balance.total);
    row.cells[3].textContent = String(balance.used);
    row.cells[4].textContent = String(balance.available);
  });
}

function renderManagerLeaveRequests() {
  const leaveView = document.getElementById("leave-requests");
  const requestList = leaveView?.querySelector(".employee-directory");
  if (!leaveView || !requestList) {
    return;
  }

  const pendingRequests = leaveState.requests.filter(
    (request) => request.status === "pending",
  );
  const requestCount = leaveView.querySelector(".panel-header > span");
  if (requestCount) {
    requestCount.textContent = `${pendingRequests.length} request${pendingRequests.length === 1 ? "" : "s"}`;
  }

  requestList.replaceChildren();
  if (pendingRequests.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "leave-empty-state";
    emptyMessage.textContent = "No pending leave requests.";
    requestList.append(emptyMessage);
    return;
  }

  pendingRequests.forEach((request) => {
    const row = document.createElement("article");
    row.className = "employee-row";
    row.dataset.leaveRequestId = request.id;

    const details = document.createElement("div");
    details.className = "employee-details";
    const name = document.createElement("h3");
    name.textContent = request.employee;
    const description = document.createElement("p");
    const durationLabel = {
      "full-day": "Full Day",
      "half-day": "Half Day",
      "short-leave": "Short Leave",
    }[request.duration];
    const halfDayLabel =
      request.duration === "half-day"
        ? ` (${request.halfDaySession === "second-half" ? "Second Half" : "First Half"})`
        : "";
    const dateLabel =
      request.startDate === request.endDate
        ? formatLeaveDate(request.startDate)
        : `${formatLeaveDate(request.startDate)} - ${formatLeaveDate(request.endDate)}`;
    const timeLabel =
      request.duration === "short-leave"
        ? `, ${request.startTime} - ${request.endTime}`
        : "";
    description.textContent = `${getLeaveCategoryLabel(request.category)} - ${durationLabel}${halfDayLabel} - ${dateLabel}${timeLabel}`;
    const reason = document.createElement("small");
    reason.textContent = `Reason: ${request.reason}`;
    details.append(name, description, reason);

    const balance = leaveState.balances[request.employee];
    const balanceLabel = document.createElement("span");
    balanceLabel.className = "employee-team";
    balanceLabel.textContent = `${balance?.available ?? 0} Leaves Available`;

    const actions = document.createElement("div");
    actions.className = "employee-actions";
    [
      ["approve", "Approve", "secondary-button"],
      ["reject", "Reject", "employee-action-button"],
    ].forEach(([action, label, className]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = className;
      button.dataset.leaveAction = action;
      button.textContent = label;
      actions.append(button);
    });

    row.append(details, balanceLabel, actions);
    requestList.append(row);
  });
}

function updateLeaveViews() {
  updateEmployeeLeaveBalances();
  updateManagerLeaveBalances();
  renderManagerLeaveRequests();
}

function countLeaveDays(startDate, endDate) {
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
  const current = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  let weekdays = 0;

  while (current <= end) {
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      weekdays += 1;
    }
    current.setDate(current.getDate() + 1);
  }
  return weekdays;
}

const leaveForm = document.getElementById("leave-application-form");
if (leaveForm) {
  const submitLeaveButton = leaveForm.querySelector("button[type='button']");
  let leaveFormMessage = leaveForm.querySelector(".leave-form-message");

  if (!leaveFormMessage) {
    leaveFormMessage = document.createElement("p");
    leaveFormMessage.className = "leave-form-message";
    submitLeaveButton.before(leaveFormMessage);
  }

  function showLeaveFormMessage(message, isError = false) {
    leaveFormMessage.textContent = message;
    leaveFormMessage.classList.toggle("error", isError);
  }

  submitLeaveButton.addEventListener("click", () => {
    if (!leaveForm.reportValidity()) {
      return;
    }

    const formData = new FormData(leaveForm);
    const category = formData.get("leave-type");
    const duration = formData.get("leave-duration");
    const startDate = formData.get("start-date");
    const endDate = formData.get("end-date");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    if (start < today || end < start) {
      showLeaveFormMessage("Choose a current or future date range.", true);
      return;
    }

    if (duration !== "full-day" && startDate !== endDate) {
      showLeaveFormMessage(
        "Half-day and short leave requests must be for one date.",
        true,
      );
      return;
    }

    if (
      duration !== "full-day" &&
      (start.getDay() === 0 || start.getDay() === 6)
    ) {
      showLeaveFormMessage(
        "Choose a weekday for half-day or short leave.",
        true,
      );
      return;
    }

    const startTime = formData.get("short-leave-start");
    const endTime = formData.get("short-leave-end");
    if (
      duration === "short-leave" &&
      (!startTime || !endTime || startTime >= endTime)
    ) {
      showLeaveFormMessage(
        "Choose valid start and end times for your short leave.",
        true,
      );
      return;
    }

    const employeeName =
      document.querySelector(".user-chip strong")?.textContent.trim() ||
      "Sarthak Sanyal";
    const balance = leaveState.balances[employeeName];
    const categoryBalance = balance?.categories[category];
    const requestedDays =
      duration === "short-leave"
        ? 0
        : duration === "half-day"
          ? 0.5
          : countLeaveDays(startDate, endDate);

    if (requestedDays === 0 && duration !== "short-leave") {
      showLeaveFormMessage(
        "The selected range contains no working days.",
        true,
      );
      return;
    }

    const alreadyRequested = leaveState.requests
      .filter(
        (request) =>
          request.status === "pending" &&
          request.employee === employeeName &&
          request.category === category,
      )
      .reduce((total, request) => total + request.days, 0);
    if (
      categoryBalance &&
      requestedDays > categoryBalance.available - alreadyRequested
    ) {
      showLeaveFormMessage(
        "There are not enough leaves available in this category.",
        true,
      );
      return;
    }

    leaveState.requests.push({
      id: `leave-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      employee: employeeName,
      category,
      duration,
      startDate,
      endDate,
      startTime: duration === "short-leave" ? startTime : "",
      endTime: duration === "short-leave" ? endTime : "",
      halfDaySession: formData.get("half-day-session"),
      reason: formData.get("reason").trim(),
      days: requestedDays,
      status: "pending",
    });
    saveLeaveState();
    leaveForm.reset();
    showLeaveFormMessage("Your leave request has been sent for review.");
  });
}

const managerLeaveView = document.getElementById("leave-requests");
managerLeaveView?.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-leave-action]");
  if (!actionButton) {
    return;
  }

  const requestRow = actionButton.closest("[data-leave-request-id]");
  const request = leaveState.requests.find(
    (item) => item.id === requestRow?.dataset.leaveRequestId,
  );
  if (!request || request.status !== "pending") {
    return;
  }

  if (actionButton.dataset.leaveAction === "approve") {
    const balance = leaveState.balances[request.employee];
    const categoryBalance = balance?.categories[request.category];
    if (
      request.days > 0 &&
      (!balance ||
        !categoryBalance ||
        balance.available < request.days ||
        categoryBalance.available < request.days)
    ) {
      return;
    }
    if (request.days > 0) {
      balance.available -= request.days;
      balance.used += request.days;
      categoryBalance.available -= request.days;
      categoryBalance.used += request.days;
    }
    request.status = "approved";
  } else {
    request.status = "rejected";
  }

  saveLeaveState();
  updateLeaveViews();
});

updateLeaveViews();

window.addEventListener("storage", (event) => {
  if (event.key !== leaveStorageKey || !event.newValue) {
    return;
  }
  try {
    leaveState = JSON.parse(event.newValue);
    updateLeaveViews();
  } catch {
    return;
  }
});

const performanceView = document.getElementById("performance-view");
if (performanceView) {
  const performanceSeries = {
    "Sarthak Sanyal": [72, 75, 74, 79, 78, 82, 80, 84, 86, 85, 89, 91],
    "Ananya Roy": [80, 82, 81, 83, 85, 84, 88, 90, 89, 92, 93, 94],
    "Mandeep Kaur": [68, 70, 72, 71, 74, 76, 75, 78, 80, 79, 82, 84],
    "Jaya Patel": [75, 73, 76, 78, 77, 80, 82, 81, 84, 83, 86, 88],
    "Neha Kapoor": [78, 79, 80, 78, 82, 84, 83, 85, 87, 86, 88, 90],
    "Daksh Ojha": [71, 74, 76, 75, 77, 79, 81, 80, 82, 85, 84, 87],
  };
  const performanceColors = [
    "#2d5d9a",
    "#e53d7a",
    "#278264",
    "#b27a12",
    "#7454a8",
    "#168c99",
  ];
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const chart = performanceView.querySelector("[data-performance-chart]");
  const summary = performanceView.querySelector("[data-performance-summary]");
  const roster = performanceView.querySelector("[data-performance-roster]");
  const legend = performanceView.querySelector("[data-performance-legend]");
  const employeeSearchInput = performanceView.querySelector(
    "#performance-employee-search",
  );
  const employeeOptions = performanceView.querySelector(
    "#performance-employee-options",
  );
  const performanceDescription = performanceView.querySelector(
    "[data-performance-description]",
  );
  const performanceChartTitle = performanceView.querySelector(
    "[data-performance-chart-title]",
  );
  const performanceEmployeeLabel = performanceView.querySelector(
    ".performance-employee-label",
  );
  let activeEmployeeOption = -1;
  const employeeDirectoryRows = document.querySelectorAll(
    "#employee-directory .employee-row",
  );
  const isManagerView = Boolean(roster);
  const employees = isManagerView
    ? [...employeeDirectoryRows].map((row) => ({
        name: row.querySelector(".employee-details h3").textContent.trim(),
        role: row.querySelector(".employee-details p").textContent.trim(),
      }))
    : [
        {
          name:
            document.querySelector(".user-chip strong")?.textContent.trim() ||
            "Sarthak Sanyal",
          role: "",
        },
      ];
  function getPerformanceScores(name, employeeIndex) {
    if (performanceSeries[name]) {
      return performanceSeries[name];
    }
    return monthLabels.map(
      (_, monthIndex) => 70 + ((employeeIndex * 7 + monthIndex * 3) % 19),
    );
  }

  function renderPerformanceChart(series) {
    const width = 760;
    const height = 300;
    const plot = { left: 42, right: 18, top: 18, bottom: 38 };
    const plotWidth = width - plot.left - plot.right;
    const plotHeight = height - plot.top - plot.bottom;
    const yForScore = (score) => plot.top + ((100 - score) / 50) * plotHeight;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("role", "img");

    [50, 60, 70, 80, 90, 100].forEach((score) => {
      const y = yForScore(score);
      const gridLine = document.createElementNS(svg.namespaceURI, "line");
      gridLine.setAttribute("x1", String(plot.left));
      gridLine.setAttribute("x2", String(width - plot.right));
      gridLine.setAttribute("y1", String(y));
      gridLine.setAttribute("y2", String(y));
      gridLine.setAttribute("class", "performance-grid-line");
      svg.append(gridLine);
      const scoreLabel = document.createElementNS(svg.namespaceURI, "text");
      scoreLabel.setAttribute("x", String(plot.left - 10));
      scoreLabel.setAttribute("y", String(y + 4));
      scoreLabel.setAttribute("text-anchor", "end");
      scoreLabel.setAttribute("class", "performance-axis-label");
      scoreLabel.textContent = String(score);
      svg.append(scoreLabel);
    });
    monthLabels.forEach((month, monthIndex) => {
      const x = plot.left + (monthIndex / (monthLabels.length - 1)) * plotWidth;
      const monthLabel = document.createElementNS(svg.namespaceURI, "text");
      monthLabel.setAttribute("x", String(x));
      monthLabel.setAttribute("y", String(height - 10));
      monthLabel.setAttribute("text-anchor", "middle");
      monthLabel.setAttribute("class", "performance-axis-label");
      monthLabel.textContent = month;
      svg.append(monthLabel);
    });
    series.forEach(({ name, scores, color }) => {
      const points = scores.map((score, monthIndex) => {
        const x =
          plot.left + (monthIndex / (monthLabels.length - 1)) * plotWidth;
        return `${x},${yForScore(score)}`;
      });
      const line = document.createElementNS(svg.namespaceURI, "polyline");
      line.setAttribute("points", points.join(" "));
      line.setAttribute("stroke", color);
      line.setAttribute("class", "performance-line");
      svg.append(line);
      scores.forEach((score, monthIndex) => {
        const point = document.createElementNS(svg.namespaceURI, "circle");
        point.setAttribute(
          "cx",
          String(
            plot.left + (monthIndex / (monthLabels.length - 1)) * plotWidth,
          ),
        );
        point.setAttribute("cy", String(yForScore(score)));
        point.setAttribute("r", series.length === 1 ? "4" : "3");
        point.setAttribute("fill", color);
        point.setAttribute("class", "performance-point");
        const pointTitle = document.createElementNS(svg.namespaceURI, "title");
        pointTitle.textContent = `${name}, ${monthLabels[monthIndex]}: ${score}%`;
        point.append(pointTitle);
        svg.append(point);
      });
    });

    chart.replaceChildren(svg);
  }

  const chartSeries = employees.map((employee, index) => ({
    ...employee,
    scores: getPerformanceScores(employee.name, index),
    color: performanceColors[index % performanceColors.length],
  }));
  function closeEmployeeOptions() {
    employeeOptions.hidden = true;
    employeeSearchInput.setAttribute("aria-expanded", "false");
    employeeSearchInput.removeAttribute("aria-activedescendant");
    activeEmployeeOption = -1;
  }

  function renderEmployeeOptions(searchTerm = "") {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchingEmployees = employees.filter((employee) =>
      employee.name.toLowerCase().includes(normalizedSearch),
    );
    employeeOptions.replaceChildren();
    activeEmployeeOption = -1;

    if (!matchingEmployees.length) {
      const emptyMessage = document.createElement("div");
      emptyMessage.className = "performance-employee-empty";
      emptyMessage.textContent = "No employees found";
      employeeOptions.append(emptyMessage);
    } else {
      matchingEmployees.forEach((employee, index) => {
        const option = document.createElement("div");
        option.className = "performance-employee-option";
        option.id = `performance-employee-option-${index}`;
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", "false");
        option.textContent = employee.name;
        option.addEventListener("click", () => {
          employeeSearchInput.value = employee.name;
          closeEmployeeOptions();
          renderPerformanceView();
        });
        employeeOptions.append(option);
      });
    }

    employeeOptions.hidden = false;
    employeeSearchInput.setAttribute("aria-expanded", "true");
  }

  function setActiveEmployeeOption(nextIndex) {
    const options = employeeOptions.querySelectorAll('[role="option"]');
    if (!options.length) return;

    activeEmployeeOption = (nextIndex + options.length) % options.length;
    options.forEach((option, index) => {
      const isActive = index === activeEmployeeOption;
      option.setAttribute("aria-selected", String(isActive));
      option.classList.toggle("is-active", isActive);
    });
    employeeSearchInput.setAttribute(
      "aria-activedescendant",
      options[activeEmployeeOption].id,
    );
    options[activeEmployeeOption].scrollIntoView({ block: "nearest" });
  }

  function renderPerformanceView() {
    const searchTerm = employeeSearchInput?.value.trim().toLowerCase() || "";
    const selectedEmployee = searchTerm
      ? chartSeries.find(
          (employee) => employee.name.toLowerCase() === searchTerm,
        )
      : null;
    const displayedSeries = selectedEmployee ? [selectedEmployee] : chartSeries;
    renderPerformanceChart(displayedSeries);

    if (isManagerView) {
      performanceDescription.textContent = selectedEmployee
        ? `Showing annual performance for ${selectedEmployee.name}.`
        : searchTerm
          ? "No employee selected; showing annual performance for the full team."
          : "Annual performance across all employees.";
      performanceChartTitle.textContent = selectedEmployee
        ? `${selectedEmployee.name} performance through the year`
        : "Team performance through the year";
      performanceEmployeeLabel.textContent = selectedEmployee
        ? selectedEmployee.name
        : "All employees";
    }

    const averageScore = displayedSeries.length
      ? Math.round(
          displayedSeries.reduce(
            (total, employee) => total + employee.scores[11],
            0,
          ) / displayedSeries.length,
        )
      : 0;
    const summaryItems = isManagerView
      ? selectedEmployee
        ? [
            ["Year-end score", `${selectedEmployee.scores[11]}%`],
            [
              "Annual average",
              `${Math.round(selectedEmployee.scores.reduce((total, score) => total + score, 0) / 12)}%`,
            ],
            [
              "Change this year",
              `${selectedEmployee.scores[11] - selectedEmployee.scores[0] >= 0 ? "+" : ""}${selectedEmployee.scores[11] - selectedEmployee.scores[0]} pts`,
            ],
          ]
        : [
            ["Team average", `${averageScore}%`],
            ["Employees reviewed", displayedSeries.length],
            [
              "Top score",
              `${Math.max(0, ...displayedSeries.map((employee) => employee.scores[11]))}%`,
            ],
          ]
      : [
          ["Year-end score", `${displayedSeries[0].scores[11]}%`],
          [
            "Annual average",
            `${Math.round(displayedSeries[0].scores.reduce((total, score) => total + score, 0) / 12)}%`,
          ],
          [
            "Change this year",
            `+${displayedSeries[0].scores[11] - displayedSeries[0].scores[0]} pts`,
          ],
        ];
    summary.replaceChildren();
    summaryItems.forEach(([label, value]) => {
      const metric = document.createElement("article");
      metric.className = "performance-metric";
      const metricLabel = document.createElement("span");
      metricLabel.textContent = label;
      const metricValue = document.createElement("strong");
      metricValue.textContent = String(value);
      metric.append(metricLabel, metricValue);
      summary.append(metric);
    });
    roster?.replaceChildren();
    legend?.replaceChildren();
    if (roster) {
      displayedSeries.forEach((employee) => {
        const row = document.createElement("tr");
        [
          employee.name,
          employee.role,
          `${employee.scores[11]}%`,
          `${employee.scores[11] - employee.scores[0] >= 0 ? "+" : ""}${employee.scores[11] - employee.scores[0]} pts`,
        ].forEach((value) => {
          const cell = document.createElement("td");
          cell.textContent = value;
          row.append(cell);
        });
        roster.append(row);

        const legendItem = document.createElement("span");
        legendItem.className = "performance-legend-item";
        const swatch = document.createElement("i");
        swatch.style.setProperty("--series-color", employee.color);
        const employeeName = document.createElement("span");
        employeeName.textContent = employee.name;
        legendItem.append(swatch, employeeName);
        legend.append(legendItem);
      });
    }
  }

  employeeSearchInput?.addEventListener("focus", () => {
    renderEmployeeOptions(employeeSearchInput.value);
  });
  employeeSearchInput?.addEventListener("click", () => {
    if (employeeOptions.hidden) {
      renderEmployeeOptions(employeeSearchInput.value);
    }
  });
  employeeSearchInput?.addEventListener("input", () => {
    renderEmployeeOptions(employeeSearchInput.value);
    renderPerformanceView();
  });
  employeeSearchInput?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (employeeOptions.hidden) {
        renderEmployeeOptions(employeeSearchInput.value);
      }
      setActiveEmployeeOption(
        activeEmployeeOption + (event.key === "ArrowDown" ? 1 : -1),
      );
    } else if (event.key === "Enter" && activeEmployeeOption >= 0) {
      event.preventDefault();
      employeeOptions
        .querySelectorAll('[role="option"]')
        [activeEmployeeOption]?.click();
    } else if (event.key === "Escape") {
      closeEmployeeOptions();
    }
  });
  employeeOptions?.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  if (employeeSearchInput && employeeOptions) {
    document.addEventListener("click", (event) => {
      if (
        !employeeSearchInput.contains(event.target) &&
        !employeeOptions.contains(event.target)
      ) {
        closeEmployeeOptions();
      }
    });
  }
  renderPerformanceView();
}

const feedbackStorageKey = "mamily-connect-feedback-v1";
const feedbackSeed = [
  {
    id: "feedback-seed-1",
    from: "Ananya Roy",
    to: "Sarthak Sanyal",
    date: "2026-09-24",
    message:
      "Your notes have been clear and helpful. Keep sharing your findings with the team.",
  },
  {
    id: "feedback-seed-2",
    from: "Ananya Roy",
    to: "Mandeep Kaur",
    date: "2026-09-15",
    message:
      "Thank you for your customer follow-ups and steady support this month.",
  },
  {
    id: "feedback-seed-3",
    from: "Sarthak Sanyal",
    to: "Ananya Roy",
    date: "2026-09-22",
    message: "The onboarding checklist has been helpful. ",
  },
];

function loadFeedbackEntries() {
  try {
    const storedEntries = window.localStorage.getItem(feedbackStorageKey);
    if (storedEntries) {
      const parsedEntries = JSON.parse(storedEntries);
      if (Array.isArray(parsedEntries)) {
        return parsedEntries;
      }
    }
    window.localStorage.setItem(
      feedbackStorageKey,
      JSON.stringify(feedbackSeed),
    );
  } catch {
    return [...feedbackSeed];
  }
  return [...feedbackSeed];
}

let feedbackEntries = loadFeedbackEntries();

function saveFeedbackEntry(entry) {
  feedbackEntries = [entry, ...feedbackEntries];
  try {
    window.localStorage.setItem(
      feedbackStorageKey,
      JSON.stringify(feedbackEntries),
    );
  } catch {
    return;
  }
}

function formatFeedbackDate(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function getLocalDateValue() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function renderFeedbackList(container, entries, direction) {
  if (!container) {
    return;
  }
  if (!entries.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "feedback-empty";
    emptyState.textContent = "No feedback to show yet.";
    container.replaceChildren(emptyState);
    return;
  }

  const cards = entries.map((entry) => {
    const card = document.createElement("article");
    card.className = "feedback-entry";
    const header = document.createElement("div");
    header.className = "feedback-entry-header";
    const senderOrRecipient = document.createElement("strong");
    senderOrRecipient.textContent =
      direction === "received" ? `From ${entry.from}` : `To ${entry.to}`;
    const date = document.createElement("time");
    date.dateTime = entry.date;
    date.textContent = formatFeedbackDate(entry.date);
    const message = document.createElement("p");
    message.textContent = entry.message;
    header.append(senderOrRecipient, date);
    card.append(header, message);
    return card;
  });
  container.replaceChildren(...cards);
}

const employeeFeedbackForm = document.getElementById("employee-feedback-form");
const managerFeedbackForm = document.getElementById("manager-feedback-form");
const employeeFeedbackName =
  document.querySelector(".user-chip strong")?.textContent.trim() ||
  "Sarthak Sanyal";
const managerFeedbackName =
  document
    .querySelector(".manager-chip .user-chip strong")
    ?.textContent.trim() ||
  document.querySelector(".manager-chip strong")?.textContent.trim() ||
  "Ananya Roy";

function renderEmployeeFeedback() {
  const receivedList = document.querySelector(
    "#feedback[data-feedback-role='employee'] [data-feedback-received]",
  );
  renderFeedbackList(
    receivedList,
    feedbackEntries.filter((entry) => entry.to === employeeFeedbackName),
    "received",
  );
}

function renderManagerFeedback() {
  const feedbackView = document.querySelector(
    "#feedback[data-feedback-role='manager']",
  );
  if (!feedbackView) {
    return;
  }
  renderFeedbackList(
    feedbackView.querySelector("[data-feedback-sent]"),
    feedbackEntries.filter((entry) => entry.from === managerFeedbackName),
    "sent",
  );
  renderFeedbackList(
    feedbackView.querySelector("[data-feedback-received]"),
    feedbackEntries.filter((entry) => entry.to === managerFeedbackName),
    "received",
  );
}

if (employeeFeedbackForm) {
  employeeFeedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = employeeFeedbackForm.elements.message.value.trim();
    if (!message) {
      employeeFeedbackForm.elements.message.focus();
      return;
    }
    saveFeedbackEntry({
      id: `feedback-${Date.now()}`,
      from: employeeFeedbackName,
      to: "Ananya Roy",
      date: getLocalDateValue(),
      message,
    });
    employeeFeedbackForm.reset();
    employeeFeedbackForm.querySelector("[data-feedback-status]").textContent =
      "Feedback sent to Ananya Roy.";
    renderEmployeeFeedback();
  });
  renderEmployeeFeedback();
}

if (managerFeedbackForm) {
  const employeeSelect = managerFeedbackForm.elements.employee;
  document
    .querySelectorAll("#employee-directory .employee-row")
    .forEach((row) => {
      const name = row
        .querySelector(".employee-details h3")
        ?.textContent.trim();
      if (name && name !== managerFeedbackName) {
        employeeSelect.add(new Option(name, name));
      }
    });

  managerFeedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const recipient = employeeSelect.value;
    const message = managerFeedbackForm.elements.message.value.trim();
    if (!recipient || !message) {
      managerFeedbackForm.reportValidity();
      return;
    }
    saveFeedbackEntry({
      id: `feedback-${Date.now()}`,
      from: managerFeedbackName,
      to: recipient,
      date: getLocalDateValue(),
      message,
    });
    managerFeedbackForm.reset();
    managerFeedbackForm.querySelector("[data-feedback-status]").textContent =
      `Feedback sent to ${recipient}.`;
    renderManagerFeedback();
  });
  renderManagerFeedback();
}

window.addEventListener("storage", (event) => {
  if (event.key !== feedbackStorageKey) {
    return;
  }
  feedbackEntries = loadFeedbackEntries();
  renderEmployeeFeedback();
  renderManagerFeedback();
});

const taskStorageKey = "mamily-connect-tasks";
const taskView = document.querySelector(".task-view");

if (taskView) {
  const taskList = taskView.querySelector("[data-task-list]");
  const taskStats = taskView.querySelector("[data-task-stats]");
  const taskForm = document.getElementById("task-assignment-form");
  const assigneeSelect = taskForm?.elements.assignee;
  const taskEmployeeName =
    document.querySelector(".user-chip strong")?.textContent.trim() ||
    "Sarthak Sanyal";

  function localDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function makeInitialTask() {
    const assignedAt = new Date();
    const dueDate = new Date(assignedAt);
    dueDate.setDate(dueDate.getDate() + 4);
    return {
      id: `task-${Date.now()}`,
      title: "Prepare onboarding checklist",
      description:
        "Review the new-starter steps and share the updated checklist with the team.",
      assignee: "Sarthak Sanyal",
      assignedBy: "Ananya Roy",
      assignedAt: assignedAt.toISOString(),
      dueDate: localDateString(dueDate),
      progress: 35,
    };
  }

  function loadTasks() {
    try {
      const savedTasks = localStorage.getItem(taskStorageKey);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        return Array.isArray(parsedTasks) ? parsedTasks : [makeInitialTask];
      }
      const initialTasks = [makeInitialTask()];
      localStorage.setItem(taskStorageKey, JSON.stringify(initialTasks));
      return initialTasks;
    } catch {
      return [makeInitialTask()];
    }
  }

  let tasks = loadTasks();

  function saveTasks() {
    try {
      localStorage.setItem(taskStorageKey, JSON.stringify(tasks));
    } catch {
      return;
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "No deadline";
    }
    return new Date(`${dateValue}T00:00:00`).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getTaskStatus(task) {
    if (task.progress >= 100) {
      return "Completed";
    }
    return task.progress > 0 ? "In Progress" : "Not Started";
  }

  function addTaskStat(label, value) {
    const stat = document.createElement("article");
    stat.className = "task-stat";
    const statLabel = document.createElement("span");
    statLabel.textContent = label;
    const statValue = document.createElement("strong");
    statValue.textContent = value;
    stat.append(statLabel, statValue);
    taskStats.append(stat);
  }

  function createTaskCard(task, isManager) {
    const card = document.createElement("article");
    card.className = "task-card";
    card.dataset.taskId = task.id;

    const cardHeader = document.createElement("div");
    cardHeader.className = "task-card-header";
    const titleBlock = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = task.title;
    const status = document.createElement("span");
    status.className = `task-status ${getTaskStatus(task).toLowerCase().replaceAll(" ", "-")}`;
    status.textContent = getTaskStatus(task);
    titleBlock.append(title);
    if (task.description) {
      const description = document.createElement("p");
      description.className = "task-description";
      description.textContent = task.description;
      titleBlock.append(description);
    }
    cardHeader.append(titleBlock, status);

    const metadata = document.createElement("dl");
    metadata.className = "task-metadata";
    const metadataItems = isManager
      ? [
          ["Assigned to", task.assignee],
          ["Assigned by", task.assignedBy],
          ["Assigned on", new Date(task.assignedAt).toLocaleString()],
          ["Due date", formatDate(task.dueDate)],
        ]
      : [
          ["Assigned by", task.assignedBy],
          ["Assigned on", new Date(task.assignedAt).toLocaleString()],
          ["Due date", formatDate(task.dueDate)],
          [
            "Time given",
            `${Math.max(1, Math.ceil((new Date(`${task.dueDate}T00:00:00`) - new Date(task.assignedAt)) / 86400000))} days`,
          ],
        ];
    metadataItems.forEach(([label, value]) => {
      const item = document.createElement("div");
      const term = document.createElement("dt");
      term.textContent = label;
      const detail = document.createElement("dd");
      detail.textContent = value || "Not provided";
      item.append(term, detail);
      metadata.append(item);
    });

    const progressSection = document.createElement("div");
    progressSection.className = "task-progress-section";
    const progressHeader = document.createElement("div");
    progressHeader.className = "task-progress-header";
    const progressLabel = document.createElement("span");
    progressLabel.textContent = isManager ? "Completion" : "Progress";
    const progressValue = document.createElement("strong");
    progressValue.className = "task-progress-value";
    progressValue.textContent = `${task.progress}%`;
    progressHeader.append(progressLabel, progressValue);
    const progressTrack = document.createElement("div");
    progressTrack.className = "task-progress-track";
    const progressFill = document.createElement("span");
    progressFill.className = "task-progress-fill";
    progressFill.style.width = `${task.progress}%`;
    progressTrack.append(progressFill);
    progressSection.append(progressHeader, progressTrack);

    if (isManager) {
      const progressControl = document.createElement("label");
      progressControl.className = "task-progress-control";
      const controlLabel = document.createElement("span");
      controlLabel.textContent = "Update completion";
      const range = document.createElement("input");
      range.type = "range";
      range.min = "0";
      range.max = "100";
      range.step = "5";
      range.value = String(task.progress);
      range.setAttribute("aria-label", `Completion for ${task.title}`);
      progressControl.append(controlLabel, range);
      progressSection.append(progressControl);
    }

    card.append(cardHeader, metadata, progressSection);
    return card;
  }

  function renderTasks() {
    const isManager = Boolean(taskForm);
    const visibleTasks = isManager
      ? tasks
      : tasks.filter((task) => task.assignee === taskEmployeeName);
    taskList.replaceChildren();
    taskStats.replaceChildren();
    const completedCount = visibleTasks.filter(
      (task) => task.progress >= 100,
    ).length;
    addTaskStat("Assigned", String(visibleTasks.length));
    addTaskStat(
      "In progress",
      String(
        visibleTasks.filter((task) => task.progress > 0 && task.progress < 100)
          .length,
      ),
    );
    addTaskStat("Completed", String(completedCount));

    if (visibleTasks.length === 0) {
      const emptyState = document.createElement("p");
      emptyState.className = "task-empty-state";
      emptyState.textContent = "No tasks have been assigned to you yet.";
      taskList.append(emptyState);
      return;
    }

    visibleTasks
      .slice()
      .sort(
        (first, second) => new Date(first.dueDate) - new Date(second.dueDate),
      )
      .forEach((task) => taskList.append(createTaskCard(task, isManager)));
  }

  if (assigneeSelect) {
    document
      .querySelectorAll("#employee-directory .employee-row")
      .forEach((row) => {
        const name = row
          .querySelector(".employee-details h3")
          ?.textContent.trim();
        if (name) {
          assigneeSelect.append(new Option(name, name));
        }
      });
    const dueDateInput = taskForm.elements.dueDate;
    dueDateInput.min = localDateString(new Date());
    dueDateInput.value = localDateString(new Date(Date.now() + 86400000 * 7));

    taskForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(taskForm);
      tasks.push({
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: formData.get("title").trim(),
        description: formData.get("description").trim(),
        assignee: formData.get("assignee"),
        assignedBy:
          document.querySelector(".user-chip strong")?.textContent.trim() ||
          "Manager",
        assignedAt: new Date().toISOString(),
        dueDate: formData.get("dueDate"),
        progress: 0,
      });
      saveTasks();
      renderTasks();
      taskForm.reset();
      dueDateInput.value = localDateString(new Date(Date.now() + 86400000 * 7));
    });

    taskList.addEventListener("input", (event) => {
      const range = event.target.closest('input[type="range"]');
      if (!range) {
        return;
      }
      const card = range.closest("[data-task-id]");
      const task = tasks.find((item) => item.id === card?.dataset.taskId);
      if (!task) {
        return;
      }
      task.progress = Number(range.value);
      card.querySelector(".task-progress-value").textContent =
        `${task.progress}%`;
      card.querySelector(".task-progress-fill").style.width =
        `${task.progress}%`;
      const status = card.querySelector(".task-status");
      status.textContent = getTaskStatus(task);
      status.className = `task-status ${getTaskStatus(task).toLowerCase().replaceAll(" ", "-")}`;
      saveTasks();
    });

    taskList.addEventListener("change", (event) => {
      if (event.target.matches('input[type="range"]')) {
        renderTasks();
      }
    });
  }

  renderTasks();
  window.addEventListener("storage", (event) => {
    if (event.key !== taskStorageKey || !event.newValue) {
      return;
    }
    try {
      tasks = JSON.parse(event.newValue);
      renderTasks();
    } catch {
      return;
    }
  });
}

const workLogForm = document.getElementById("work-log-form");

if (workLogForm) {
  const workLogStorageKey = "mamily-connect-work-logs";
  const workLogList = document.querySelector("[data-work-log-list]");
  const workLogMessage = document.querySelector("[data-work-log-message]");
  const workDateInput = workLogForm.elements.workDate;
  const employeeName =
    document.querySelector(".user-chip strong")?.textContent.trim() ||
    "Employee";

  function getLocalDateValue(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function loadWorkLogs() {
    try {
      const savedLogs = JSON.parse(
        localStorage.getItem(workLogStorageKey) || "[]",
      );
      return Array.isArray(savedLogs) ? savedLogs : [];
    } catch {
      return [];
    }
  }

  let workLogs = loadWorkLogs();
  workDateInput.max = getLocalDateValue();
  workDateInput.value = getLocalDateValue();

  function formatWorkDate(dateValue) {
    return new Date(`${dateValue}T00:00:00`).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function renderWorkLogs() {
    const employeeLogs = workLogs
      .filter((entry) => entry.employee === employeeName)
      .sort((first, second) => second.workDate.localeCompare(first.workDate));
    workLogList.replaceChildren();

    if (employeeLogs.length === 0) {
      const emptyState = document.createElement("p");
      emptyState.className = "work-log-empty-state";
      emptyState.textContent = "No work log entries yet.";
      workLogList.append(emptyState);
      return;
    }

    employeeLogs.forEach((entry) => {
      const card = document.createElement("article");
      card.className = "work-log-entry";
      const header = document.createElement("div");
      header.className = "work-log-entry-header";
      const activity = document.createElement("h3");
      activity.textContent = entry.activity;
      const date = document.createElement("time");
      date.dateTime = entry.workDate;
      date.textContent = formatWorkDate(entry.workDate);
      header.append(activity, date);

      const metadata = document.createElement("p");
      metadata.className = "work-log-entry-meta";
      metadata.textContent = [entry.project, `${entry.hours} hours`]
        .filter(Boolean)
        .join(" · ");
      const details = document.createElement("p");
      details.className = "work-log-entry-details";
      details.textContent = entry.details;
      card.append(header, metadata, details);

      if (entry.blockers) {
        const blockers = document.createElement("p");
        blockers.className = "work-log-entry-blockers";
        blockers.textContent = `Blockers / follow-up: ${entry.blockers}`;
        card.append(blockers);
      }
      workLogList.append(card);
    });
  }

  workLogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!workLogForm.reportValidity()) {
      return;
    }

    const formData = new FormData(workLogForm);
    const entry = {
      id: `work-log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      employee: employeeName,
      workDate: formData.get("workDate"),
      project: formData.get("project").trim(),
      activity: formData.get("activity").trim(),
      hours: Number(formData.get("hours")),
      details: formData.get("details").trim(),
      blockers: formData.get("blockers").trim(),
      submittedAt: new Date().toISOString(),
    };

    workLogs.push(entry);
    try {
      localStorage.setItem(workLogStorageKey, JSON.stringify(workLogs));
    } catch {
      workLogs.pop();
      workLogMessage.textContent =
        "Unable to save this entry in browser storage.";
      workLogMessage.classList.add("error");
      return;
    }

    workLogForm.reset();
    workDateInput.value = getLocalDateValue();
    workLogMessage.textContent = "Work log submitted.";
    workLogMessage.classList.remove("error");
    renderWorkLogs();
  });

  renderWorkLogs();
  window.addEventListener("storage", (event) => {
    if (event.key !== workLogStorageKey) {
      return;
    }
    workLogs = loadWorkLogs();
    renderWorkLogs();
  });
}

const managerWorkLogList = document.querySelector(
  "[data-manager-work-log-list]",
);

if (managerWorkLogList) {
  const workLogStorageKey = "mamily-connect-work-logs";
  const searchInput = document.querySelector("[data-work-log-search]");
  const employeeFilter = document.querySelector("[data-work-log-employee]");
  const periodFilter = document.querySelector("[data-work-log-period]");
  const clearFiltersButton = document.querySelector("[data-work-log-clear]");
  const resultCount = document.querySelector("[data-work-log-result-count]");
  const entryCount = document.querySelector("[data-work-log-entry-count]");
  const contributorCount = document.querySelector(
    "[data-work-log-contributor-count]",
  );
  const hoursTotal = document.querySelector("[data-work-log-hours]");
  const followUpCount = document.querySelector(
    "[data-work-log-follow-up-count]",
  );

  function loadManagerWorkLogs() {
    try {
      const savedLogs = JSON.parse(
        localStorage.getItem(workLogStorageKey) || "[]",
      );
      return Array.isArray(savedLogs)
        ? savedLogs.filter((entry) => entry && typeof entry === "object")
        : [];
    } catch {
      return [];
    }
  }

  function formatManagerWorkDate(dateValue) {
    const date = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  let managerWorkLogs = loadManagerWorkLogs();

  function updateEmployeeFilter() {
    const selectedEmployee = employeeFilter.value;
    const employees = [
      ...new Set(
        managerWorkLogs
          .map((entry) => entry.employee)
          .filter(
            (employee) => typeof employee === "string" && employee.trim(),
          ),
      ),
    ].sort((first, second) => first.localeCompare(second));

    employeeFilter.replaceChildren(new Option("All employees", ""));
    employees.forEach((employee) => {
      employeeFilter.add(new Option(employee, employee));
    });
    employeeFilter.value = employees.includes(selectedEmployee)
      ? selectedEmployee
      : "";
  }

  function renderManagerWorkLogs() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedEmployee = employeeFilter.value;
    const periodDays = Number(periodFilter.value);
    const cutoffDate = new Date();
    cutoffDate.setHours(0, 0, 0, 0);
    if (periodDays) {
      cutoffDate.setDate(cutoffDate.getDate() - periodDays + 1);
    }

    const visibleLogs = managerWorkLogs
      .filter((entry) => {
        if (selectedEmployee && entry.employee !== selectedEmployee) {
          return false;
        }

        if (periodDays) {
          const workDate = new Date(`${entry.workDate}T00:00:00`);
          if (Number.isNaN(workDate.getTime()) || workDate < cutoffDate) {
            return false;
          }
        }

        const searchableText = [
          entry.employee,
          entry.project,
          entry.activity,
          entry.details,
          entry.blockers,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return !searchTerm || searchableText.includes(searchTerm);
      })
      .sort((first, second) => {
        const dateOrder = (second.workDate || "").localeCompare(
          first.workDate || "",
        );
        return (
          dateOrder ||
          (second.submittedAt || "").localeCompare(first.submittedAt || "")
        );
      });

    const contributors = new Set(
      visibleLogs.map((entry) => entry.employee).filter(Boolean),
    );
    const totalHours = visibleLogs.reduce((total, entry) => {
      const hours = Number(entry.hours);
      return total + (Number.isFinite(hours) ? hours : 0);
    }, 0);
    const entriesWithFollowUp = visibleLogs.filter(
      (entry) => typeof entry.blockers === "string" && entry.blockers.trim(),
    ).length;

    entryCount.textContent = String(visibleLogs.length);
    contributorCount.textContent = String(contributors.size);
    hoursTotal.textContent = totalHours.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
    followUpCount.textContent = String(entriesWithFollowUp);
    resultCount.textContent = `${visibleLogs.length} ${visibleLogs.length === 1 ? "entry" : "entries"}`;
    managerWorkLogList.replaceChildren();

    if (visibleLogs.length === 0) {
      const emptyState = document.createElement("p");
      emptyState.className = "work-log-empty-state";
      emptyState.textContent = managerWorkLogs.length
        ? "No entries match these filters."
        : "No team work logs have been submitted yet.";
      managerWorkLogList.append(emptyState);
      return;
    }

    visibleLogs.forEach((entry) => {
      const card = document.createElement("article");
      card.className = "work-log-entry manager-work-log-entry";

      const header = document.createElement("div");
      header.className = "work-log-entry-header";
      const activity = document.createElement("h3");
      activity.textContent = entry.activity || "Work entry";
      const date = document.createElement("time");
      date.dateTime = entry.workDate || "";
      date.textContent = formatManagerWorkDate(entry.workDate);
      header.append(activity, date);

      const employee = document.createElement("p");
      employee.className = "manager-work-log-employee";
      employee.textContent = entry.employee || "Employee unavailable";

      const metadata = document.createElement("p");
      metadata.className = "work-log-entry-meta";
      metadata.textContent = [
        entry.project || "No project specified",
        `${Number(entry.hours) || 0} hours`,
      ].join(" · ");

      const details = document.createElement("p");
      details.className = "work-log-entry-details";
      details.textContent = entry.details || "No details provided.";
      card.append(header, employee, metadata, details);

      if (entry.blockers && entry.blockers.trim()) {
        const blockers = document.createElement("p");
        blockers.className = "work-log-entry-blockers";
        blockers.textContent = `Blockers / follow-up: ${entry.blockers}`;
        card.append(blockers);
      }
      managerWorkLogList.append(card);
    });
  }

  [searchInput, employeeFilter, periodFilter].forEach((control) => {
    control.addEventListener("input", renderManagerWorkLogs);
    control.addEventListener("change", renderManagerWorkLogs);
  });
  clearFiltersButton.addEventListener("click", () => {
    searchInput.value = "";
    employeeFilter.value = "";
    periodFilter.value = "all";
    renderManagerWorkLogs();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== workLogStorageKey) {
      return;
    }
    managerWorkLogs = loadManagerWorkLogs();
    updateEmployeeFilter();
    renderManagerWorkLogs();
  });

  updateEmployeeFilter();
  renderManagerWorkLogs();
}

const meetingsView = document.getElementById("meetings");
const scheduleMeetingForm = document.getElementById("schedule-meeting-form");
const showScheduleMeetingButton = document.getElementById(
  "show-schedule-meeting",
);
const meetingEmployeeOptions = document.getElementById(
  "meeting-employee-options",
);
const meetingList = document.getElementById("meeting-list");
const meetingCount = document.getElementById("meeting-count");
const meetingStorageKey = "mamily-connect-meetings-v1";

if (
  meetingsView &&
  scheduleMeetingForm &&
  showScheduleMeetingButton &&
  meetingEmployeeOptions &&
  meetingList
) {
  function dateAfterDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  }

  const defaultMeetings = [
    {
      id: "meeting-seed-1",
      title: "People Operations Sync",
      date: dateAfterDays(1),
      time: "10:30",
      location: "Conference Room 2",
      attendees: ["Ananya Roy", "Neha Kapoor"],
    },
    {
      id: "meeting-seed-2",
      title: "Customer Success Planning",
      date: dateAfterDays(2),
      time: "14:00",
      location: "Video call",
      attendees: ["Sarthak Sanyal", "Mandeep Kaur", "Jaya Patel"],
    },
  ];

  function loadMeetings() {
    try {
      const savedMeetings = window.localStorage.getItem(meetingStorageKey);
      if (savedMeetings) {
        const parsedMeetings = JSON.parse(savedMeetings);
        if (Array.isArray(parsedMeetings)) {
          return parsedMeetings;
        }
      }
    } catch {
      return defaultMeetings;
    }
    return defaultMeetings;
  }

  let meetings = loadMeetings();

  function saveMeetings() {
    try {
      window.localStorage.setItem(meetingStorageKey, JSON.stringify(meetings));
    } catch {
      return;
    }
  }

  function refreshMeetingEmployeeList() {
    const selectedEmployees = new Set(
      [
        ...meetingEmployeeOptions.querySelectorAll(
          'input[name="attendees"]:checked',
        ),
      ].map((checkbox) => checkbox.value),
    );
    const employeeRows = document.querySelectorAll(
      "#employee-directory .employee-row",
    );
    meetingEmployeeOptions.replaceChildren();

    employeeRows.forEach((row, index) => {
      const name = row
        .querySelector(".employee-details h3")
        ?.textContent.trim();
      const role = row.querySelector(".employee-details p")?.textContent.trim();
      if (!name) {
        return;
      }

      const label = document.createElement("label");
      label.className = "meeting-employee-option";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "attendees";
      checkbox.value = name;
      checkbox.id = `meeting-attendee-${index}`;
      checkbox.checked = selectedEmployees.has(name);
      const details = document.createElement("span");
      const employeeName = document.createElement("strong");
      employeeName.textContent = name;
      const employeeRole = document.createElement("small");
      employeeRole.textContent = role || "Employee";
      details.append(employeeName, employeeRole);
      label.append(checkbox, details);
      meetingEmployeeOptions.append(label);
    });
  }

  function renderMeetings() {
    const orderedMeetings = [...meetings].sort((first, second) =>
      `${first.date}T${first.time}`.localeCompare(
        `${second.date}T${second.time}`,
      ),
    );
    meetingList.replaceChildren();
    meetingCount.textContent = `${meetings.length} meeting${meetings.length === 1 ? "" : "s"}`;

    if (orderedMeetings.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "meeting-empty-state";
      emptyMessage.textContent = "No meetings scheduled yet.";
      meetingList.append(emptyMessage);
      return;
    }

    orderedMeetings.forEach((meeting) => {
      const item = document.createElement("article");
      item.className = "meeting-item";
      const date = new Date(`${meeting.date}T${meeting.time || "00:00"}`);
      const dateTime = document.createElement("p");
      dateTime.className = "meeting-date-time";
      dateTime.textContent = `${date.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })} at ${date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`;
      const title = document.createElement("h2");
      title.textContent = meeting.title;
      const details = document.createElement("p");
      details.className = "meeting-location";
      details.textContent = meeting.location || "Location not specified";
      const attendees = document.createElement("p");
      attendees.className = "meeting-attendees-list";
      attendees.textContent = `Employees: ${meeting.attendees.join(", ")}`;
      item.append(dateTime, title, details, attendees);
      meetingList.append(item);
    });
  }

  function setMeetingFormVisibility(isVisible) {
    scheduleMeetingForm.hidden = !isVisible;
    showScheduleMeetingButton.hidden = isVisible;
    if (isVisible) {
      refreshMeetingEmployeeList();
      scheduleMeetingForm.elements.title.focus();
    } else {
      scheduleMeetingForm.reset();
      meetingEmployeeOptions
        .querySelectorAll('input[name="attendees"]')
        .forEach((checkbox) => checkbox.setCustomValidity(""));
      showScheduleMeetingButton.focus();
    }
  }

  showScheduleMeetingButton.addEventListener("click", () => {
    setMeetingFormVisibility(true);
  });
  document
    .getElementById("cancel-schedule-meeting")
    .addEventListener("click", () => setMeetingFormVisibility(false));
  document
    .getElementById("dismiss-schedule-meeting")
    .addEventListener("click", () => setMeetingFormVisibility(false));

  meetingEmployeeOptions.addEventListener("change", () => {
    meetingEmployeeOptions
      .querySelectorAll('input[name="attendees"]')
      .forEach((checkbox) => checkbox.setCustomValidity(""));
  });

  scheduleMeetingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const attendees = [
      ...meetingEmployeeOptions.querySelectorAll(
        'input[name="attendees"]:checked',
      ),
    ].map((checkbox) => checkbox.value);
    if (attendees.length === 0) {
      const firstCheckbox = meetingEmployeeOptions.querySelector(
        'input[name="attendees"]',
      );
      if (firstCheckbox) {
        firstCheckbox.setCustomValidity("Select at least one employee.");
        firstCheckbox.reportValidity();
      }
      return;
    }

    meetings.push({
      id: `meeting-${Date.now()}`,
      title: scheduleMeetingForm.elements.title.value.trim(),
      date: scheduleMeetingForm.elements.date.value,
      time: scheduleMeetingForm.elements.time.value,
      location: scheduleMeetingForm.elements.location.value.trim(),
      attendees,
    });
    saveMeetings();
    renderMeetings();
    setMeetingFormVisibility(false);
  });

  window.refreshMeetingEmployeeList = refreshMeetingEmployeeList;
  renderMeetings();
}

const notificationStorageKey = "mamily-connect-notifications-v1";
const notificationRole = document
  .querySelector("[data-notification-role]")
  ?.getAttribute("data-notification-role");
const notificationList = document.querySelector("[data-notification-received]");
const notificationCount = document.querySelector("[data-notification-count]");
const notificationForm = document.querySelector("[data-notification-form]");
const notificationStatus = document.querySelector("[data-notification-status]");
const readNotificationKey = `mamily-connect-read-notifications-${notificationRole}`;
const notificationSeed = [
  {
    id: "welcome-update",
    title: "Welcome to Mamily Connect",
    message: "Your team updates and important announcements will appear here.",
    category: "General",
    sender: "Ananya Roy",
    createdAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "wellbeing-session",
    title: "Employee wellbeing session",
    message:
      "Join the optional wellbeing session this Friday at 3:00 PM in Meeting Room 2.",
    category: "Event",
    sender: "Ananya Roy",
    createdAt: "2026-10-03T08:30:00.000Z",
  },
];

function loadNotifications() {
  try {
    const savedNotifications = window.localStorage.getItem(
      notificationStorageKey,
    );
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      if (Array.isArray(parsedNotifications)) {
        return parsedNotifications;
      }
    }
    window.localStorage.setItem(
      notificationStorageKey,
      JSON.stringify(notificationSeed),
    );
  } catch {
    return [...notificationSeed];
  }
  return [...notificationSeed];
}

function loadReadNotifications() {
  try {
    const savedReadNotifications = JSON.parse(
      window.localStorage.getItem(readNotificationKey) || "[]",
    );
    return Array.isArray(savedReadNotifications) ? savedReadNotifications : [];
  } catch {
    return [];
  }
}

let notifications = notificationList ? loadNotifications() : [];
let readNotifications = notificationList ? loadReadNotifications() : [];

function saveNotifications() {
  try {
    window.localStorage.setItem(
      notificationStorageKey,
      JSON.stringify(notifications),
    );
  } catch {
    return;
  }
}

function saveReadNotifications() {
  try {
    window.localStorage.setItem(
      readNotificationKey,
      JSON.stringify(readNotifications),
    );
  } catch {
    return;
  }
}

function renderNotifications() {
  if (!notificationList) {
    return;
  }

  notificationList.replaceChildren();
  const sortedNotifications = [...notifications].sort(
    (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
  );
  const unreadCount = sortedNotifications.filter(
    (notification) => !readNotifications.includes(notification.id),
  ).length;

  if (notificationCount) {
    notificationCount.textContent =
      notificationRole === "employee"
        ? `${unreadCount} unread`
        : `${sortedNotifications.length} total`;
  }

  if (sortedNotifications.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "notification-empty";
    emptyState.textContent = "No notifications yet.";
    notificationList.append(emptyState);
    return;
  }

  sortedNotifications.forEach((notification) => {
    const isRead = readNotifications.includes(notification.id);
    const item = document.createElement("article");
    item.className = `notification-item${isRead ? "" : " unread"}`;
    const heading = document.createElement("h3");
    heading.textContent = notification.title;
    const meta = document.createElement("div");
    meta.className = "notification-meta";
    const category = document.createElement("span");
    category.className = `notification-category${notification.category === "Urgent" ? " urgent" : ""}`;
    category.textContent = notification.category;
    const timestamp = document.createElement("time");
    timestamp.dateTime = notification.createdAt;
    timestamp.textContent = new Date(notification.createdAt).toLocaleString(
      [],
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    );
    const sender = document.createElement("span");
    sender.textContent = `From ${notification.sender}`;
    meta.append(category, timestamp, sender);

    const action = document.createElement("button");
    action.type = "button";
    action.className = "notification-read-button";
    action.dataset.notificationId = notification.id;
    action.textContent = isRead ? "Read" : "Mark read";
    action.disabled = isRead;

    const message = document.createElement("p");
    message.textContent = notification.message;
    item.append(heading, action, meta, message);
    notificationList.append(item);
  });
}

if (notificationList) {
  notificationList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-notification-id]");
    if (!button || readNotifications.includes(button.dataset.notificationId)) {
      return;
    }
    readNotifications = [...readNotifications, button.dataset.notificationId];
    saveReadNotifications();
    renderNotifications();
  });

  if (notificationForm) {
    notificationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(notificationForm);
      notifications = [
        {
          id: `notification-${Date.now()}`,
          title: formData.get("title").trim(),
          message: formData.get("message").trim(),
          category: formData.get("category"),
          sender: "Ananya Roy",
          createdAt: new Date().toISOString(),
        },
        ...notifications,
      ];
      saveNotifications();
      notificationForm.reset();
      notificationStatus.textContent = "Announcement Sent to the Team.";
      renderNotifications();
    });
  }

  window.addEventListener("storage", (event) => {
    if (event.key === notificationStorageKey) {
      notifications = loadNotifications();
      renderNotifications();
    }
    if (event.key === readNotificationKey) {
      readNotifications = loadReadNotifications();
      renderNotifications();
    }
  });

  renderNotifications();
}
