// The ONE data file. Edit a value here, commit it, reload the page.
// (A .js file rather than .json so the page also works when opened straight
// from a folder with no server: browsers block loading JSON from a local folder.)
// tile state: "not-started" | "in-progress" | "done"
window.BAKERY_DATA = {
  bakeryName: "Corner Loaf Bakery",
  headline: "Fresh bread baked every morning",
  hours: null,
  version: "v1.1.1",
  tiles: [
    { id: 1, title: "Start on localhost", state: "done" },
    { id: 2, title: "First commit", state: "done" },
    { id: 3, title: "Push to GitHub", state: "done" },
    { id: 4, title: "Branch and pull request", state: "done" },
    { id: 5, title: "Merge", state: "done" },
    { id: 6, title: "Protect main", state: "done" },
    { id: 7, title: "Tag v1.0.0", state: "done" },
    { id: 8, title: "Release v1.1.0 with a typo", state: "done" },
    { id: 9, title: "Revert", state: "done" },
    { id: 10, title: "Release v1.1.1", state: "done" },
    { id: 11, title: "Settings file and .gitignore", state: "done" },
    { id: 12, title: "AI change on a branch", state: "done" }
  ]
};
