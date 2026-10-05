const demoUsers = [
  {
    id: "admin-1",
    name: "Platform Admin",
    email: "admin@freelancehub.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "client-1",
    name: "Aarav Client",
    email: "client@gmail.com",
    password: "1234",
    role: "client",
  },
  {
    id: "freelancer-1",
    name: "Maya Freelancer",
    email: "freelancer@gmail.com",
    password: "1234",
    role: "freelancer",
  },
];

const demoProjects = [
  { id: "project-1", clientId: "client-1", title: "Portfolio Website", description: "Build a responsive portfolio website for a design studio.", category: "Web Development", budget: 25000, skills: "React, CSS, JavaScript", deadline: "2026-12-20", status: "open" },
  { id: "project-2", clientId: "client-1", title: "Social Media Graphics", description: "Create launch graphics for a small brand.", category: "Design", budget: 12000, skills: "Figma, Canva", deadline: "2026-12-15", status: "in-progress" },
];

const demoProposals = [
  { id: "proposal-1", projectId: "project-2", freelancerId: "freelancer-1", bid: 11000, deliveryTime: "5 days", coverLetter: "I can create a polished visual system for your launch.", status: "accepted" },
];

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
  if (!localStorage.getItem("reviews")) write("reviews", []);
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
