import "./css/HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
      <header className="navbar">
        <h1 className="logo">Personal Health Passport</h1>

        <nav>
          <a href="#how-it-works">How it works</a>
          <a href="/upload">Upload Notes</a>
          <button className="login-button">Log in</button>
          <button className="register-button">Register</button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">Your personal health record</p>

            <h2>Your health information, organised in one place</h2>

            <p className="hero-description">
              Upload clinical notes and turn complex medical information into a
              clear, structured health record.
            </p>

            <div className="hero-actions">
              <button className="primary-button">Create an account</button>
              <button className="secondary-button">Log in</button>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="how-it-works">
          <h2>How it works</h2>

          <div className="steps">
            <article className="step-card">
              <span>1</span>
              <h3>Upload your notes</h3>
              <p>Paste or upload your clinical notes securely.</p>
            </article>

            <article className="step-card">
              <span>2</span>
              <h3>Review the information</h3>
              <p>
                Check the conditions, medications and other clinical details
                identified from your notes.
              </p>
            </article>

            <article className="step-card">
              <span>3</span>
              <h3>Build your dashboard</h3>
              <p>Keep your health information organised in one place.</p>
            </article>
          </div>
        </section>

        <section className="disclaimer">
          <p>
            Personal Health Passport helps organise health information but does
            not provide medical advice or replace a healthcare professional.
            Always review automatically extracted information for accuracy.
          </p>
        </section>
      </main>

      <footer>
        <p>© 2026 Personal Health Passport</p>
      </footer>
    </div>
  );
}

export default HomePage;