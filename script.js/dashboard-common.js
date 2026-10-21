const attendanceView = document.querySelector(".attendance-view");
if (attendanceView) {
  const monthSelect = attendanceView.querySelector("[data-month-select]");
  const yearSelect = attendanceView.querySelector("[data-year-select]");
  const calendar = attendanceView.querySelector("[data-attendance-calendar]");
  const summary = attendanceView.querySelector("[data-attendance-summary]");
  const employeeList = attendanceView.querySelector(
    "[data-attendance-employees]",
  );
  const today = new Date();
  let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedEmployeeIndex = 0;

  Array.from({ length: 12 }, (_, month) => {
    const option = document.createElement("option");
    option.value = String(month);
    option.textContent = new Date(2000, month, 1).toLocaleDateString([], {
      month: "long",
    });
    monthSelect.append(option);
  });

  for (
    let year = today.getFullYear() - 30;
    year <= today.getFullYear() + 10;
    year += 1
  ) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    yearSelect.append(option);
  }

  function syncMonthControls() {
    monthSelect.value = String(displayedMonth.getMonth());
    yearSelect.value = String(displayedMonth.getFullYear());
  }

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

    syncMonthControls();

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
      dateNumber.className = "attendance-date-number";
      dateNumber.textContent = String(day);
      cell.append(dateNumber);

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

  function updateDisplayedMonth() {
    displayedMonth = new Date(
      Number(yearSelect.value),
      Number(monthSelect.value),
      1,
    );
    if (employeeList) {
      renderEmployeeList();
    } else {
      renderAttendanceCalendar(selectedEmployeeIndex);
    }
  }

  monthSelect.addEventListener("change", updateDisplayedMonth);
  yearSelect.addEventListener("change", updateDisplayedMonth);
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

