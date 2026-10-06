import demoData from "../data/demoData.json";

const { users: demoUsers, projects: demoProjects, proposals: demoProposals, reviews: demoReviews } = demoData;

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const read = (key) => {
  try {
    const savedValue = localStorage.getItem(key);
    const parsedValue = savedValue ? JSON.parse(savedValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

// This keeps existing user-created accounts and restores the three demo users.
// A matching demo email is updated so the displayed test credentials always work.
const restoreDemoUsers = () => {
  const savedUsers = read("users");
  const otherUsers = savedUsers.filter(
    (savedUser) => !demoUsers.some((demoUser) => demoUser.email === savedUser.email),
  );

  write("users", [...otherUsers, ...demoUsers]);
};

export function initializeData() {
  restoreDemoUsers();

  if (!localStorage.getItem("projects")) write("projects", demoProjects);
  if (!localStorage.getItem("proposals")) write("proposals", demoProposals);
  if (!localStorage.getItem("reviews")) write("reviews", demoReviews);
}

export const getUsers = () => read("users");
export const getProjects = () => read("projects");
export const getProposals = () => read("proposals");
export const saveUsers = (items) => write("users", items);
export const saveProjects = (items) => write("projects", items);
export const saveProposals = (items) => write("proposals", items);

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser"));
  } catch {
    return null;
  }
};

export const setCurrentUser = (user) => localStorage.setItem("currentUser", JSON.stringify(user));
export const logout = () => localStorage.removeItem("currentUser");
export const userById = (id) => getUsers().find((user) => user.id === id);
