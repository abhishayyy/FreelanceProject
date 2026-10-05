import { userById } from "../utils/storage";
function ProjectCard({ project, children }) { const client = userById(project.clientId); return <article className="card project-card"><div className="card-top"><span className="tag">{project.category}</span><span className={`status ${project.status}`}>{project.status}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="project-meta"><span>₹{project.budget}</span><span>{project.skills}</span><span>By {client?.name || "Client"}</span></div>{children}</article>; }
export default ProjectCard;
