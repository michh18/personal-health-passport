import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./css/DashboardPage.css";
import '../styles/AuthenticatedPages.css';
import DashboardNav from "../components/DashboardNav";

const API_BASE_URL = 'https://localhost:7226';
const USE_MOCK_DATA = true;

function authHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

const MOCK_ENTITIES = [
    {
        id: 1, uid: 'mock-user', entity: 'stable angina', trigger: 'stable',
        assertion: 'present', trend: 'stable', action: null,
        cui: 'C0002962', canonical: 'Angina, Stable', semanticCodes: 1 << 5,
        createdAt: '2026-09-18T09:20:00Z',
    },
    {
        id: 2, uid: 'mock-user', entity: 'aspirin 75mg', trigger: 'continued',
        assertion: 'present', trend: null, action: 'continued',
        cui: 'C0004057', canonical: 'Aspirin', semanticCodes: 1 << 17,
        createdAt: '2026-09-18T09:20:00Z',
    },
    {
        id: 3, uid: 'mock-user', entity: 'echocardiogram', trigger: 'unchanged',
        assertion: 'present', trend: 'stable', action: null,
        cui: 'C0013516', canonical: 'Echocardiography', semanticCodes: 1 << 21,
        createdAt: '2026-08-30T14:10:00Z',
    },
    {
        id: 4, uid: 'mock-user', entity: 'shortness of breath', trigger: 'worsening',
        assertion: 'present', trend: 'worsening', action: null,
        cui: 'C0013404', canonical: 'Dyspnea', semanticCodes: 1 << 5,
        createdAt: '2026-08-30T14:10:00Z',
    },
    {
        id: 5, uid: 'mock-user', entity: 'blood pressure', trigger: 'remains stable',
        assertion: 'present', trend: 'stable', action: null,
        cui: 'C0005823', canonical: 'Blood pressure finding', semanticCodes: 1 << 15,
        createdAt: '2026-08-11T11:47:00Z',
    },
    {
        id: 6, uid: 'mock-user', entity: 'infection', trigger: 'no evidence',
        assertion: 'absent', trend: null, action: null,
        cui: null, canonical: null, semanticCodes: 1 << 0,
        createdAt: '2026-08-11T11:47:00Z',
    },
];

const SEMANTIC_CODE_ORDER = [
    'T019', 'T020', 'T033', 'T037',
    'T046', 'T047', 'T048', 'T049',
    'T184', 'T190', 'T191',
    'T034',
    'T032', 'T039', 'T040', 'T042', 'T201',
    'T121', 'T195', 'T200',
    'T059', 'T060', 'T061',
];

const CATEGORY_RANGES = [
    { label: 'Conditions & findings', codes: SEMANTIC_CODE_ORDER.slice(0, 11) },
    { label: 'Test results', codes: SEMANTIC_CODE_ORDER.slice(11, 12) },
    { label: 'Clinical attributes', codes: SEMANTIC_CODE_ORDER.slice(12, 17) },
    { label: 'Medications', codes: SEMANTIC_CODE_ORDER.slice(17, 20) },
    { label: 'Procedures', codes: SEMANTIC_CODE_ORDER.slice(20, 23) },
];

function decodeSemanticCodes(bitmask) {
    if (!bitmask) return [];
    return SEMANTIC_CODE_ORDER.filter((_, index) => bitmask & (1 << index));
}

function primaryCategory(bitmask) {
    const codes = decodeSemanticCodes(bitmask);
    if (codes.length === 0) return 'Other';
    const match = CATEGORY_RANGES.find((cat) => cat.codes.some((c) => codes.includes(c)));
    return match ? match.label : 'Other';
}

function DashboardPage() {
    const [entities, setEntities] = useState(null);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        async function loadEntities() {
            if (USE_MOCK_DATA) {
                await new Promise((resolve) => setTimeout(resolve, 300)); 
                setEntities(MOCK_ENTITIES);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/nlp/user`, {
                    headers: authHeaders(),
                });

                if (response.status === 401) {
                    throw new Error('Your session has expired. Please log in again.');
                }

                if (!response.ok) {
                    throw new Error('Could not load your health record.');
                }

                setEntities(await response.json());
            }
            catch (requestError) {
                setError(requestError instanceof TypeError ? 'Could not connect to the API.' : requestError.message);
                setEntities([]);
            }
        }

        loadEntities();
    }, []);

    const summaryCounts = CATEGORY_RANGES.map((cat) => ({
        title: cat.label,
        value: (entities ?? []).filter((e) => primaryCategory(e.semanticCodes) === cat.label).length,
    }));

    const recent = (entities ?? [])
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

    return (
        <div className="authenticated-layout">
            <DashboardNav />
            <main className="authenticated-main dashboard-main">
                <section className="dashboard-heading">
                    <div>
                        <p className="dashboard-eyebrow">Patient dashboard</p>
                        <h1>Welcome back</h1>
                        <p>Here is an overview of your health information.</p>
                    </div>
                </section>

                {error && (
                    <p className="error" role="alert">
                        {error}
                    </p>
                )}

                <div className="dashboard-overview">
                <section className="summary-section">
                    <h2>Health summary</h2>

                    <div className="summary-grid">
                        {summaryCounts.map((item) => (
                            <article className="summary-card" key={item.title}>
                                <p className="summary-card-title">{item.title}</p>
                                <p className="summary-card-value">
                                    {entities === null ? '—' : item.value}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="recent-notes-section" aria-live="polite">
                    <h2>Recent entries</h2>

                    {entities === null && <p>Loading your record...</p>}

                    {entities !== null && entities.length === 0 && !error && (
                        <p>
                            Nothing here yet — <Link to="/upload">upload a clinical note</Link> to get started.
                        </p>
                    )}

                    <div className="entry-list">
                        {recent.map((entity) => {
                            const isExpanded = expandedId === entity.id;
                            return (
                                <article
                                    key={entity.id}
                                    className={`entry-row ${isExpanded ? 'entry-row-expanded' : ''}`}
                                >
                                    <button
                                        type="button"
                                        className="entry-row-summary"
                                        aria-expanded={isExpanded}
                                        onClick={() => setExpandedId(isExpanded ? null : entity.id)}
                                    >
                                        <span className="entry-category">
                                            {primaryCategory(entity.semanticCodes)}
                                        </span>
                                        <span className="entry-name">{entity.entity || 'Untitled entry'}</span>
                                        <span className="entry-date">
                                            {new Date(entity.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                        </span>
                                        <span className="entry-chevron" aria-hidden="true">
                                            {isExpanded ? '−' : '+'}
                                        </span>
                                    </button>

                                    {isExpanded && (
                                        <dl className="entry-details">
                                            <div>
                                                <dt>Canonical term</dt>
                                                <dd>{entity.canonical || '—'}</dd>
                                            </div>
                                            <div>
                                                <dt>Assertion</dt>
                                                <dd>{entity.assertion || '—'}</dd>
                                            </div>
                                            <div>
                                                <dt>Trend</dt>
                                                <dd>{entity.trend || '—'}</dd>
                                            </div>
                                            <div>
                                                <dt>Action</dt>
                                                <dd>{entity.action || '—'}</dd>
                                            </div>
                                            <div>
                                                <dt>Trigger phrase</dt>
                                                <dd>{entity.trigger || '—'}</dd>
                                            </div>
                                            <div>
                                                <dt>CUI</dt>
                                                <dd>{entity.cui || '—'}</dd>
                                            </div>
                                        </dl>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </section>
                </div>
            </main>
        </div>
    );
}

export default DashboardPage