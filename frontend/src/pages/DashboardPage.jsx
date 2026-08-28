import "./DashboardPage.css";
import '../App.css';

function DashboardPage() {
    const summaryItems = [
        {
            id: 1,
            title: "Active Conditions",
            value: 3,
        },
        {
            id: 2,
            title: "Current Medications",
            value: 5,
        },
        {
            id: 3,
            title: "Known Allergies",
            value: 1,
        },
        {
            id: 4,
            title: "Clinical Notes",
            value: 8,
        },
    ];

    const recentNotes = [
        {
            id: 1,
            title: "Renal clinic letter",
            uploadDate: "25 August 2026",
            status: "Reviewed",
        },
        {
            id: 2,
            title: "GP appointment notes",
            uploadDate: "20 August 2026",
            status: "Needs review",
        },
        {
            id: 3,
            title: "Hospital discharge summary",
            uploadDate: "14 August 2026",
            status: "Reviewed",
        },
    ];

    return (
        <main className="dashboard-page">
            <section className="dashboard-heading">
                <div>
                    <p className="dashboard-eyebrow">Patient dashboard</p>
                    <h1>Welcome back</h1>
                    <p>Here is an overview of your health information.</p>
                </div>
            </section>

            <section className="summary-section">
                <h2>Health summary</h2>

                <div className="summary-grid">
                    {summaryItems.map((item) => (
                        <article className="summary-card" key={item.id}>
                            <p className="summary-card-title">{item.title}</p>
                            <p className="summary-card-value">{item.value}</p>
                            <button className="summary-card-link">
                                View details
                            </button>
                        </article>
                    ))}
                </div>
            </section>

            <section className="result" aria-live="polite">
                <h2>Recent clinical notes:</h2>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Clinical Note</th>
                                <th>Upload Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentNotes.map((note) => (
                                <tr key={note.id}>
                                    <td>{note.title}</td>
                                    <td>{note.uploadDate}</td>
                                    <td>
                                        <span
                                            className={
                                                note.status === "Reviewed"
                                                    ? "status status-reviewed"
                                                    : "status status-needs-review"
                                            }
                                        >
                                            {note.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="view-note-button">
                                            {note.status === "Reviewed" ? "View" : "Review"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="quick-actions">
                <h2>Quick actions</h2>
                <div className="quick-actions-buttons">
                    <button type="button" className="quick-action-button">
                        Upload clinical notes
                    </button>
                    <button type="button" className="quick-action-button">
                        Review extracted summaries
                    </button>
                    <button type="button" className="quick-action-button">
                        View health record
                    </button>
                </div>
            </section>
        </main>
    );
}

export default DashboardPage