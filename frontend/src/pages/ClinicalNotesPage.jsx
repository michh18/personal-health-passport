import { useState } from 'react';
import DashboardNav from '../components/DashboardNav';
import './css/ClinicalNotesPage.css';
import '../styles/AuthenticatedPages.css';

const API_BASE_URL = 'https://localhost:7226';

function authHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function ClinicalNotesPage() {
    const [mytxt, setMytxt] = useState("");
    const [entities, setEntities] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        const notes = mytxt.trim();
        if (!notes) {
            setError('Please enter some clinical notes.');
            setEntities(null);
            return;
        }

        setIsLoading(true);
        setError('');
        setEntities(null);

        try {
            const response = await fetch(`${API_BASE_URL}/nlp/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders(),
                },
                body: JSON.stringify(notes),
            });

            if (response.status === 401) {
                throw new Error('Your session has expired. Please log in again.');
            }

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || `Request failed (${response.status}).`);
            }

            const result = await response.json();
            setEntities(result.entities ?? []);
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

    async function handleDelete(entity) {
        const previous = entities;
        setEntities((current) => current.filter((e) => e.id !== entity.id));

        try {
            const response = await fetch(`${API_BASE_URL}/nlp/${entity.id}`, {
                method: 'DELETE',
                headers: authHeaders(),
            });

            if (!response.ok) {
                throw new Error('Could not delete this entry.');
            }
        }
        catch (requestError) {
            setEntities(previous);
            setError(requestError.message);
        }
    }

    async function handleSaveEdit(entity, editedValues) {
        const updatedEntity = { ...entity, ...editedValues };

        try {
            const response = await fetch(`${API_BASE_URL}/nlp/${entity.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders(),
                },
                body: JSON.stringify(updatedEntity),
            });

            if (!response.ok) {
                throw new Error('Could not save changes to this entry.');
            }

            const saved = await response.json();
            setEntities((current) =>
                current.map((e) => (e.id === entity.id ? saved : e))
            );
            return true;
        }
        catch (requestError) {
            setError(requestError.message);
            return false;
        }
    }

    return (
        <div className="authenticated-layout">
            <DashboardNav />
            <main className="authenticated-main clinical-notes-main">
                <section id="clinical-notes-heading">
                    <div>
                        <p className="page-label">Clinical notes</p>
                        <h1>Upload clinical notes</h1>
                        <p>
                            Enter a clinical note to identify and organise important health information.
                        </p>
                    </div>
                </section>

                <section id="clinical-notes-content">
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

                    {entities && (
                        <section className="result" aria-live="polite">
                            <h2>Clinical entities</h2>
                            <p className="review-note">
                                These have already been added to your record. Review
                                them below — edit anything that's wrong, or remove
                                entries that don't belong.
                            </p>

                            {entities.length > 0 ? (
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
                                            {entities.map((entity, index) => (
                                                <EntityRow
                                                    key={entity.id ?? entity.uid ?? `${entity.entity}-${index}`}
                                                    entity={entity}
                                                    onDelete={() => handleDelete(entity)}
                                                    onSave={(values) => handleSaveEdit(entity, values)}
                                                />
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

function EntityRow({ entity, onDelete, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState({
        entity: entity.entity || '',
        canonical: entity.canonical || '',
    });
    const [isSaving, setIsSaving] = useState(false);

    function startEdit() {
        setDraft({ entity: entity.entity || '', canonical: entity.canonical || '' });
        setIsEditing(true);
    }

    async function confirmSave() {
        setIsSaving(true);
        const success = await onSave(draft);
        setIsSaving(false);
        if (success) setIsEditing(false);
    }

    if (isEditing) {
        return (
            <tr className="editing-row">
                <td>
                    <input
                        value={draft.entity}
                        onChange={(e) => setDraft((d) => ({ ...d, entity: e.target.value }))}
                        aria-label="Entity text"
                    />
                </td>
                <td>
                    <input
                        value={draft.canonical}
                        onChange={(e) => setDraft((d) => ({ ...d, canonical: e.target.value }))}
                        aria-label="Canonical term"
                    />
                </td>
                <td>{entity.assertion || '—'}</td>
                <td>{entity.trend || '—'}</td>
                <td>{entity.action || '—'}</td>
                <td>{entity.cui || '—'}</td>
                <td className="entity-actions">
                    <button
                        type="button"
                        className="save-button"
                        onClick={confirmSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                </td>
            </tr>
        );
    }

    return (
        <tr>
            <td>{entity.entity || '—'}</td>
            <td>{entity.canonical || '—'}</td>
            <td>{entity.assertion || '—'}</td>
            <td>{entity.trend || '—'}</td>
            <td>{entity.action || '—'}</td>
            <td>{entity.cui || '—'}</td>
            <td className="entity-actions">
                <button type="button" className="edit-button" onClick={startEdit}>
                    Edit
                </button>
                <button type="button" className="delete-button" onClick={onDelete}>
                    Delete
                </button>
            </td>
        </tr>
    );
}

export default ClinicalNotesPage