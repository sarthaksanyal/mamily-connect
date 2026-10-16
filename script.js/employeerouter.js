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

document.querySelectorAll("[data-dashboard-view]").forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();
    const navigationItem = [...navigationItems].find(
      (item) => item.dataset.view === control.dataset.dashboardView,
    );
    if (navigationItem) {
      navigationItem.click();
    } else {
      const fallbackTitle =
        control.dataset.title ||
        (control.dataset.dashboardView === "notifications"
          ? "Notifications"
          : "Dashboard");
      showDashboardView(control.dataset.dashboardView, fallbackTitle);
    }

    if (control.dataset.scrollTarget) {
      document.getElementById(control.dataset.scrollTarget)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });
});

const currentEmployeeProfile = document.getElementById(
  "current-employee-profile",
);
if (currentEmployeeProfile) {
  const profileUnavailable = document.getElementById("profile-unavailable");
  const userChip = document.querySelector(".user-chip");
  let currentEmail = "";
  let employeeProfile = null;
  try {
    currentEmail =
      normalizeEmployeeEmail(
        sessionStorage.getItem("current-employee-email"),
      ) || userChip?.dataset.employeeEmail;
    if (currentEmail) {
      employeeProfile = JSON.parse(
        localStorage.getItem(`employee-profile:${currentEmail}`) || "null",
      );
    }
  } catch {
    employeeProfile = null;
  }

  if (!employeeProfile && userChip) {
    employeeProfile = {
      name: userChip.querySelector("strong")?.textContent.trim() || "Employee",
      role: userChip.querySelector("small")?.textContent.trim() || "",
      email: currentEmail,
      team: "Software Support",
      contact: "",
      location: "",
    };
  }

  if (employeeProfile) {
    profileUnavailable.hidden = true;
    if (userChip) {
      userChip.querySelector("strong").textContent = employeeProfile.name;
    }
    currentEmployeeProfile.hidden = false;

    const initials = employeeProfile.name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const setAvatar = (element, photo) => {
      if (photo) {
        const image = document.createElement("img");
        image.src = photo;
        image.alt = `${employeeProfile.name} profile photo`;
        element.replaceChildren(image);
      } else {
        element.textContent = initials;
      }
    };
    const userAvatar = userChip?.querySelector(".user-avatar");
    const profileAvatar = document.getElementById("current-profile-avatar");
    setAvatar(userAvatar, employeeProfile.photo);
    setAvatar(profileAvatar, employeeProfile.photo);
    const photoInput = document.getElementById("current-profile-photo-input");
    const removePhotoButton = document.getElementById("remove-profile-photo");
    const photoStatus = document.getElementById("profile-photo-status");
    const saveEmployeeProfile = () => {
      try {
        localStorage.setItem(
          `employee-profile:${currentEmail}`,
          JSON.stringify(employeeProfile),
        );
        return true;
      } catch {
        return false;
      }
    };

    removePhotoButton.hidden = !employeeProfile.photo;
    photoInput.addEventListener("change", async () => {
      const file = photoInput.files?.[0];
      if (!file) {
        return;
      }
      if (!file.type.startsWith("image/")) {
        photoStatus.textContent = "Choose an image file.";
        photoInput.value = "";
        return;
      }
      try {
        const image = await createImageBitmap(file);
        const scale = Math.min(1, 320 / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas
          .getContext("2d")
          .drawImage(image, 0, 0, canvas.width, canvas.height);
        image.close();
        employeeProfile.photo = canvas.toDataURL("image/jpeg", 0.82);
        if (!saveEmployeeProfile()) {
          throw new Error("storage");
        }
        setAvatar(userAvatar, employeeProfile.photo);
        setAvatar(profileAvatar, employeeProfile.photo);
        removePhotoButton.hidden = false;
        photoStatus.textContent = "Profile photo updated.";
        window.refreshOrgChart?.();
      } catch {
        photoStatus.textContent =
          "The photo could not be saved in this browser.";
      }
      photoInput.value = "";
    });

    removePhotoButton.addEventListener("click", () => {
      delete employeeProfile.photo;
      if (!saveEmployeeProfile()) {
        photoStatus.textContent = "The photo could not be removed.";
        return;
      }
      setAvatar(userAvatar, "");
      setAvatar(profileAvatar, "");
      removePhotoButton.hidden = true;
      photoStatus.textContent = "Profile photo removed.";
      window.refreshOrgChart?.();
    });

    const setProfileText = (id, value) => {
      document.getElementById(id).textContent = value || "Not provided";
    };
    setProfileText("current-profile-name", employeeProfile.name);
    setProfileText("current-profile-role", employeeProfile.role);
    setProfileText(
      "current-profile-id",
      `Employee ID: ${employeeProfile.employeeId || "Not provided"}`,
    );
    setProfileText("current-profile-email", employeeProfile.email);
    setProfileText("current-profile-contact", employeeProfile.contact);
    setProfileText("current-profile-location", employeeProfile.location);

    const profileDetails = document.getElementById("current-profile-details");
    [
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
    ].forEach(([label, key]) => {
      const term = document.createElement("dt");
      term.textContent = label;
      const description = document.createElement("dd");
      description.textContent = employeeProfile[key] || "Not provided";
      profileDetails.append(term, description);
    });

    const renderProfileEntries = (elementId, heading, entries) => {
      const list = document.getElementById(elementId);
      list.replaceChildren();
      if (!entries?.length) {
        const emptyState = document.createElement("p");
        emptyState.textContent = "Not provided";
        list.append(emptyState);
        return;
      }

      entries.forEach((entry, index) => {
        const row = document.createElement("div");
        row.className = "profile-entry-row";
        const title = document.createElement("strong");
        title.textContent = `${heading} ${index + 1}`;
        const details = document.createElement("dl");
        details.className = "profile-entry-row-details";
        Object.entries(entry).forEach(([label, value]) => {
          const term = document.createElement("dt");
          term.textContent = label;
          const description = document.createElement("dd");
          description.textContent = value || "Not provided";
          details.append(term, description);
        });
        row.append(title, details);
        list.append(row);
      });
    };

    renderProfileEntries(
      "current-profile-education",
      "Education",
      employeeProfile.education,
    );
    renderProfileEntries(
      "current-profile-experience",
      "Experience",
      employeeProfile.experience,
    );
  } else {
    profileUnavailable.hidden = false;
  }
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

    createDashboardNotification({
      recipientRole: "manager",
      recipientName: managerFeedbackName,
      title: `Work log submitted by ${employeeName}`,
      message: `${entry.activity} (${entry.hours} hours) for ${formatWorkDate(entry.workDate)}.`,
      category: "Work Log",
      sender: employeeName,
    });

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
