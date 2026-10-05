import { Link } from "react-router-dom";
function Home() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="eyebrow">FREELANCE MARKETPLACE</span>
        <h1>Find the right talent for your next project.</h1>
        <p>Connect with skilled freelancers and get your work done.</p>

        <div className="hero-buttons">
          <Link className="button" to="/signup">Find Freelancers</Link>
          <Link className="button outline" to="/signup">Find Work</Link>
        </div>
      </div>
    </section>
  );
}
export default Home;
