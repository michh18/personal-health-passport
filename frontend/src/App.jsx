import { useState } from 'react';
import './App.css';

function App() {
  const [mytxt, setMytxt] = useState("");
  const [submittedText, setSubmittedText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setSubmittedText(mytxt);
  }

  return (
    <>
      <section id="center">
        <div>
          <h1>Personal Health Passport</h1>
          <p>
            A privacy-first Personal Health Passport that uses local AI to transform unstructured clinic letters into an organised, portable medical history.
          </p>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="input-text">
        <form onSubmit={handleSubmit}>
          <label htmlFor='clinical-notes'>
            Enter your clinical notes:
          </label>
          <textarea
            id="clinical-notes"
            value={mytxt}
            onChange={(e) => setMytxt(e.target.value)}
            placeholder="Type or paste your clinical notes here..."
            rows="8"
          />
          <button type="submit">Process notes</button>
        </form>

        {submittedText && (
          <section className="result">
            <h2>Submitted notes</h2>
            <p>{submittedText}</p>
          </section>
        )}
      </section>

      <section id="spacer"></section>
    </>
  )
}

export default App
