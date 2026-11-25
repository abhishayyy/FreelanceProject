import { useState } from "react";
import {
  HashRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

// All app data, authentication, role portals, and routing live in this file.
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
    name: "Client",
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
  {
    id: "project-1",
    clientId: "client-1",
    title: "Portfolio Website",
    description: "Build a responsive portfolio website for a design studio.",
    category: "Web Development",
    budget: 25000,
    skills: "React, CSS, JavaScript",
    deadline: "2026-12-20",
    status: "open",
  },
  {
    id: "project-2",
    clientId: "client-1",
    title: "Social Media Graphics",
    description: "Create launch graphics for a small brand.",
    category: "Design",
    budget: 12000,
    skills: "Figma, Canva",
    deadline: "2026-12-15",
    status: "in-progress",
  },
];
const demoProposals = [
  {
    id: "proposal-1",
    projectId: "project-2",
    freelancerId: "freelancer-1",
    bid: 11000,
    deliveryTime: "5 days",
    coverLetter: "I can create a polished visual system for your launch.",
    status: "accepted",
  },
];
const read = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const seed = () => {
  const users = read("users");
  save("users", [
    ...users.filter(
      (user) => !demoUsers.some((demo) => demo.email === user.email),
    ),
    ...demoUsers,
  ]);
  if (!localStorage.getItem("projects")) save("projects", demoProjects);
  if (!localStorage.getItem("proposals")) save("proposals", demoProposals);
};
const users = () => read("users"),
  projects = () => read("projects"),
  proposals = () => read("proposals");
const currentUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("currentUser"));
  } catch {
    return null;
  }
};
const setUser = (user) =>
  sessionStorage.setItem("currentUser", JSON.stringify(user));
const person = (id) => users().find((user) => user.id === id);

