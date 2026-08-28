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

    return (
        <main className="dashboard-page">
            <section className="dashboard-heading">
                <div>
                    <p className="dashboard-eyebrow">Patient dashboard</p>
                    <h1>Welcome back</h1>
                    <p>Here is an overview of your health information.</p>
                </div>

                <button className="upload-notes-button">
                Upload clinical notes
                </button>
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
        </main>
    );
}

export default DashboardPage