function getEmployeeEmail(employeeName) {
  const employeeRow = [
    ...document.querySelectorAll("#employee-directory .employee-row"),
  ].find(
    (row) =>
      row.querySelector(".employee-details h3")?.textContent.trim() ===
      employeeName,
  );
  return employeeRow?.dataset.email || "";
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

    const leaveRequest = {
      id: `leave-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      employee: employeeName,
      employeeEmail: currentEmployeeEmail,
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
    };
    leaveState.requests.push(leaveRequest);
    saveLeaveState();
    createDashboardNotification({
      recipientRole: "manager",
      recipientName: managerFeedbackName,
      title: `Leave request from ${employeeName}`,
      message: `${getLeaveCategoryLabel(category)} requested for ${formatLeaveDate(startDate)}${startDate === endDate ? "" : ` to ${formatLeaveDate(endDate)}`}.`,
      category: "Leave",
      sender: employeeName,
    });
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
  createDashboardNotification({
    recipientRole: "employee",
    recipientName: request.employee,
    recipientEmail: request.employeeEmail || getEmployeeEmail(request.employee),
    title: `Leave request ${request.status}`,
    message: `Your ${getLeaveCategoryLabel(request.category).toLowerCase()} request for ${formatLeaveDate(request.startDate)}${request.startDate === request.endDate ? "" : ` to ${formatLeaveDate(request.endDate)}`} was ${request.status}.`,
    category: "Leave",
    sender: managerFeedbackName,
  });
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
  const performanceLineChart = window.google?.visualization?.LineChart
    ? new google.visualization.LineChart(chart)
    : null;
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

  let pendingPerformanceSeries = [];

  function renderPerformanceChart(series) {
    pendingPerformanceSeries = series;
    if (performanceView.hidden) {
      return;
    }
    if (!performanceLineChart) {
      chart.textContent = "Performance chart could not be loaded.";
      return;
    }

    const data = new google.visualization.DataTable();
    data.addColumn("string", "Month");
    series.forEach(({ name }) => data.addColumn("number", name));
    monthLabels.forEach((month, monthIndex) => {
      data.addRow([
        month,
        ...series.map((employee) => employee.scores[monthIndex]),
      ]);
    });

    performanceLineChart.draw(data, {
      backgroundColor: "transparent",
      chartArea: { left: 48, top: 18, width: "90%", height: "78%" },
      colors: series.map((employee) => employee.color),
      fontName: "Arial",
      hAxis: { textStyle: { color: "#667085", fontSize: 11 } },
      legend: { position: "none" },
      lineWidth: 3,
      pointSize: 5,
      vAxis: {
        gridlines: { color: "#e6ebf2" },
        textStyle: { color: "#667085", fontSize: 11 },
        ticks: [50, 60, 70, 80, 90, 100],
        viewWindow: { min: 50, max: 100 },
      },
    });
  }

  const performanceViewObserver = new MutationObserver(() => {
    if (!performanceView.hidden) {
      renderPerformanceChart(pendingPerformanceSeries);
    }
  });
  performanceViewObserver.observe(performanceView, {
    attributes: true,
    attributeFilter: ["hidden"],
  });
  window.addEventListener("resize", () => {
    if (!performanceView.hidden && pendingPerformanceSeries.length) {
      renderPerformanceChart(pendingPerformanceSeries);
    }
  });

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
let currentEmployeeEmail = "";
try {
  currentEmployeeEmail =
    sessionStorage.getItem("current-employee-email")?.toLowerCase() || "";
} catch {
  currentEmployeeEmail = "";
}
let currentEmployeeProfileData = null;
try {
  currentEmployeeProfileData = JSON.parse(
    localStorage.getItem(`employee-profile:${currentEmployeeEmail}`) || "null",
  );
} catch {
  currentEmployeeProfileData = null;
}
const employeeFeedbackName =
  currentEmployeeProfileData?.name ||
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
    feedbackEntries.filter(
      (entry) =>
        (entry.toEmail &&
          currentEmployeeEmail &&
          entry.toEmail.toLowerCase() === currentEmployeeEmail) ||
        entry.to === employeeFeedbackName,
    ),
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
      fromEmail: currentEmployeeEmail,
      to: "Ananya Roy",
      date: getLocalDateValue(),
      message,
    });
    createDashboardNotification({
      recipientRole: "manager",
      recipientName: managerFeedbackName,
      title: `Feedback received from ${employeeFeedbackName}`,
      message,
      category: "Feedback",
      sender: employeeFeedbackName,
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
    const recipientRow = [
      ...document.querySelectorAll("#employee-directory .employee-row"),
    ].find(
      (row) =>
        row.querySelector(".employee-details h3")?.textContent.trim() ===
        recipient,
    );
    const recipientEmail = recipientRow?.dataset.email || "";
    saveFeedbackEntry({
      id: `feedback-${Date.now()}`,
      from: managerFeedbackName,
      to: recipient,
      toEmail: recipientEmail.toLowerCase(),
      date: getLocalDateValue(),
      message,
    });
    createDashboardNotification({
      recipientRole: "employee",
      recipientName: recipient,
      recipientEmail,
      title: "New feedback from HR / Manager",
      message,
      category: "Feedback",
      sender: managerFeedbackName,
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
const taskChatStorageKey = "mamily-connect-task-chats-v1";
const taskView = document.querySelector(".task-view");

if (taskView) {
  const taskList = taskView.querySelector("[data-task-list]");
  const taskStats = taskView.querySelector("[data-task-stats]");
  const taskForm = document.getElementById("task-assignment-form");
  const assigneeSelect = taskForm?.elements.assignee;
  const taskEmployeeName =
    document.querySelector(".user-chip strong")?.textContent.trim() ||
    "Sarthak Sanyal";
  const isManager = Boolean(taskForm);
  const currentTaskUserName =
    document.querySelector(".user-chip strong")?.textContent.trim() ||
    (isManager ? "Ananya Roy" : taskEmployeeName);
  let taskEmployeeEmail = "";
  try {
    taskEmployeeEmail =
      sessionStorage.getItem("current-employee-email")?.toLowerCase() || "";
  } catch {
    taskEmployeeEmail = "";
  }

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
      assigneeEmail: "sarthak.sanyal@mamily.com",
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

  function loadTaskChats() {
    try {
      const savedChats = localStorage.getItem(taskChatStorageKey);
      const parsedChats = savedChats ? JSON.parse(savedChats) : [];
      return Array.isArray(parsedChats) ? parsedChats : [];
    } catch {
      return [];
    }
  }

  let taskChats = loadTaskChats();
  let activeChatTaskId = "";

  function saveTaskChats() {
    try {
      localStorage.setItem(taskChatStorageKey, JSON.stringify(taskChats));
    } catch {
      return;
    }
  }

  const taskChatDialog = document.createElement("dialog");
  taskChatDialog.className = "task-chat-dialog";
  const taskChatHeader = document.createElement("header");
  taskChatHeader.className = "task-chat-header";
  const taskChatHeading = document.createElement("div");
  const taskChatTitle = document.createElement("h2");
  taskChatTitle.id = "task-chat-title";
  const taskChatParticipant = document.createElement("p");
  taskChatHeading.append(taskChatTitle, taskChatParticipant);
  const closeTaskChatButton = document.createElement("button");
  closeTaskChatButton.type = "button";
  closeTaskChatButton.className = "close-form-button";
  closeTaskChatButton.textContent = "×";
  taskChatHeader.append(taskChatHeading, closeTaskChatButton);
  const taskChatMessages = document.createElement("div");
  taskChatMessages.className = "task-chat-messages";
  taskChatMessages.setAttribute("role", "log");
  taskChatMessages.setAttribute("aria-live", "polite");
  const taskChatForm = document.createElement("form");
  taskChatForm.className = "task-chat-form";
  const taskChatInput = document.createElement("textarea");
  taskChatInput.name = "message";
  taskChatInput.rows = 3;
  taskChatInput.maxLength = 1000;
  taskChatInput.required = true;
  taskChatInput.placeholder = "Write a message about this task";
  const sendTaskChatButton = document.createElement("button");
  sendTaskChatButton.type = "submit";
  sendTaskChatButton.className = "save-employee-button";
  sendTaskChatButton.textContent = "Send";
  taskChatForm.append(taskChatInput, sendTaskChatButton);
  taskChatDialog.append(taskChatHeader, taskChatMessages, taskChatForm);
  taskView.append(taskChatDialog);

  function renderTaskChat() {
    taskChatMessages.replaceChildren();
    const conversation = taskChats
      .filter((message) => message.taskId === activeChatTaskId)
      .sort(
        (first, second) =>
          new Date(first.sentAt).getTime() - new Date(second.sentAt).getTime(),
      );

    if (conversation.length === 0) {
      const emptyState = document.createElement("p");
      emptyState.className = "task-chat-empty";
      emptyState.textContent = "Start a conversation about this task.";
      taskChatMessages.append(emptyState);
      return;
    }

    conversation.forEach((message) => {
      const item = document.createElement("article");
      const isOwnMessage =
        message.senderRole === (isManager ? "manager" : "employee");
      item.className = `task-chat-message${isOwnMessage ? " own-message" : ""}`;
      const sender = document.createElement("strong");
      sender.textContent = message.sender;
      const body = document.createElement("p");
      body.textContent = message.body;
      const timestamp = document.createElement("time");
      timestamp.dateTime = message.sentAt;
      timestamp.textContent = new Date(message.sentAt).toLocaleString();
      item.append(sender, body, timestamp);
      taskChatMessages.append(item);
    });
    taskChatMessages.scrollTop = taskChatMessages.scrollHeight;
  }

  closeTaskChatButton.addEventListener("click", () => taskChatDialog.close());
  taskChatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const body = taskChatInput.value.trim();
    if (!body || !activeChatTaskId) {
      return;
    }
    taskChats.push({
      taskId: activeChatTaskId,
      sender: currentTaskUserName,
      senderRole: isManager ? "manager" : "employee",
      body,
      sentAt: new Date().toISOString(),
    });
    saveTaskChats();
    taskChatInput.value = "";
    renderTaskChat();
    taskChatInput.focus();
  });

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

    const statusControl = document.createElement("label");
    statusControl.className = "task-status-control";
    const controlLabel = document.createElement("span");
    controlLabel.textContent = isManager
      ? "Set task status"
      : "Update task status";
    const statusSelect = document.createElement("select");
    statusSelect.dataset.taskStatus = "";
    ["Not Started", "In Progress", "Completed"].forEach((taskStatus) => {
      statusSelect.add(new Option(taskStatus, taskStatus));
    });
    statusSelect.value = getTaskStatus(task);
    statusControl.append(controlLabel, statusSelect);
    progressSection.append(statusControl);

    const taskActions = document.createElement("div");
    taskActions.className = "task-card-actions";
    const chatButton = document.createElement("button");
    chatButton.type = "button";
    chatButton.className = "secondary-button task-chat-button";
    chatButton.dataset.taskChat = task.id;
    const chatParticipant = isManager
      ? task.assignee || "employee"
      : task.assignedBy || "manager";
    chatButton.textContent = `Chat with ${chatParticipant}`;
    taskActions.append(chatButton);

    card.append(cardHeader, metadata, progressSection, taskActions);
    return card;
  }

  function renderTasks() {
    const visibleTasks = isManager
      ? tasks
      : tasks.filter((task) =>
          task.assigneeEmail && taskEmployeeEmail
            ? task.assigneeEmail.toLowerCase() === taskEmployeeEmail
            : task.assignee === taskEmployeeName,
        );
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

  taskList.addEventListener("click", (event) => {
    const chatButton = event.target.closest("button[data-task-chat]");
    if (!chatButton) {
      return;
    }
    const task = tasks.find((item) => item.id === chatButton.dataset.taskChat);
    if (!task) {
      return;
    }
    activeChatTaskId = task.id;
    taskChatTitle.textContent = task.title;
    const chatParticipant = isManager
      ? task.assignee || "employee"
      : task.assignedBy || "manager";
    taskChatParticipant.textContent = `Chat with ${chatParticipant}`;
    renderTaskChat();
    taskChatDialog.showModal();
    taskChatInput.focus();
  });

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
        assigneeEmail: getEmployeeEmail(formData.get("assignee")),
        assignedBy:
          document.querySelector(".user-chip strong")?.textContent.trim() ||
          "Manager",
        assignedAt: new Date().toISOString(),
        dueDate: formData.get("dueDate"),
        progress: 0,
      });
      saveTasks();
      const assignedTask = tasks[tasks.length - 1];
      createDashboardNotification({
        recipientRole: "employee",
        recipientName: assignedTask.assignee,
        recipientEmail: assignedTask.assigneeEmail,
        title: `New task assigned: ${assignedTask.title}`,
        message: `Due ${formatDate(assignedTask.dueDate)}.`,
        category: "Task",
        sender: assignedTask.assignedBy,
      });
      renderTasks();
      taskForm.reset();
      dueDateInput.value = localDateString(new Date(Date.now() + 86400000 * 7));
    });
  }

  taskList.addEventListener("change", (event) => {
    const statusSelect = event.target.closest("select[data-task-status]");
    if (!statusSelect) {
      return;
    }

    const card = statusSelect.closest("[data-task-id]");
    const task = tasks.find((item) => item.id === card?.dataset.taskId);
    const progressByStatus = {
      "Not Started": 0,
      "In Progress": 50,
      Completed: 100,
    };
    const progress = progressByStatus[statusSelect.value];
    if (!task || progress === undefined) {
      return;
    }

    task.progress = progress;
    saveTasks();
    if (taskForm) {
      createDashboardNotification({
        recipientRole: "employee",
        recipientName: task.assignee,
        recipientEmail: task.assigneeEmail || getEmployeeEmail(task.assignee),
        title: `Task status updated: ${task.title}`,
        message: `The task status was updated to ${statusSelect.value}.`,
        category: "Task",
        sender: managerFeedbackName,
      });
    }
    renderTasks();
  });

  renderTasks();
  window.addEventListener("storage", (event) => {
    if (event.key === taskChatStorageKey && event.newValue) {
      try {
        taskChats = JSON.parse(event.newValue);
        if (taskChatDialog.open) {
          renderTaskChat();
        }
      } catch {
        return;
      }
      return;
    }
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

const notificationStorageKey = "mamily-connect-notifications-v1";
const notificationRole = document
  .querySelector("[data-notification-role]")
  ?.getAttribute("data-notification-role");
const notificationList = document.querySelector("[data-notification-received]");
const notificationCount = document.querySelector("[data-notification-count]");
const notificationForm = document.querySelector("[data-notification-form]");
const notificationStatus = document.querySelector("[data-notification-status]");
const resignationQueue = document.querySelector("[data-resignation-queue]");
const pendingResignationList = document.querySelector(
  "[data-resignation-pending]",
);
const reviewedResignationList = document.querySelector(
  "[data-resignation-reviewed]",
);
const pendingResignationCount = document.querySelector(
  "[data-resignation-pending-count]",
);
const reviewedResignationCount = document.querySelector(
  "[data-resignation-reviewed-count]",
);
const resignationForm = document.querySelector("[data-resignation-form]");
const resignationStatus = document.querySelector("[data-resignation-status]");
const requisitionForm = document.querySelector("[data-requisition-form]");
const requisitionStatus = document.querySelector("[data-requisition-status]");
const requisitionPanel = document.querySelector(".requisition-panel");
const showRequisitionFormButton = document.getElementById(
  "show-requisition-form",
);
const closeRequisitionFormButtons = document.querySelectorAll(
  "[data-close-requisition-form], [data-cancel-requisition-form]",
);
const requisitionStorageKey = "mamily-connect-manpower-requisitions-v1";
const readNotificationKey =
  notificationRole === "employee"
    ? `mamily-connect-read-notifications-employee-${currentEmployeeEmail || employeeFeedbackName.toLowerCase()}`
    : `mamily-connect-read-notifications-${notificationRole}`;
const notificationSeed = [
  {
    id: "welcome-update",
    title: "Welcome to Mamily Connect",
    message: "Your team updates and important announcements will appear here.",
    category: "General",
    sender: "Ananya Roy",
    createdAt: "2026-10-01T09:00:00.000Z",
    recipientRole: "employee",
    recipientName: "*",
  },
  {
    id: "wellbeing-session",
    title: "Employee wellbeing session",
    message:
      "Join the optional wellbeing session this Friday at 3:00 PM in Meeting Room 2.",
    category: "Event",
    sender: "Ananya Roy",
    createdAt: "2026-10-03T08:30:00.000Z",
    recipientRole: "employee",
    recipientName: "*",
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

let notifications =
  notificationList || resignationQueue ? loadNotifications() : [];
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

function createDashboardNotification(notification) {
  notifications = [
    {
      id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...notification,
    },
    ...loadNotifications(),
  ];
  saveNotifications();
  renderNotifications();
  renderResignationQueue();
}

function getVisibleNotifications() {
  return notifications.filter((notification) => {
    if (!notification.recipientRole || notification.recipientRole === "all") {
      return (
        notification.type !== "resignation" || notificationRole === "manager"
      );
    }
    if (notification.recipientRole !== notificationRole) {
      return false;
    }
    if (notificationRole === "employee") {
      if (notification.recipientName === "*") {
        return true;
      }
      if (notification.recipientEmail && currentEmployeeEmail) {
        if (
          notification.recipientEmail.toLowerCase() === currentEmployeeEmail
        ) {
          return true;
        }
      }
      return notification.recipientName === employeeFeedbackName;
    }
    return (
      !notification.recipientName ||
      notification.recipientName === managerFeedbackName
    );
  });
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
  const visibleNotifications = getVisibleNotifications();
  const sortedNotifications = [...visibleNotifications].sort(
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

    const actions = document.createElement("div");
    actions.className = "notification-actions";

    const readAction = document.createElement("button");
    readAction.type = "button";
    readAction.className = "notification-read-button";
    readAction.dataset.notificationId = notification.id;
    readAction.textContent = isRead ? "Read" : "Mark read";
    readAction.disabled = isRead;
    actions.append(readAction);

    if (notification.type === "resignation") {
      const status = document.createElement("span");
      status.className = `resignation-status${notification.status === "Accepted" ? " accepted" : notification.status === "Rejected" ? " rejected" : ""}`;
      status.textContent = notification.status || "Pending review";

      if (notificationRole === "manager" && !notification.status) {
        ["Accepted", "Rejected"].forEach((decision) => {
          const decisionButton = document.createElement("button");
          decisionButton.type = "button";
          decisionButton.className = `resignation-decision-button ${decision.toLowerCase()}`;
          decisionButton.dataset.notificationId = notification.id;
          decisionButton.dataset.resignationDecision = decision;
          decisionButton.textContent =
            decision === "Accepted" ? "Accept" : "Reject";
          actions.append(decisionButton);
        });
      }

      if (notificationRole === "employee") {
        actions.append(status);
      } else {
        actions.append(status);
      }
    }

    const message = document.createElement("p");
    message.textContent = notification.message;
    item.append(heading, actions, meta, message);
    notificationList.append(item);
  });
}

function getResignationFormFields(notification) {
  const messageLines = (notification.message || "").split("\n");
  const getLegacyValue = (label) => {
    const line = messageLines.find((item) => item.startsWith(`${label}: `));
    return line ? line.slice(label.length + 2) : "Not provided";
  };

  return {
    employeeName:
      notification.employeeName || notification.sender || "Employee",
    employeeRole: notification.employeeRole || getLegacyValue("Job title"),
    lastWorkingDay:
      notification.lastWorkingDay ||
      getLegacyValue("Proposed last working day"),
    reason: notification.reason || getLegacyValue("Reason"),
  };
}

function createResignationQueueItem(notification, isReviewed) {
  const formFields = getResignationFormFields(notification);
  const item = document.createElement("article");
  item.className = "resignation-queue-item";

  const heading = document.createElement("div");
  heading.className = "resignation-queue-heading";
  const name = document.createElement("h3");
  name.textContent = formFields.employeeName;
  const status = document.createElement("span");
  status.className = `resignation-status${notification.status === "Accepted" ? " accepted" : notification.status === "Rejected" ? " rejected" : ""}`;
  status.textContent = notification.status || "Pending review";
  heading.append(name, status);

  const fields = document.createElement("dl");
  fields.className = "resignation-form-details";
  [
    ["Job Title", formFields.employeeRole],
    ["Proposed Last Working Day", formFields.lastWorkingDay],
    ["Reason", formFields.reason],
    [
      "Submitted",
      new Date(notification.createdAt).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    ],
  ].forEach(([label, value]) => {
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");
    description.textContent = value;
    fields.append(term, description);
  });
  item.append(heading, fields);

  if (!isReviewed) {
    const actions = document.createElement("div");
    actions.className = "notification-actions resignation-queue-actions";
    ["Accepted", "Rejected"].forEach((decision) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `resignation-decision-button ${decision.toLowerCase()}`;
      button.dataset.notificationId = notification.id;
      button.dataset.resignationDecision = decision;
      button.textContent = decision === "Accepted" ? "Accept" : "Reject";
      actions.append(button);
    });
    item.append(actions);
  }

  return item;
}

function renderResignationQueue() {
  if (!resignationQueue) {
    return;
  }

  const resignations = notifications
    .filter((notification) => notification.type === "resignation")
    .sort(
      (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
    );
  const pending = resignations.filter((notification) => !notification.status);
  const reviewed = resignations.filter((notification) => notification.status);

  pendingResignationList.replaceChildren();
  reviewedResignationList.replaceChildren();
  pendingResignationCount.textContent = `${pending.length} pending`;
  reviewedResignationCount.textContent = `${reviewed.length} reviewed`;

  [
    [pending, pendingResignationList, "No pending resignation forms."],
    [reviewed, reviewedResignationList, "No reviewed resignation forms yet."],
  ].forEach(([items, list, emptyMessage]) => {
    if (items.length === 0) {
      const emptyState = document.createElement("p");
      emptyState.className = "notification-empty";
      emptyState.textContent = emptyMessage;
      list.append(emptyState);
      return;
    }

    items.forEach((notification) => {
      list.append(
        createResignationQueueItem(notification, Boolean(notification.status)),
      );
    });
  });
}

function updateResignationDecision(button) {
  const notification = notifications.find(
    (item) => item.id === button.dataset.notificationId,
  );
  if (!notification || notification.status) {
    return;
  }

  notification.status = button.dataset.resignationDecision;
  notification.decidedAt = new Date().toISOString();
  saveNotifications();
  createDashboardNotification({
    recipientRole: "employee",
    recipientName: notification.employeeName,
    recipientEmail: notification.employeeEmail,
    title: `Resignation ${notification.status.toLowerCase()}`,
    message: `Your resignation request has been ${notification.status.toLowerCase()}.`,
    category: "Resignation",
    sender: "Ananya Roy",
  });
  renderNotifications();
  renderResignationQueue();
}

if (resignationQueue) {
  resignationQueue.addEventListener("click", (event) => {
    const button = event.target.closest("[data-resignation-decision]");
    if (button) {
      updateResignationDecision(button);
    }
  });
}

renderResignationQueue();

if (requisitionForm) {
  const hideRequisitionForm = (reset = true) => {
    if (reset) {
      requisitionForm.reset();
    }
    requisitionPanel.hidden = true;
    showRequisitionFormButton.hidden = false;
  };

  showRequisitionFormButton.addEventListener("click", () => {
    requisitionStatus.textContent = "";
    requisitionPanel.hidden = false;
    showRequisitionFormButton.hidden = true;
    requisitionForm.elements.jobTitle.focus();
  });

  closeRequisitionFormButtons.forEach((button) => {
    button.addEventListener("click", () => hideRequisitionForm());
  });

  requisitionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(requisitionForm);
    let requisitions = [];
    try {
      requisitions = JSON.parse(
        window.localStorage.getItem(requisitionStorageKey) || "[]",
      );
      if (!Array.isArray(requisitions)) {
        requisitions = [];
      }
    } catch {
      requisitions = [];
    }
    requisitions.unshift({
      id: `requisition-${Date.now()}`,
      jobTitle: formData.get("jobTitle").trim(),
      team: formData.get("team").trim(),
      positions: Number(formData.get("positions")),
      employmentType: formData.get("employmentType"),
      location: formData.get("location").trim(),
      priority: formData.get("priority"),
      justification: formData.get("justification").trim(),
      submittedAt: new Date().toISOString(),
    });
    try {
      window.localStorage.setItem(
        requisitionStorageKey,
        JSON.stringify(requisitions),
      );
    } catch {
      requisitionStatus.textContent =
        "Unable to save requisition in this browser.";
      return;
    }
    requisitionStatus.textContent = "Manpower requisition submitted.";
    hideRequisitionForm();
  });
}

if (notificationList) {
  notificationList.addEventListener("click", (event) => {
    const decisionButton = event.target.closest("[data-resignation-decision]");
    if (decisionButton) {
      updateResignationDecision(decisionButton);
      return;
    }

    const button = event.target.closest("[data-notification-id]");
    if (!button || readNotifications.includes(button.dataset.notificationId)) {
      return;
    }
    readNotifications = [...readNotifications, button.dataset.notificationId];
    saveReadNotifications();
    renderNotifications();
  });

  if (resignationForm) {
    resignationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(resignationForm);
      const employeeName = formData.get("employeeName").trim();
      const employeeRole = formData.get("employeeRole").trim();
      const lastWorkingDay = formData.get("lastWorkingDay");
      const reason = formData.get("reason").trim();
      notifications = [
        {
          id: `resignation-${Date.now()}`,
          type: "resignation",
          title: `Resignation submitted by ${employeeName}`,
          message: `Job title: ${employeeRole}\nProposed last working day: ${lastWorkingDay}\nReason: ${reason}`,
          employeeName,
          employeeEmail: currentEmployeeEmail,
          employeeRole,
          lastWorkingDay,
          reason,
          category: "Resignation",
          sender: employeeName,
          recipientRole: "manager",
          recipientName: managerFeedbackName,
          createdAt: new Date().toISOString(),
          status: "",
        },
        ...notifications,
      ];
      saveNotifications();
      resignationForm.reset();
      resignationStatus.textContent = "Resignation submitted for HR review.";
      renderNotifications();
    });
  }

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
          recipientRole: "employee",
          recipientName: "*",
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
      renderResignationQueue();
    }
    if (event.key === readNotificationKey) {
      readNotifications = loadReadNotifications();
      renderNotifications();
    }
  });

  renderNotifications();
  renderResignationQueue();
}

const orgChartView = document.getElementById("organizational-chart-view");
if (orgChartView) {
  const chartCanvas = orgChartView.querySelector("[data-org-chart-canvas]");
  const chartSearch = orgChartView.querySelector("[data-org-chart-search]");
  const chartStatus = orgChartView.querySelector("[data-org-chart-status]");
  const chartDialog = orgChartView.querySelector("[data-org-chart-dialog]");
  const chartPeople = new Map();
  let organizationChart = null;
  let currentChartData = null;

  function escapeChartHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entities[character];
    });
  }

  function normalizeChartPeople(records) {
    return records
      .filter(
        (person) =>
          person.name && !/^abcd(?:\s+employee)?$/i.test(person.name.trim()),
      )
      .map((person) =>
        person.team?.trim().toLowerCase() === "cd"
          ? { ...person, team: "Other Teams" }
          : person,
      );
  }

  function getEmployeeEmail(name) {
    const person = (window.organizationEmployees || []).find(
      (employee) => employee.name.toLowerCase() === name.toLowerCase(),
    );
    return person?.email || null;
  }

  function getChartPeople() {
    const records = (window.organizationEmployees || []).map((person) => ({
      ...person,
    }));
    const employeeIndexes = new Map(
      records.map((person, index) => [person.email.toLowerCase(), index]),
    );

    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith("employee-profile:"))
        .forEach((key) => {
          const savedProfile = JSON.parse(localStorage.getItem(key) || "null");
          const profileName = savedProfile?.name?.trim();
          if (/^abcd(?:\s+employee)?$/i.test(profileName || "")) {
            localStorage.removeItem(key);
            return;
          }
          if (savedProfile?.team?.trim().toLowerCase() === "cd") {
            savedProfile.team = "Other Teams";
            localStorage.setItem(key, JSON.stringify(savedProfile));
          }
          const email = savedProfile?.email?.toLowerCase();
          if (!email) {
            return;
          }
          const existingIndex = employeeIndexes.get(email);
          if (existingIndex === undefined) {
            employeeIndexes.set(email, records.length);
            records.push(savedProfile);
          } else {
            records[existingIndex] = {
              ...records[existingIndex],
              ...savedProfile,
            };
          }
        });
    } catch {
      return normalizeChartPeople(records);
    }

    return normalizeChartPeople(records);
  }

  function getPersonId(person) {
    return person.email
      ? person.email.toLowerCase()
      : `person:${person.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  }

  function makeChartNode(person, isTeam = false) {
    const initials = person.name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const photo = /^data:image\/(png|jpeg|webp|gif);base64,/i.test(
      person.photo || "",
    )
      ? `<img src="${person.photo}" alt="" />`
      : `<span>${escapeChartHtml(initials)}</span>`;
    const title = isTeam ? "Team" : person.role || "Position not provided";
    return `<div class="org-chart-node ${isTeam ? "org-chart-team-node" : ""}">${photo}<div><strong>${escapeChartHtml(person.name)}</strong><small>${escapeChartHtml(title)}</small></div></div>`;
  }

  function drawOrganizationChart() {
    if (!window.google?.visualization?.OrgChart) {
      chartStatus.textContent = "The organizational chart could not be loaded.";
      return;
    }

    const people = getChartPeople();
    chartPeople.clear();
    if (!people.length) {
      chartCanvas.replaceChildren();
      chartStatus.textContent = "No employee records are available.";
      return;
    }

    const founders = people.filter((person) =>
      /founder/i.test(person.role || ""),
    );
    const hrManagers = people.filter((person) =>
      /hr manager/i.test(person.role || ""),
    );
    const hrManager = hrManagers[0];
    const sakshi =
      hrManagers.find((person) => /^sakshi mishra$/i.test(person.name)) ||
      hrManager;
    const companyRoot = {
      id: "organization:company",
      name: "Mamily",
      role: "Company",
      isOrganization: true,
    };
    const root = founders.length
      ? companyRoot
      : hrManager ||
        people.find((person) =>
          /manager|director|head/i.test(person.role || ""),
        ) ||
        people[0];
    const leadership = [...founders, ...hrManagers];
    if (!founders.length && !leadership.includes(root)) {
      leadership.unshift(root);
    }
    const getNodeId = (person) => person.id || getPersonId(person);
    const teamMembers = people.filter((person) => !leadership.includes(person));
    const teamGroups = new Map();
    teamMembers.forEach((person) => {
      const team = person.team || "Other Teams";
      if (!teamGroups.has(team)) {
        teamGroups.set(team, []);
      }
      teamGroups.get(team).push(person);
    });

    const teamIdByName = new Map(
      [...teamGroups.keys()].map((team) => [team, `team:${team}`]),
    );
    const leadByTeam = new Map();
    teamGroups.forEach((members, team) => {
      leadByTeam.set(
        team,
        members.find((person) =>
          /lead|manager|director|head/i.test(person.role || ""),
        ) || null,
      );
    });

    const search = chartSearch.value.trim().toLowerCase();
    const matches = new Set(
      search
        ? people
            .filter((person) =>
              `${person.name} ${person.role || ""}`
                .toLowerCase()
                .includes(search),
            )
            .map(getPersonId)
        : people.map(getPersonId),
    );
    const included = new Set([getNodeId(root)]);
    const includeAncestors = (person) => {
      const leadershipIndex = leadership.indexOf(person);
      if (leadershipIndex >= 0) {
        included.add(getNodeId(root));
        leadership
          .slice(0, leadershipIndex + 1)
          .forEach((leader) => included.add(getPersonId(leader)));
        return;
      }
      included.add(getNodeId(root));
      leadership.forEach((leader) => included.add(getPersonId(leader)));
      included.add(getPersonId(person));
      const team = person.team || "Other Teams";
      included.add(teamIdByName.get(team));
      const lead = leadByTeam.get(team);
      if (lead && lead !== person) {
        included.add(getPersonId(lead));
      }
    };
    people.forEach((person) => {
      if (matches.has(getPersonId(person))) {
        includeAncestors(person);
      }
    });

    const rows = [];
    const addRow = (person, parentId, isTeam = false) => {
      const id = isTeam ? person.id : getNodeId(person);
      if (id !== getNodeId(root) && !included.has(id)) {
        return;
      }
      if (!isTeam && !person.isOrganization) {
        chartPeople.set(id, person);
      }
      rows.push([
        { v: id, f: makeChartNode(person, isTeam) },
        parentId,
        isTeam
          ? `${person.name} team`
          : `${person.name}, ${person.role || "position not provided"}`,
      ]);
    };

    addRow(root, "");
    if (founders.length) {
      founders.forEach((person) => addRow(person, getNodeId(root)));
      hrManagers.forEach((manager) => {
        const parentFounder =
          manager === sakshi
            ? founders.find((person) => /ujjwal sharma/i.test(person.name)) ||
              founders[0]
            : founders[0];
        addRow(manager, getPersonId(parentFounder));
      });
    } else {
      leadership.slice(1).forEach((person, index) => {
        addRow(person, getPersonId(leadership[index]));
      });
    }
    teamGroups.forEach((members, team) => {
      const teamId = teamIdByName.get(team);
      const teamPerson = { id: teamId, name: team };
      const teamParent = ["finance", "people operations"].includes(
        team.toLowerCase(),
      )
        ? sakshi || hrManager || root
        : hrManager || root;
      if (included.has(teamId)) {
        addRow(teamPerson, getNodeId(teamParent), true);
      }
      const lead = leadByTeam.get(team);
      members.forEach((person) => {
        const parentId = lead && lead !== person ? getPersonId(lead) : teamId;
        addRow(person, parentId);
      });
    });

    chartStatus.textContent =
      search && matches.size === 0
        ? "No employees match that search."
        : `${people.length} employees · ${teamGroups.size} teams`;
    const data = new google.visualization.DataTable();
    data.addColumn("string", "Name");
    data.addColumn("string", "Reports to");
    data.addColumn("string", "Position");
    data.addRows(rows);
    currentChartData = data;
    if (!organizationChart) {
      organizationChart = new google.visualization.OrgChart(chartCanvas);
      google.visualization.events.addListener(
        organizationChart,
        "select",
        () => {
          const selection = organizationChart.getSelection()[0];
          const person = selection
            ? chartPeople.get(currentChartData.getValue(selection.row, 0))
            : null;
          if (person) {
            showChartProfile(person);
          }
        },
      );
    }
    organizationChart.draw(data, {
      allowHtml: true,
      allowCollapse: true,
      size: "small",
      nodeClass: "org-chart-google-node",
    });
  }

  function showChartProfile(person) {
    const initials = person.name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const avatar = orgChartView.querySelector("[data-org-chart-avatar]");
    const photo = /^data:image\/(png|jpeg|webp|gif);base64,/i.test(
      person.photo || "",
    );
    if (photo) {
      const image = document.createElement("img");
      image.src = person.photo;
      image.alt = `${person.name} profile photo`;
      avatar.replaceChildren(image);
    } else {
      avatar.textContent = initials;
    }
    orgChartView.querySelector("[data-org-chart-name]").textContent =
      person.name;
    orgChartView.querySelector("[data-org-chart-role]").textContent =
      person.role || "Position not provided";
    orgChartView.querySelector("[data-org-chart-team]").textContent =
      person.team || "Not provided";
    const email = orgChartView.querySelector("[data-org-chart-email]");
    email.replaceChildren();
    if (person.email) {
      const emailLink = document.createElement("a");
      emailLink.href = `mailto:${person.email}`;
      emailLink.textContent = person.email;
      email.append(emailLink);
    } else {
      email.textContent = "Not provided";
    }
    const phone = orgChartView.querySelector("[data-org-chart-phone]");
    phone.replaceChildren();
    if (person.contact) {
      const phoneLink = document.createElement("a");
      phoneLink.href = `tel:${person.contact.replace(/[^+\d]/g, "")}`;
      phoneLink.textContent = person.contact;
      phone.append(phoneLink);
    } else {
      phone.textContent = "Not provided";
    }
    orgChartView.querySelector("[data-org-chart-location]").textContent =
      person.location || "Not provided";
    chartDialog.showModal();
  }

  chartSearch.addEventListener("input", drawOrganizationChart);
  orgChartView
    .querySelector("[data-org-chart-close]")
    .addEventListener("click", () => chartDialog.close());
  window.addEventListener("resize", () => {
    if (!orgChartView.hidden) {
      drawOrganizationChart();
    }
  });
  window.refreshOrgChart = drawOrganizationChart;
  drawOrganizationChart();
}
