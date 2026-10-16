(() => {
  const dashboardMain = document.querySelector(".dashboard-main");
  const fragmentMount = document.querySelector("[data-dashboard-fragments]");

  if (!dashboardMain || !fragmentMount) {
    return;
  }

  const isManager = Boolean(document.querySelector(".manager-sidebar"));
  const fragments = isManager
    ? [
        ["organizational-chart-view", "organizational-chart.html"],
        ["tasks-view", "tasks.html"],
        ["work-log", "worklog.html"],
        ["meetings", "meetings.html"],
        ["employees-view", "employees.html"],
        ["teams-view", "teams.html"],
        ["attendance", "attendance.html"],
        ["leave-requests", "leaverequests.html"],
        ["performance-view", "performance.html"],
        ["feedback", "feedbackadmin.html"],
        ["resignation-queue", "resignationqueue.html"],
        ["notifications", "notification.html"],
      ]
    : [
        ["organizational-chart-view", "organizational-chart.html"],
        ["tasks-view", "tasks.html"],
        ["worklog", "work-log.html"],
        ["attendance", "attendance.html"],
        ["performance-view", "performance.html"],
        ["team-members-view", "team-members.html"],
        ["feedback", "feedback.html"],
        ["leaves", "leave.html"],
        ["profile", "profile.html"],
        ["notifications", "notifications.html"],
      ];

  function loadScript(source) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = source;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Unable to load ${source}.`));
      document.body.append(script);
    });
  }

  async function loadGoogleCharts() {
    await loadScript("https://www.gstatic.com/charts/loader.js");
    await new Promise((resolve) => {
      google.charts.load("current", { packages: ["corechart", "orgchart"] });
      google.charts.setOnLoadCallback(resolve);
    });
  }

  async function loadDashboard() {
    try {
      const loadedFragments = await Promise.all(
        fragments.map(async ([viewId, fileName]) => {
          const response = await fetch(new URL(fileName, window.location.href));
          if (!response.ok) {
            throw new Error(`Unable to load ${fileName} (${response.status}).`);
          }
          return [viewId, await response.text()];
        }),
      );

      loadedFragments.forEach(([viewId, html]) => {
        const template = document.createElement("template");
        template.innerHTML = html.trim();
        const root = template.content.firstElementChild;
        if (!root) {
          throw new Error(`The page fragment for ${viewId} is empty.`);
        }

        root.id = viewId;
        root.hidden = true;
        root.classList.add("dashboard-fragment-view");
        fragmentMount.append(template.content);
      });
    } catch (error) {
      console.error("Dashboard pages could not be loaded:", error);
      const message = document.createElement("p");
      message.className = "dashboard-load-error";
      message.setAttribute("role", "alert");
      message.textContent =
        "Some dashboard pages could not load. Open this project with a local web server, such as VS Code Live Server, and check the browser console.";
      fragmentMount.append(message);
    }

    const projectRoot = new URL("../", window.location.href);
    const router = isManager ? "hr-managerrouter.js" : "employeerouter.js";
    try {
      await loadScript(new URL("script.js/finalscript.js", projectRoot).href);
      await loadScript(
        new URL("script.js/organization-data.js", projectRoot).href,
      );
      await loadScript(new URL(`script.js/${router}`, projectRoot).href);
      try {
        await loadGoogleCharts();
      } catch (error) {
        console.error("Google Charts could not be loaded:", error);
      }
      await loadScript(
        new URL("script.js/dashboard-common.js", projectRoot).href,
      );
    } catch (error) {
      console.error("Dashboard scripts could not be loaded:", error);
      const message = document.createElement("p");
      message.className = "dashboard-load-error";
      message.setAttribute("role", "alert");
      message.textContent =
        "Dashboard behavior could not load. Check the browser console and confirm the project is served locally.";
      fragmentMount.append(message);
    }
  }

  loadDashboard();
})();
