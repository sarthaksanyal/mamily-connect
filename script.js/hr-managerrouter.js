const initialEmployees = [
  {
    employeeId: "",
    name: "Sarthak Sanyal",
    fatherName: "",
    correspondenceAddress: "",
    permanentAddress: "",
    role: "Software Intern",
    team: "Software Support",
    email: "sarthak.sanyal@mamily.com",
    contact: "",
    location: "",
    aadhar: "",
    pan: "",
    bank: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    joiningDate: "",
    shiftStart: "",
    shiftEnd: "",
    education: [],
    experience: [],
    avatarClass: "member-avatar",
  },
  {
    employeeId: "",
    name: "Ananya Roy",
    fatherName: "",
    correspondenceAddress: "",
    permanentAddress: "",
    role: "HR Manager",
    team: "Software Support",
    email: "ananya.roy@mamily.com",
    contact: "",
    location: "",
    aadhar: "",
    pan: "",
    bank: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    joiningDate: "",
    shiftStart: "",
    shiftEnd: "",
    education: [],
    experience: [],
    avatarClass: "member-avatar avatar-pink",
  },
  {
    employeeId: "",
    name: "Mandeep Kaur",
    fatherName: "",
    correspondenceAddress: "",
    permanentAddress: "",
    role: "Customer Support Specialist",
    team: "Customer Success",
    email: "mandeep.kaur@mamily.com",
    contact: "",
    location: "",
    aadhar: "",
    pan: "",
    bank: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    joiningDate: "",
    shiftStart: "",
    shiftEnd: "",
    education: [],
    experience: [],
    avatarClass: "member-avatar avatar-green",
  },
  {
    employeeId: "",
    name: "Jaya Patel",
    fatherName: "",
    correspondenceAddress: "",
    permanentAddress: "",
    role: "Customer Support Specialist",
    team: "Customer Success",
    email: "jaya.patel@mamily.com",
    contact: "",
    location: "",
    aadhar: "",
    pan: "",
    bank: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    joiningDate: "",
    shiftStart: "",
    shiftEnd: "",
    education: [],
    experience: [],
    avatarClass: "member-avatar avatar-gold",
  },
  {
    employeeId: "",
    name: "Neha Kapoor",
    fatherName: "",
    correspondenceAddress: "",
    permanentAddress: "",
    role: "People Operations Associate",
    team: "People Operations",
    email: "neha.kapoor@mamily.com",
    contact: "",
    location: "",
    aadhar: "",
    pan: "",
    bank: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    joiningDate: "",
    shiftStart: "",
    shiftEnd: "",
    education: [],
    experience: [],
    avatarClass: "member-avatar avatar-purple",
  },
  {
    employeeId: "",
    name: "Daksh Ojha",
    fatherName: "",
    correspondenceAddress: "",
    permanentAddress: "",
    role: "Finance Analyst",
    team: "Finance",
    email: "daksh.ojha@mamily.com",
    contact: "",
    location: "",
    aadhar: "",
    pan: "",
    bank: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    joiningDate: "",
    shiftStart: "",
    shiftEnd: "",
    education: [],
    experience: [],
    avatarClass: "member-avatar avatar-teal",
  },
];

const navigationItems = document.querySelectorAll(".nav-item[data-view]");
const dashboardViews = document.querySelectorAll(
  ".dashboard-view, .dashboard-fragment-view, .team-members-view, .profile-view, .employees-view, .attendance-view, .performance-view, .feedback-view, .meetings-view, .task-view, .work-log-view, .notification-view",
);
const dashboardHeading = document.querySelector(".topbar-dashboard h1");

function showDashboardView(viewId, title) {
  const selectedView = document.getElementById(viewId);
  if (!selectedView) {
    return;
  }

  navigationItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewId);
  });
  dashboardViews.forEach((view) => {
    view.hidden = view !== selectedView;
  });
  dashboardHeading.textContent = title || "Dashboard";
}

navigationItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    showDashboardView(item.dataset.view, item.dataset.title);
    if (
      (item.dataset.view === "work-log" || item.dataset.view === "worklog") &&
      window.matchMedia("(max-width: 980px)").matches
    ) {
      document.getElementById(item.dataset.view).scrollIntoView({
        block: "start",
      });
    }
  });
});

