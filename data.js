// The ONE data file. Edit a value here, commit it, reload the page.
// (A .js file rather than .json so the page also works when opened straight
// from a folder with no server: browsers block loading JSON from a local folder.)
// tile state: "not-started" | "in-progress" | "done"
window.BAKERY_DATA = {
  bakeryName: "Corner Loaf Bakery",
  headline: "Fresh bread every morning",
  hours: null,
  version: null,
  tiles: [
    { id: 1, title: "Start on localhost", state: "done" },
    { id: 2, title: "First commit", state: "done" },
    { id: 3, title: "Push to GitHub", state: "done" },
    { id: 4, title: "Branch and pull request", state: "in-progress" },
    { id: 5, title: "Merge", state: "not-started" },
    { id: 6, title: "Protect main", state: "not-started" },
    { id: 7, title: "Tag v1.0.0", state: "not-started" },
    { id: 8, title: "Release v1.1.0 with a typo", state: "not-started" },
    { id: 9, title: "Revert", state: "not-started" },
    { id: 10, title: "Release v1.1.1", state: "not-started" },
    { id: 11, title: "Settings file and .gitignore", state: "not-started" },
    { id: 12, title: "AI change on a branch", state: "not-started" }
  ]
};
