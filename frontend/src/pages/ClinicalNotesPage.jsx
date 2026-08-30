import { useState } from 'react';
import DashboardNav from '../components/DashboardNav';
import './css/ClinicalNotesPage.css';
import '../styles/AuthenticatedPages.css';

const API_BASE_URL = 'https://localhost:7226';

function ClinicalNotesPage() {
    const [mytxt, setMytxt] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        const notes = mytxt.trim();
        if (!notes) {
            setError('Please enter some clinical notes.');
            setResult(null);
            return;
        }

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch(`${API_BASE_URL}/nlp/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notes),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || `Request failed (${response.status}).`);
            }

            setResult(await response.json());
        }
        catch (requestError) {
            setError(
                requestError instanceof TypeError
                    ? 'Could not connect to the API. Check that the backend and NLP service are running.'
                    : requestError.message,
            );
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="authenticated-layout">
            <DashboardNav />
            <main className="authenticated-main">
                <section id="center">
                    <div>
                        <p className="page-label">Clinical notes</p>
                        <h1>Upload clinical notes</h1>
                        <p>
                            Enter a clinical note to identify and organise important
                            health information.
                        </p>
                    </div>
                </section>

                <section id="input-text">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="clinical-notes">
                            Enter your clinical notes:
                        </label>

                        <textarea
                            id="clinical-notes"
                            value={mytxt}
                            onChange={(e) => setMytxt(e.target.value)}
                            placeholder="Type or paste your clinical notes here..."
                            rows="8"
                        />

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Processing...' : 'Process notes'}
                        </button>
                    </form>

                    {error && (
                        <p className="error" role="alert">
                            {error}
                        </p>
                    )}

                    {result && (
                        <section className="result" aria-live="polite">
                            <h2>Clinical entities</h2>

                            {result.entities?.length > 0 ? (
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Entity</th>
                                                <th>Canonical term</th>
                                                <th>Assertion</th>
                                                <th>Trend</th>
                                                <th>Action</th>
                                                <th>CUI</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {result.entities.map((entity, index) => (
                                                <tr
                                                    key={
                                                        entity.id ||
                                                        entity.uid ||
                                                        `${entity.entity}-${index}`
                                                    }
                                                >
                                                    <td>{entity.entity || '—'}</td>
                                                    <td>{entity.canonical || '—'}</td>
                                                    <td>{entity.assertion || '—'}</td>
                                                    <td>{entity.trend || '—'}</td>
                                                    <td>{entity.action || '—'}</td>
                                                    <td>{entity.cui || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No clinical entities were found.</p>
                            )}
                        </section>
                    )}
                </section>
            </main>
        </div>
    );
}

export default ClinicalNotesPage