document.querySelectorAll(".notification-bell").forEach((button) => {
  button.addEventListener("click", () => {
    showDashboardView(button.dataset.dashboardView, button.dataset.title);
  });
});

document.querySelectorAll(".stat-card[data-dashboard-view]").forEach((card) => {
  card.addEventListener("click", () => {
    const navigationItem = [...navigationItems].find(
      (item) => item.dataset.view === card.dataset.dashboardView,
    );
    if (navigationItem) {
      navigationItem.click();
    } else {
      const fallbackTitle =
        card.dataset.title ||
        (card.dataset.dashboardView === "notifications"
          ? "Notifications"
          : "Dashboard");
      showDashboardView(card.dataset.dashboardView, fallbackTitle);
    }

    if (card.dataset.scrollTarget) {
      document.getElementById(card.dataset.scrollTarget)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
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
const employeeDocumentsDialog = document.getElementById(
  "employee-documents-dialog",
);
const employeeDocumentsForm = document.getElementById("employee-document-form");
const employeeDocumentsList = document.querySelector(
  "[data-employee-document-list]",
);
const employeeDocumentsStatus = document.querySelector(
  "[data-employee-document-status]",
);
const employeeDocumentIdentifiers = document.querySelector(
  "[data-employee-document-identifiers]",
);
const profileView = document.getElementById("profile-view");
const profileDetails = document.getElementById("profile-details");
const profileEditForm = document.getElementById("profile-edit-form");
let editingEmployeeRow = null;
let employeeDocumentsDatabasePromise;
let activeDocumentsEmployeeEmail = "";
let employeeDocumentUrls = [];

function renderInitialEmployees() {
  if (!employeeDirectory) {
    return;
  }

  const seenEmails = new Set();
  initialEmployees.forEach((employee) => {
    const email = normalizeEmployeeEmail(employee.email);
    if (!email || seenEmails.has(email)) {
      console.error(
        `Skipping ${employee.name}: employee email is missing or duplicated.`,
      );
      return;
    }
    seenEmails.add(email);

    const employeeRow = document.createElement("article");
    employeeRow.className = "employee-row";

    const avatar = document.createElement("span");
    avatar.className = employee.avatarClass;
    avatar.textContent = employee.name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const employeeDetails = document.createElement("div");
    employeeDetails.className = "employee-details";
    const employeeName = document.createElement("h3");
    employeeName.textContent = employee.name;
    const employeeRole = document.createElement("p");
    employeeRole.textContent = employee.role;
    employeeDetails.append(employeeName, employeeRole);

    const employeeTeam = document.createElement("span");
    employeeTeam.className = "employee-team";
    employeeTeam.textContent = employee.team;

    employeeRow.append(avatar, employeeDetails, employeeTeam);
    Object.entries(employee).forEach(([key, value]) => {
      if (key !== "avatarClass") {
        employeeRow.dataset[key] =
          key === "email"
            ? email
            : Array.isArray(value)
              ? JSON.stringify(value)
              : value;
      }
    });
    employeeDirectory.append(employeeRow);
  });
}

if (addEmployeeForm && showAddEmployeeButton && employeeDirectory) {
  function isEmployeeEmailInUse(email, excludedRow = null) {
    const normalizedEmail = normalizeEmployeeEmail(email);
    return [...employeeDirectory.querySelectorAll(".employee-row")].some(
      (row) =>
        row !== excludedRow &&
        normalizeEmployeeEmail(row.dataset.email) === normalizedEmail,
    );
  }

  const profileFields = [
    ["Employee ID", "employeeId"],
    ["Name", "name"],
    ["Father's Name", "fatherName"],
    ["Correspondence Address", "correspondenceAddress"],
    ["Permanent Address", "permanentAddress"],
    ["Job Title", "role"],
    ["Team", "team"],
    ["Email", "email"],
    ["Contact Number", "contact"],
    ["Job Location", "location"],
    ["Aadhar Card Number", "aadhar"],
    ["PAN Card Number", "pan"],
    ["Bank Details", "bank"],
    ["Emergency Contact Name", "emergencyContactName"],
    ["Emergency Contact Number", "emergencyContactNumber"],
    ["Joining Date", "joiningDate"],
    ["Shift Start Time", "shiftStart"],
    ["Shift End Time", "shiftEnd"],
    ["Educational Details", "education"],
    ["Employment Experience", "experience"],
  ];
  const editableProfileEntries = {
    education: {
      containerId: "profile-education-entries",
      caption: "Educational Details",
      fields: [
        "Degree",
        "University or institute",
        "Year of passing",
        "Percentage or CGPA",
        "Specialization",
      ],
    },
    experience: {
      containerId: "profile-experience-entries",
      caption: "Employment Experience",
      fields: [
        "Company name",
        "Position",
        "Duration",
        "Job role",
        "Key responsibilities",
      ],
    },
  };

  const employeeDocumentsDatabaseName = "mamily-connect-employee-documents";
  const employeeDocumentsStoreName = "documents";

  function getEmployeeDocumentsDatabase() {
    if (!window.indexedDB) {
      return Promise.reject(new Error("Document storage is unavailable."));
    }
    if (!employeeDocumentsDatabasePromise) {
      employeeDocumentsDatabasePromise = new Promise((resolve, reject) => {
        const request = window.indexedDB.open(employeeDocumentsDatabaseName, 1);
        request.onupgradeneeded = () => {
          if (
            !request.result.objectStoreNames.contains(
              employeeDocumentsStoreName,
            )
          ) {
            request.result.createObjectStore(employeeDocumentsStoreName, {
              keyPath: "id",
            });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }).catch((error) => {
        employeeDocumentsDatabasePromise = null;
        throw error;
      });
    }
    return employeeDocumentsDatabasePromise;
  }

  function loadEmployeeDocuments(email) {
    return getEmployeeDocumentsDatabase().then(
      (database) =>
        new Promise((resolve, reject) => {
          const request = database
            .transaction(employeeDocumentsStoreName, "readonly")
            .objectStore(employeeDocumentsStoreName)
            .getAll();
          request.onsuccess = () =>
            resolve(
              request.result.filter(
                (document) => document.employeeEmail === email,
              ),
            );
          request.onerror = () => reject(request.error);
        }),
    );
  }

  function saveEmployeeDocument(document) {
    return getEmployeeDocumentsDatabase().then(
      (database) =>
        new Promise((resolve, reject) => {
          const transaction = database.transaction(
            employeeDocumentsStoreName,
            "readwrite",
          );
          transaction.objectStore(employeeDocumentsStoreName).put(document);
          transaction.oncomplete = resolve;
          transaction.onerror = () => reject(transaction.error);
          transaction.onabort = () => reject(transaction.error);
        }),
    );
  }

  function releaseEmployeeDocumentUrls() {
    employeeDocumentUrls.forEach((url) => URL.revokeObjectURL(url));
    employeeDocumentUrls = [];
  }

  async function renderEmployeeDocuments() {
    releaseEmployeeDocumentUrls();
    employeeDocumentsList.replaceChildren();
    employeeDocumentsStatus.textContent = "Loading documents...";

    try {
      const documents = await loadEmployeeDocuments(
        activeDocumentsEmployeeEmail,
      );
      if (!activeDocumentsEmployeeEmail) {
        return;
      }
      documents.sort(
        (first, second) =>
          new Date(second.uploadedAt) - new Date(first.uploadedAt),
      );
      employeeDocumentsStatus.textContent = `${documents.length} document${documents.length === 1 ? "" : "s"}`;

      if (documents.length === 0) {
        const emptyState = document.createElement("p");
        emptyState.className = "employee-document-empty";
        emptyState.textContent = "No uploaded documents for this employee yet.";
        employeeDocumentsList.append(emptyState);
        return;
      }

      documents.forEach((employeeDocument) => {
        const item = document.createElement("article");
        item.className = "employee-document-item";
        const details = document.createElement("div");
        const name = document.createElement("h3");
        name.textContent = employeeDocument.name;
        const metadata = document.createElement("p");
        metadata.textContent = `${employeeDocument.category} · ${new Date(employeeDocument.uploadedAt).toLocaleDateString()}`;
        details.append(name, metadata);

        const link = document.createElement("a");
        link.className = "employee-document-link";
        link.href = URL.createObjectURL(employeeDocument.file);
        employeeDocumentUrls.push(link.href);
        link.target = "_blank";
        link.rel = "noopener";
        link.download = employeeDocument.name;
        link.textContent = "Open / download";
        item.append(details, link);
        employeeDocumentsList.append(item);
      });
    } catch {
      employeeDocumentsStatus.textContent =
        "Unable to load employee documents in this browser.";
    }
  }

  function showEmployeeDocuments(employeeRow) {
    const employeeData = getEmployeeData(employeeRow);
    activeDocumentsEmployeeEmail = employeeData.email.toLowerCase();
    document.getElementById("employee-documents-title").textContent =
      employeeData.name;
    employeeDocumentIdentifiers.replaceChildren();
    [
      ["Aadhar Card", employeeData.aadhar],
      ["PAN Card", employeeData.pan],
    ].forEach(([label, value]) => {
      const item = document.createElement("div");
      item.className = "employee-document-identifier";
      const name = document.createElement("span");
      name.textContent = label;
      const detail = document.createElement("strong");
      detail.textContent = value || "Not provided";
      item.append(name, detail);
      employeeDocumentIdentifiers.append(item);
    });
    employeeDocumentsStatus.textContent = "Loading documents...";
    employeeDocumentsDialog.showModal();
    renderEmployeeDocuments();
  }

  employeeDocumentsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fileInput = employeeDocumentsForm.elements.file;
    const files = [...fileInput.files];
    if (!activeDocumentsEmployeeEmail || files.length === 0) {
      return;
    }

    const category = employeeDocumentsForm.elements.category.value;
    employeeDocumentsStatus.textContent = "Uploading documents...";
    try {
      await Promise.all(
        files.map((file) =>
          saveEmployeeDocument({
            id: `employee-document-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            employeeEmail: activeDocumentsEmployeeEmail,
            category,
            name: file.name,
            file,
            uploadedAt: new Date().toISOString(),
          }),
        ),
      );
      employeeDocumentsForm.reset();
      await renderEmployeeDocuments();
    } catch {
      employeeDocumentsStatus.textContent =
        "Unable to save documents in this browser.";
    }
  });

  document
    .getElementById("close-employee-documents")
    .addEventListener("click", () => employeeDocumentsDialog.close());
  employeeDocumentsDialog.addEventListener("close", () => {
    activeDocumentsEmployeeEmail = "";
    releaseEmployeeDocumentUrls();
  });

  function parseEmployeeRows(value) {
    try {
      const rows = JSON.parse(value || "[]");
      return Array.isArray(rows) ? rows : [];
    } catch {
      return [];
    }
  }

  function getEntryRows(prefix) {
    const firstInput = addEmployeeForm.querySelector(
      `input[name^="${prefix}-"]`,
    );
    if (!firstInput) {
      return [];
    }

    return [...firstInput.closest("table").querySelectorAll("tbody tr")]
      .map((row) =>
        Object.fromEntries(
          [...row.querySelectorAll("input")].map((input) => [
            input.getAttribute("aria-label"),
            input.value.trim(),
          ]),
        ),
      )
      .filter((row) => Object.values(row).some(Boolean));
  }

  function getEmployeeData(employeeRow) {
    return {
      employeeId: employeeRow.dataset.employeeId || "",
      name: employeeRow.querySelector(".employee-details h3").textContent,
      fatherName: employeeRow.dataset.fatherName || "",
      correspondenceAddress: employeeRow.dataset.correspondenceAddress || "",
      permanentAddress: employeeRow.dataset.permanentAddress || "",
      role: employeeRow.querySelector(".employee-details p").textContent,
      team: employeeRow.querySelector(".employee-team").textContent,
      email: employeeRow.dataset.email || "",
      contact: employeeRow.dataset.contact || "",
      location: employeeRow.dataset.location || "",
      aadhar: employeeRow.dataset.aadhar || "",
      pan: employeeRow.dataset.pan || "",
      bank: employeeRow.dataset.bank || "",
      emergencyContactName: employeeRow.dataset.emergencyContactName || "",
      emergencyContactNumber: employeeRow.dataset.emergencyContactNumber || "",
      joiningDate: employeeRow.dataset.joiningDate || "",
      shiftStart: employeeRow.dataset.shiftStart || "",
      shiftEnd: employeeRow.dataset.shiftEnd || "",
      education: parseEmployeeRows(employeeRow.dataset.education),
      experience: parseEmployeeRows(employeeRow.dataset.experience),
    };
  }

  function renderEditableProfileEntries(key, entries) {
    const { containerId, caption, fields } = editableProfileEntries[key];
    const container = document.getElementById(containerId);
    container.className = "profile-edit-entry-field";
    container.replaceChildren();

    const table = document.createElement("table");
    table.className = "employee-entry-table profile-edit-entry-table";
    const tableCaption = document.createElement("caption");
    tableCaption.textContent = caption;
    const head = document.createElement("thead");
    const headingRow = document.createElement("tr");
    fields.forEach((field) => {
      const heading = document.createElement("th");
      heading.scope = "col";
      heading.textContent = field;
      headingRow.append(heading);
    });
    head.append(headingRow);

    const body = document.createElement("tbody");
    const rowCount = Math.max(3, entries.length);
    for (let index = 0; index < rowCount; index += 1) {
      const row = document.createElement("tr");
      fields.forEach((field) => {
        const cell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.setAttribute("aria-label", field);
        input.value = entries[index]?.[field] || "";
        cell.append(input);
        row.append(cell);
      });
      body.append(row);
    }

    table.append(tableCaption, head, body);
    container.append(table);
  }

  function getEditableProfileEntries(key) {
    const { containerId } = editableProfileEntries[key];
    return [...document.querySelectorAll(`#${containerId} tbody tr`)]
      .map((row) =>
        Object.fromEntries(
          [...row.querySelectorAll("input")].map((input) => [
            input.getAttribute("aria-label"),
            input.value.trim(),
          ]),
        ),
      )
      .filter((row) => Object.values(row).some(Boolean));
  }

  function addEmployeeActions(employeeRow) {
    if (employeeRow.querySelector(".employee-actions")) {
      return;
    }

    const actions = document.createElement("div");
    actions.className = "employee-actions";
    [
      ["documents", "Documents"],
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
      const value = employeeData[key];
      description.textContent = Array.isArray(value)
        ? value.length
          ? value
              .map(
                (row, index) =>
                  `${index + 1}. ${Object.entries(row)
                    .map(
                      ([field, entry]) =>
                        `${field}: ${entry || "Not provided"}`,
                    )
                    .join(" | ")}`,
              )
              .join("\n")
          : "Not provided"
        : value || "Not provided";
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
    document.getElementById("profile-employee-id").value =
      employeeData.employeeId;
    document.getElementById("profile-name").value = employeeData.name;
    document.getElementById("profile-father-name").value =
      employeeData.fatherName;
    document.getElementById("profile-correspondence-address").value =
      employeeData.correspondenceAddress;
    document.getElementById("profile-permanent-address").value =
      employeeData.permanentAddress;
    document.getElementById("profile-role").value = employeeData.role;
    document.getElementById("profile-team").value = employeeData.team;
    document.getElementById("profile-email").value = employeeData.email;
    document.getElementById("profile-contact").value = employeeData.contact;
    document.getElementById("profile-location").value = employeeData.location;
    document.getElementById("profile-aadhar").value = employeeData.aadhar;
    document.getElementById("profile-pan").value = employeeData.pan;
    document.getElementById("profile-bank").value = employeeData.bank;
    document.getElementById("profile-emergency-contact-name").value =
      employeeData.emergencyContactName;
    document.getElementById("profile-emergency-contact-number").value =
      employeeData.emergencyContactNumber;
    document.getElementById("profile-joining-date").value =
      employeeData.joiningDate;
    document.getElementById("profile-shift-start").value =
      employeeData.shiftStart;
    document.getElementById("profile-shift-end").value = employeeData.shiftEnd;
    renderEditableProfileEntries("education", employeeData.education);
    renderEditableProfileEntries("experience", employeeData.experience);
    profileView.hidden = true;
    profileEditForm.hidden = false;
    employeeProfileDialog.showModal();
  }

  renderInitialEmployees();
  employeeDirectory
    .querySelectorAll(".employee-row")
    .forEach(addEmployeeActions);

  employeeDirectory.querySelectorAll(".employee-row").forEach((row) => {
    const email = normalizeEmployeeEmail(row.dataset.email);
    if (!email) {
      return;
    }

    try {
      const savedProfile = JSON.parse(
        localStorage.getItem(`employee-profile:${email}`) || "null",
      );
      if (savedProfile) {
        const name = savedProfile.name || "";
        row.querySelector(".employee-details h3").textContent =
          name || row.querySelector(".employee-details h3").textContent;
        row.querySelector(".employee-details p").textContent =
          savedProfile.role ||
          row.querySelector(".employee-details p").textContent;
        row.querySelector(".employee-team").textContent =
          savedProfile.team || row.querySelector(".employee-team").textContent;
        if (name) {
          row.querySelector(".member-avatar").textContent = name
            .split(/\s+/)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
        }
        Object.entries(savedProfile).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            row.dataset[key] = Array.isArray(value)
              ? JSON.stringify(value)
              : value;
          }
        });
      }

      const employeeData = getEmployeeData(row);
      localStorage.setItem(
        `employee-profile:${email}`,
        JSON.stringify(employeeData),
      );
    } catch {
      return;
    }
  });
  updateEmployeeCount();

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
    if (actionButton.dataset.action === "documents") {
      showEmployeeDocuments(employeeRow);
    } else if (actionButton.dataset.action === "view") {
      showProfile(employeeRow);
    } else if (actionButton.dataset.action === "edit") {
      startEditingEmployee(employeeRow);
    } else if (window.confirm(`Delete ${getEmployeeData(employeeRow).name}?`)) {
      const employeeData = getEmployeeData(employeeRow);
      createDashboardNotification({
        recipientRole: "employee",
        recipientName: employeeData.name,
        recipientEmail: employeeData.email,
        title: "Employee record removed",
        message: "HR has removed your employee record.",
        category: "Profile",
        sender: "Ananya Roy",
      });
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
    const previousEmail = normalizeEmployeeEmail(
      editingEmployeeRow.dataset.email,
    );
    const updatedData = {
      employeeId: document.getElementById("profile-employee-id").value.trim(),
      name: document.getElementById("profile-name").value.trim(),
      fatherName: document.getElementById("profile-father-name").value.trim(),
      correspondenceAddress: document
        .getElementById("profile-correspondence-address")
        .value.trim(),
      permanentAddress: document
        .getElementById("profile-permanent-address")
        .value.trim(),
      role: document.getElementById("profile-role").value.trim(),
      team: document.getElementById("profile-team").value.trim(),
      email: document.getElementById("profile-email").value.trim(),
      contact: document.getElementById("profile-contact").value.trim(),
      location: document.getElementById("profile-location").value.trim(),
      aadhar: document.getElementById("profile-aadhar").value.trim(),
      pan: document.getElementById("profile-pan").value.trim(),
      bank: document.getElementById("profile-bank").value.trim(),
      emergencyContactName: document
        .getElementById("profile-emergency-contact-name")
        .value.trim(),
      emergencyContactNumber: document
        .getElementById("profile-emergency-contact-number")
        .value.trim(),
      joiningDate: document.getElementById("profile-joining-date").value,
      shiftStart: document.getElementById("profile-shift-start").value,
      shiftEnd: document.getElementById("profile-shift-end").value,
      education: getEditableProfileEntries("education"),
      experience: getEditableProfileEntries("experience"),
    };
    updatedData.email = normalizeEmployeeEmail(updatedData.email);
    if (isEmployeeEmailInUse(updatedData.email, editingEmployeeRow)) {
      alert("Another employee already uses this email address.");
      document.getElementById("profile-email").focus();
      return;
    }

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
      editingEmployeeRow.dataset[key] = Array.isArray(value)
        ? JSON.stringify(value)
        : value;
    });
    try {
      if (previousEmail && previousEmail !== updatedData.email) {
        localStorage.removeItem(`employee-profile:${previousEmail}`);
      }
      localStorage.setItem(
        `employee-profile:${updatedData.email}`,
        JSON.stringify(getEmployeeData(editingEmployeeRow)),
      );
    } catch {
      // The in-page profile remains available when browser storage is unavailable.
    }
    createDashboardNotification({
      recipientRole: "employee",
      recipientName: updatedData.name,
      recipientEmail: previousEmail || updatedData.email,
      title: "Your employee profile was updated",
      message: "HR updated your employee profile.",
      category: "Profile",
      sender: "Ananya Roy",
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
      fatherName: document
        .getElementById("new-employee-father-name")
        .value.trim(),
      correspondenceAddress: document
        .getElementById("new-employee-correspondence-address")
        .value.trim(),
      permanentAddress: document
        .getElementById("new-employee-permanent-address")
        .value.trim(),
      email: document.getElementById("email-id").value.trim(),
      contact: document.getElementById("contact-number").value.trim(),
      location: document.getElementById("job-location").value.trim(),
      aadhar: document
        .getElementById("new-employee-aadhar-number")
        .value.trim(),
      pan: document.getElementById("new-employee-pan-number").value.trim(),
      bank: document.getElementById("bank-account").value.trim(),
      emergencyContactName: document
        .getElementById("emergency-contact-name")
        .value.trim(),
      emergencyContactNumber: document
        .getElementById("emergency-contact-number")
        .value.trim(),
      joiningDate: document.getElementById("joining-date").value,
      shiftStart: document.getElementById("shift-timing").value,
      shiftEnd: document.getElementById("shift-end-time").value,
      education: getEntryRows("education"),
      experience: getEntryRows("experience"),
    };
    profileData.email = normalizeEmployeeEmail(profileData.email);
    if (isEmployeeEmailInUse(profileData.email)) {
      alert("Another employee already uses this email address.");
      document.getElementById("email-id").focus();
      return;
    }
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
        employeeRow.dataset[key] = Array.isArray(value)
          ? JSON.stringify(value)
          : value;
      },
    );
    try {
      localStorage.setItem(
        `employee-profile:${profileData.email}`,
        JSON.stringify({ name, role, team, ...profileData }),
      );
    } catch {
      // The manager's in-page employee profile still works without storage.
    }
    createDashboardNotification({
      recipientRole: "employee",
      recipientName: name,
      recipientEmail: profileData.email,
      title: "Welcome to Mamily Connect",
      message: "Your employee profile has been created by HR.",
      category: "Profile",
      sender: "Ananya Roy",
    });
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
    selectedMembers.forEach((memberName) => {
      createDashboardNotification({
        recipientRole: "employee",
        recipientName: memberName,
        recipientEmail: getEmployeeEmail(memberName),
        title: `Added to team: ${teamName}`,
        message: `You have been added to ${teamName}.`,
        category: "Team",
        sender: managerFeedbackName,
      });
    });
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
    const teamName = teamCard.querySelector(".team-card-header h2").textContent;
    createDashboardNotification({
      recipientRole: "employee",
      recipientName: select.value,
      recipientEmail: getEmployeeEmail(select.value),
      title: `Added to team: ${teamName}`,
      message: `You have been added to ${teamName}.`,
      category: "Team",
      sender: managerFeedbackName,
    });
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
    const employeeName = removeButton
      .closest(".team-member")
      .querySelector(".team-member-details strong").textContent;
    const teamName = teamCard.querySelector(".team-card-header h2").textContent;
    createDashboardNotification({
      recipientRole: "employee",
      recipientName: employeeName,
      recipientEmail: getEmployeeEmail(employeeName),
      title: `Removed from team: ${teamName}`,
      message: `You have been removed from ${teamName}.`,
      category: "Team",
      sender: managerFeedbackName,
    });
    removeButton.closest(".team-member").remove();
    updateTeamCount(teamCard);
    refreshMemberSelect(teamCard);
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
const meetingTeamFilter = document.getElementById("meeting-team-filter");
const meetingRoleFilter = document.getElementById("meeting-role-filter");
const meetingSelectAllButton = document.getElementById("meeting-select-all");
const meetingList = document.getElementById("meeting-list");
const meetingCount = document.getElementById("meeting-count");
const meetingStorageKey = "mamily-connect-meetings-v1";

if (
  meetingsView &&
  scheduleMeetingForm &&
  showScheduleMeetingButton &&
  meetingEmployeeOptions &&
  meetingTeamFilter &&
  meetingRoleFilter &&
  meetingSelectAllButton &&
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

  function updateMeetingFilterOptions(select, values, allLabel) {
    const selectedValue = select.value;
    const options = [...new Set(values.filter(Boolean))].sort((first, second) =>
      first.localeCompare(second),
    );
    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = allLabel;
    select.replaceChildren(allOption);

    options.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
    select.value = options.includes(selectedValue) ? selectedValue : "";
  }

  function applyMeetingEmployeeFilters() {
    const team = meetingTeamFilter.value;
    const role = meetingRoleFilter.value;
    const visibleCheckboxes = [];

    meetingEmployeeOptions
      .querySelectorAll(".meeting-employee-option")
      .forEach((label) => {
        const isVisible =
          (!team || label.dataset.team === team) &&
          (!role || label.dataset.role === role);
        label.hidden = !isVisible;
        if (isVisible) {
          visibleCheckboxes.push(label.querySelector("input"));
        }
      });

    const allSelected =
      visibleCheckboxes.length > 0 &&
      visibleCheckboxes.every((checkbox) => checkbox.checked);
    meetingSelectAllButton.textContent = allSelected
      ? "Deselect all"
      : "Select all";
    meetingSelectAllButton.disabled = visibleCheckboxes.length === 0;
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
    const employees = [...employeeRows]
      .map((row) => ({
        row,
        name: row.querySelector(".employee-details h3")?.textContent.trim(),
        role: row.querySelector(".employee-details p")?.textContent.trim(),
        team: row.querySelector(".employee-team")?.textContent.trim(),
      }))
      .filter((employee) => employee.name);

    updateMeetingFilterOptions(
      meetingTeamFilter,
      employees.map((employee) => employee.team),
      "All teams",
    );
    updateMeetingFilterOptions(
      meetingRoleFilter,
      employees.map((employee) => employee.role),
      "All roles",
    );
    meetingEmployeeOptions.replaceChildren();

    employees.forEach(({ row, name, role, team }, index) => {
      const label = document.createElement("label");
      label.className = "meeting-employee-option";
      label.dataset.team = team || "";
      label.dataset.role = role || "";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "attendees";
      checkbox.value = name;
      checkbox.dataset.email = row.dataset.email || "";
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
    applyMeetingEmployeeFilters();
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
    applyMeetingEmployeeFilters();
  });
  meetingTeamFilter.addEventListener("change", applyMeetingEmployeeFilters);
  meetingRoleFilter.addEventListener("change", applyMeetingEmployeeFilters);
  meetingSelectAllButton.addEventListener("click", () => {
    const visibleCheckboxes = [
      ...meetingEmployeeOptions.querySelectorAll(
        ".meeting-employee-option:not([hidden]) input[name='attendees']",
      ),
    ];
    const allSelected =
      visibleCheckboxes.length > 0 &&
      visibleCheckboxes.every((checkbox) => checkbox.checked);
    visibleCheckboxes.forEach((checkbox) => {
      checkbox.checked = !allSelected;
      checkbox.setCustomValidity("");
    });
    applyMeetingEmployeeFilters();
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

    const title = scheduleMeetingForm.elements.title.value.trim();
    const date = scheduleMeetingForm.elements.date.value;
    const time = scheduleMeetingForm.elements.time.value;
    const location = scheduleMeetingForm.elements.location.value.trim();
    meetings.push({
      id: `meeting-${Date.now()}`,
      title,
      date,
      time,
      location,
      attendees,
    });
    saveMeetings();
    meetingEmployeeOptions
      .querySelectorAll('input[name="attendees"]:checked')
      .forEach((checkbox) => {
        createDashboardNotification({
          recipientRole: "employee",
          recipientName: checkbox.value,
          recipientEmail: checkbox.dataset.email,
          title: `Meeting invitation: ${title}`,
          message: `${date} at ${time}${location ? `, ${location}` : ""}`,
          category: "Meeting",
          sender: "Ananya Roy",
        });
      });
    renderMeetings();
    setMeetingFormVisibility(false);
  });

  window.refreshMeetingEmployeeList = refreshMeetingEmployeeList;
  renderMeetings();
}