function Navbar() {
  return (
    <nav className="navbar">
      <Link className="brand" to="/">
        FreelanceHub
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link className="button small" to="/signup">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
function Guard({ role, children }) {
  return currentUser()?.role === role ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}
const links = {
  admin: [["/admin", "Dashboard"]],
  client: [
    ["/client", "Overview"],
    ["/client/post-project", "Post Project"],
    ["/client/projects", "My Projects"],
    ["/client/proposals", "Proposals"],
  ],
  freelancer: [
    ["/freelancer", "Overview"],
    ["/freelancer/projects", "Browse Projects"],
    ["/freelancer/proposals", "My Proposals"],
    ["/freelancer/profile", "My Profile"],
  ],
};
function Layout({ children }) {
  const user = currentUser();
  const nav = useNavigate();
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Link className="brand" to="/">
          FreelanceHub
        </Link>
        <p className="role-label">{user.role} portal</p>
        <nav>
          {links[user.role].map(([to, label]) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <strong>{user.name}</strong>
          <button
            className="text-button"
            onClick={() => {
              sessionStorage.removeItem("currentUser");
              nav("/login");
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
function Card({ project, children }) {
  return (
    <article className="card project-card">
      <div className="card-top">
        <span className="tag">{project.category}</span>
        <span className={`status ${project.status}`}>{project.status}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="project-meta">
        <span>₹{project.budget}</span>
        <span>{project.skills}</span>
        <span>By {person(project.clientId)?.name || "Client"}</span>
      </div>
      {children}
    </article>
  );
}

function Home() {
  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">FREELANCE MARKETPLACE</span>
          <h1>Find the right talent for your next project.</h1>
          <p>Connect with skilled freelancers and get your work done.</p>
          <div className="hero-buttons">
            <Link className="button" to="/signup">
              Find Freelancers
            </Link>
            <Link className="button outline" to="/signup">
              Find Work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const nav = useNavigate();
  seed();
  function submit(e) {
    e.preventDefault();
    seed();
    const email = form.email.trim().toLowerCase(),
      password = form.password.trim();
    if (!email || !password)
      return setError("Please enter email and password.");
    const user = users().find(
      (item) =>
        item.email.toLowerCase() === email && item.password === password,
    );
    if (!user)
      return setError(
        "Incorrect email or password. Use your existing account details or create an account.",
      );
    setUser(user);
    nav(`/${user.role}`);
  }
  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Link className="brand" to="/">
          FreelanceHub
        </Link>
        <h1>Welcome back</h1>
        <p>Login to manage your marketplace activity.</p>
        {error && <p className="error">{error}</p>}
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <button>Login</button>
        <p>
          New to FreelanceHub? <Link to="/signup">Create an account</Link>
        </p>
        <small>Demo: admin@freelancehub.com / admin123</small>
      </form>
    </div>
  );
}
function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });
  const [error, setError] = useState("");
  const nav = useNavigate();
  seed();
  function submit(e) {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();
    if (Object.values(form).some((value) => !value))
      return setError("Please complete all fields.");
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setError("Enter a valid email address.");
    if (users().some((user) => user.email.toLowerCase() === email))
      return setError("An account with this email already exists.");
    save("users", [...users(), { ...form, email, id: `user-${Date.now()}` }]);
    nav("/login");
  }
  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Link className="brand" to="/">
          FreelanceHub
        </Link>
        <h1>Create account</h1>
        {error && <p className="error">{error}</p>}
        <label>
          Name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <label>
          Role
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </label>
        <button>Create account</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

function ClientDashboard() {
  const user = currentUser(),
    mine = projects().filter((project) => project.clientId === user.id),
    count = (status) =>
      mine.filter((project) => project.status === status).length;
  return (
    <Layout>
      <header className="page-header">
        <div>
          <p className="eyebrow">CLIENT DASHBOARD</p>
          <h1>Welcome, {user.name}</h1>
        </div>
        <Link className="button" to="/client/post-project">
          Post a project
        </Link>
      </header>
      <div className="stats-grid">
        <article>
          <b>{mine.length}</b>
          <span>Projects posted</span>
        </article>
        <article>
          <b>{count("open") + count("in-progress")}</b>
          <span>Active projects</span>
        </article>
        <article>
          <b>{count("completed")}</b>
          <span>Completed projects</span>
        </article>
      </div>
      <h2>Recent projects</h2>
      <div className="card-grid">
        {mine.slice(0, 3).map((project) => (
          <Card key={project.id} project={project} />
        ))}
      </div>
    </Layout>
  );
}
function PostProject() {
  const [form, setForm] = useState({
      title: "",
      description: "",
      category: "Web Development",
      budget: "",
      skills: "",
      deadline: "",
    }),
    [error, setError] = useState("");
  const nav = useNavigate();
  function submit(e) {
    e.preventDefault();
    if (Object.values(form).some((value) => !value) || Number(form.budget) <= 0)
      return setError("Complete every field and enter a valid budget.");
    save("projects", [
      ...projects(),
      {
        ...form,
        id: `project-${Date.now()}`,
        clientId: currentUser().id,
        budget: Number(form.budget),
        status: "open",
      },
    ]);
    nav("/client/projects");
  }
  return (
    <Layout>
      <header className="page-header">
        <div>
          <p className="eyebrow">CLIENT PORTAL</p>
          <h1>Post a project</h1>
        </div>
      </header>
      <form className="form-card" onSubmit={submit}>
        {error && <p className="error">{error}</p>}
        <label>
          Project title
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <div className="form-row">
          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>Web Development</option>
              <option>Design</option>
              <option>Writing</option>
            </select>
          </label>
          <label>
            Budget (₹)
            <input
              type="number"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            />
          </label>
        </div>
        <label>
          Required skills
          <input
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
        </label>
        <label>
          Deadline
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
        </label>
        <button>Publish project</button>
      </form>
    </Layout>
  );
}
function ClientProjects() {
  const mine = projects().filter(
    (project) => project.clientId === currentUser().id,
  );
  return (
    <Layout>
      <header className="page-header">
        <div>
          <p className="eyebrow">CLIENT PORTAL</p>
          <h1>My projects</h1>
        </div>
      </header>
      <div className="card-grid">
        {mine.length ? (
          mine.map((project) => <Card key={project.id} project={project} />)
        ) : (
          <p>No projects yet.</p>
        )}
      </div>
    </Layout>
  );
}
function ClientProposals() {
  const [, updateView] = useState(0),
    mine = projects().filter(
      (project) => project.clientId === currentUser().id,
    ),
    received = proposals().filter((proposal) =>
      mine.some((project) => project.id === proposal.projectId),
    );
  function update(proposal, status) {
    let all = proposals().map((item) =>
      item.id === proposal.id ? { ...item, status } : item,
    );
    if (status === "accepted") {
      all = all.map((item) =>
        item.projectId === proposal.projectId && item.id !== proposal.id
          ? { ...item, status: "rejected" }
          : item,
      );
      save(
        "projects",
        projects().map((project) =>
          project.id === proposal.projectId
            ? { ...project, status: "in-progress" }
            : project,
        ),
      );
    }
    save("proposals", all);
    updateView((value) => value + 1);
  }
  return (
    <Layout>
      <header className="page-header">
        <div>
          <p className="eyebrow">CLIENT PORTAL</p>
          <h1>Proposals received</h1>
        </div>
      </header>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Freelancer</th>
              <th>Bid</th>
              <th>Delivery</th>
              <th>Cover letter</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {received.map((proposal) => (
              <tr key={proposal.id}>
                <td>
                  {
                    mine.find((project) => project.id === proposal.projectId)
                      ?.title
                  }
                </td>
                <td>{person(proposal.freelancerId)?.name}</td>
                <td>₹{proposal.bid}</td>
                <td>{proposal.deliveryTime}</td>
                <td>{proposal.coverLetter}</td>
                <td>
                  <span className={`status ${proposal.status}`}>
                    {proposal.status}
                  </span>
                </td>
                <td>
                  {proposal.status === "pending" && (
                    <>
                      <button onClick={() => update(proposal, "accepted")}>
                        Accept
                      </button>
                      <button
                        className="danger"
                        onClick={() => update(proposal, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!received.length && <p>No proposals received yet.</p>}
      </div>
    </Layout>
  );
}

function FreelancerDashboard() {
  const user = currentUser(),
    mine = proposals().filter((proposal) => proposal.freelancerId === user.id),
    count = (status) =>
      mine.filter((proposal) => proposal.status === status).length;
  return (
    <Layout>
      <header className="page-header">
        <div>
          <p className="eyebrow">FREELANCER DASHBOARD</p>
          <h1>Hello, {user.name}</h1>
        </div>
        <Link className="button" to="/freelancer/projects">
          Browse projects
        </Link>
      </header>
      <div className="stats-grid">
        <article>
          <b>{mine.length}</b>
          <span>Proposals sent</span>
        </article>
        <article>
          <b>{count("pending")}</b>
          <span>Pending proposals</span>
        </article>
        <article>
          <b>{count("accepted")}</b>
          <span>Accepted projects</span>
        </article>
        <article>
          <b>0</b>
          <span>Completed projects</span>
        </article>
      </div>
      <h2>Recent proposals</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Bid</th>
              <th>Delivery time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mine.map((proposal) => (
              <tr key={proposal.id}>
                <td>₹{proposal.bid}</td>
                <td>{proposal.deliveryTime}</td>
                <td>
                  <span className={`status ${proposal.status}`}>
                    {proposal.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
function BrowseProjects() {
  const [search, setSearch] = useState(""),
    [open, setOpen] = useState(null),
    [form, setForm] = useState({ bid: "", deliveryTime: "", coverLetter: "" }),
    [message, setMessage] = useState("");
  const available = projects().filter(
    (project) =>
      project.status === "open" &&
      project.title.toLowerCase().includes(search.toLowerCase()),
  );
  function submit(e) {
    e.preventDefault();
    if (
      !form.bid ||
      Number(form.bid) <= 0 ||
      !form.deliveryTime ||
      !form.coverLetter
    )
      return setMessage("Complete all proposal fields.");
    if (
      proposals().some(
        (proposal) =>
          proposal.projectId === open.id &&
          proposal.freelancerId === currentUser().id,
      )
    )
      return setMessage("You already submitted a proposal for this project.");
    save("proposals", [
      ...proposals(),
      {
        ...form,
        bid: Number(form.bid),
        id: `proposal-${Date.now()}`,
        projectId: open.id,
        freelancerId: currentUser().id,
        status: "pending",
      },
    ]);
    setMessage("Proposal submitted successfully.");
    setOpen(null);
  }
  return (
    <Layout>
      <header className="page-header">
        <div>
          <p className="eyebrow">FREELANCER PORTAL</p>
          <h1>Browse open projects</h1>
        </div>
      </header>
      <input
        className="search"
        placeholder="Search by project title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {message && <p className="success">{message}</p>}
      <div className="card-grid">
        {available.map((project) => (
          <Card key={project.id} project={project}>
            <button onClick={() => setOpen(project)}>Submit proposal</button>
          </Card>
        ))}
      </div>
      {open && (
        <div className="modal">
          <form className="form-card" onSubmit={submit}>
            <h2>Proposal for {open.title}</h2>
            <label>
              Bid amount (₹)
              <input
                type="number"
                value={form.bid}
                onChange={(e) => setForm({ ...form, bid: e.target.value })}
              />
            </label>
            <label>
              Estimated delivery time
              <input
                value={form.deliveryTime}
                onChange={(e) =>
                  setForm({ ...form, deliveryTime: e.target.value })
                }
                placeholder="e.g. 5 days"
              />
            </label>
            <label>
              Cover letter
              <textarea
                value={form.coverLetter}
                onChange={(e) =>
                  setForm({ ...form, coverLetter: e.target.value })
                }
              />
            </label>
            <button>Send proposal</button>
            <button
              type="button"
              className="danger"
              onClick={() => setOpen(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </Layout>
  );
}
function FreelancerProposals() {
  const allProjects = projects(),
    mine = proposals().filter(
      (proposal) => proposal.freelancerId === currentUser().id,
    );
  return (
    <Layout>
      <header className="page-header">
        <div>
          <p className="eyebrow">FREELANCER PORTAL</p>
          <h1>My proposals</h1>
        </div>
      </header>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Bid</th>
              <th>Delivery time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mine.map((proposal) => (
              <tr key={proposal.id}>
                <td>
                  {
                    allProjects.find(
                      (project) => project.id === proposal.projectId,
                    )?.title
                  }
                </td>
                <td>₹{proposal.bid}</td>
                <td>{proposal.deliveryTime}</td>
                <td>
                  <span className={`status ${proposal.status}`}>
                    {proposal.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
function FreelancerProfile() {
  const user = currentUser(),
    key = `profile-${user.id}`;
  const [form, setForm] = useState(() => {
      try {
        return (
          JSON.parse(localStorage.getItem(key)) || {
            bio: "",
            skills: "",
            experience: "",
            portfolio: "",
          }
        );
      } catch {
        return { bio: "", skills: "", experience: "", portfolio: "" };
      }
    }),
    [saved, setSaved] = useState(false);
  return (
    <Layout>
      <header className="page-header">
        <div>
          <p className="eyebrow">FREELANCER PORTAL</p>
          <h1>My profile</h1>
        </div>
      </header>
      <form
        className="form-card"
        onSubmit={(e) => {
          e.preventDefault();
          localStorage.setItem(key, JSON.stringify(form));
          setSaved(true);
        }}
      >
        {saved && <p className="success">Profile saved.</p>}
        <label>
          Bio
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </label>
        <label>
          Skills
          <input
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
        </label>
        <label>
          Experience
          <input
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />
        </label>
        <label>
          Portfolio link
          <input
            value={form.portfolio}
            onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
          />
        </label>
        <button>Save profile</button>
      </form>
    </Layout>
  );
}

function AdminDashboard() {
  const [, updateView] = useState(0),
    allUsers = users(),
    allProjects = projects(),
    allProposals = proposals(),
    stat = (label, value) => (
      <article key={label}>
        <b>{value}</b>
        <span>{label}</span>
      </article>
    );
  const removeUser = (id) => {
    if (window.confirm("Remove this user?")) {
      save(
        "users",
        allUsers.filter((user) => user.id !== id),
      );
      updateView((value) => value + 1);
    }
  };
  const removeProject = (id) => {
    if (window.confirm("Remove this project?")) {
      save(
        "projects",
        allProjects.filter((project) => project.id !== id),
      );
      updateView((value) => value + 1);
    }
  };
  return (
    <Layout>
      <header className="page-header">
        <div>
          <p className="eyebrow">ADMIN PORTAL</p>
          <h1>Platform dashboard</h1>
        </div>
      </header>
      <div className="stats-grid">
        {[
          stat("Total users", allUsers.length),
          stat(
            "Clients",
            allUsers.filter((user) => user.role === "client").length,
          ),
          stat(
            "Freelancers",
            allUsers.filter((user) => user.role === "freelancer").length,
          ),
          stat("Projects", allProjects.length),
          stat(
            "Open projects",
            allProjects.filter((project) => project.status === "open").length,
          ),
          stat(
            "Active projects",
            allProjects.filter((project) => project.status === "in-progress")
              .length,
          ),
          stat(
            "Completed projects",
            allProjects.filter((project) => project.status === "completed")
              .length,
          ),
          stat("Proposals", allProposals.length),
        ]}
      </div>
      <h2>Users</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role !== "admin" && (
                    <button
                      className="danger"
                      onClick={() => removeUser(user.id)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Projects</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Budget</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {allProjects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.status}</td>
                <td>₹{project.budget}</td>
                <td>
                  <button
                    className="danger"
                    onClick={() => removeProject(project.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Proposals</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Freelancer</th>
              <th>Bid</th>
              <th>Delivery</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allProposals.map((proposal) => (
              <tr key={proposal.id}>
                <td>
                  {
                    allUsers.find((user) => user.id === proposal.freelancerId)
                      ?.name
                  }
                </td>
                <td>₹{proposal.bid}</td>
                <td>{proposal.deliveryTime}</td>
                <td>{proposal.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/client"
          element={
            <Guard role="client">
              <ClientDashboard />
            </Guard>
          }
        />
        <Route
          path="/client/post-project"
          element={
            <Guard role="client">
              <PostProject />
            </Guard>
          }
        />
        <Route
          path="/client/projects"
          element={
            <Guard role="client">
              <ClientProjects />
            </Guard>
          }
        />
        <Route
          path="/client/proposals"
          element={
            <Guard role="client">
              <ClientProposals />
            </Guard>
          }
        />
        <Route
          path="/freelancer"
          element={
            <Guard role="freelancer">
              <FreelancerDashboard />
            </Guard>
          }
        />
        <Route
          path="/freelancer/projects"
          element={
            <Guard role="freelancer">
              <BrowseProjects />
            </Guard>
          }
        />
        <Route
          path="/freelancer/proposals"
          element={
            <Guard role="freelancer">
              <FreelancerProposals />
            </Guard>
          }
        />
        <Route
          path="/freelancer/profile"
          element={
            <Guard role="freelancer">
              <FreelancerProfile />
            </Guard>
          }
        />
        <Route
          path="/admin"
          element={
            <Guard role="admin">
              <AdminDashboard />
            </Guard>
          }
        />
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}
