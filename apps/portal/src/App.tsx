import './App.css'

function App() {
  const openPortal = (portal: 'student' | 'recruiter' | 'government') => {
    const urls = {
      student: 'http://localhost:5174',
      recruiter: 'http://localhost:5175',
      government: 'http://localhost:5176',
    }

    window.location.href = urls[portal]
  }

  return (
    <div className="portal">
      <header className="navbar">
        <div className="logo">
          Hire<span>Zone</span>
        </div>

        <div className="nav-text">
          India's Talent & Opportunity Platform
        </div>
      </header>

      <main className="hero">
        <section className="hero-content">
          <p className="eyebrow">SMART INDIA HACKATHON</p>

          <h1>
            Connecting
            <br />
            <span>Talent, Industry & Government</span>
          </h1>

          <p className="description">
            HireZone brings students, recruiters and government authorities
            together on one intelligent platform to bridge the skill gap and
            create meaningful opportunities.
          </p>

          <div className="portal-grid">
            <button
              className="portal-card student"
              onClick={() => openPortal('student')}
            >
              <div className="card-icon">🎓</div>
              <div>
                <h2>Student Portal</h2>
                <p>Build your profile, showcase projects and discover opportunities.</p>
              </div>
              <span className="arrow">→</span>
            </button>

            <button
              className="portal-card recruiter"
              onClick={() => openPortal('recruiter')}
            >
              <div className="card-icon">💼</div>
              <div>
                <h2>Recruiter Portal</h2>
                <p>Discover verified talent based on skills, projects and challenges.</p>
              </div>
              <span className="arrow">→</span>
            </button>

            <button
              className="portal-card government"
              onClick={() => openPortal('government')}
            >
              <div className="card-icon">🏛️</div>
              <div>
                <h2>Government Portal</h2>
                <p>Analyze skill gaps and understand industry demand across regions.</p>
              </div>
              <span className="arrow">→</span>
            </button>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 HireZone • Smart India Hackathon</p>
      </footer>
    </div>
  )
}

export default App