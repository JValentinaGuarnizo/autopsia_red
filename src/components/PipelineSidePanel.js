import React from "react";

export default function PipelineSidePanel({ step, isOpen, onClose, onPrev, onNext, totalSteps }) {
    if (!step) return null;

    return (
        <div
            className={`side-panel-overlay ${isOpen ? "open" : ""}`}
            onClick={onClose}
            aria-hidden={!isOpen}
        >
            <div
                className="side-panel"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="step-title"
            >
                <div className="side-panel-header">
                    <div className="step-tag-row">
                        {step.tags && step.tags.map(tag => (
                            <span key={tag} className="step-tag">{tag}</span>
                        ))}
                    </div>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        aria-label="Cerrar panel"
                    >
                        ×
                    </button>
                </div>

                <h2 id="step-title" className="step-title">{step.title}</h2>

                <div className="step-section-title">Objetivo</div>
                <p className="step-objective">{step.objective}</p>

                <div className="step-section-title">¿Qué se hizo?</div>
                <ul className="step-list">
                    {step.bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                    ))}
                </ul>

                {step.images && (
                    <div className="step-images">
                        {step.images.map((img, idx) => (
                            <div key={idx} className="step-image-container">
                                <img src={img.src} alt={img.alt} className="step-image" />
                                <p className="image-caption">{img.alt}</p>
                            </div>
                        ))}
                    </div>
                )}

                {step.metrics && (
                    <>
                        <div className="step-section-title">Resultados clave</div>
                        <div className="metrics-box">
                            <div className="metrics-grid">
                                {step.metrics.testAccuracy && (
                                    <div className="metric-item">
                                        <span className="metric-label">Test Accuracy</span>
                                        <span className="metric-value">{step.metrics.testAccuracy}</span>
                                    </div>
                                )}
                                {step.metrics.testRecall && (
                                    <div className="metric-item">
                                        <span className="metric-label">Test Recall</span>
                                        <span className="metric-value">{step.metrics.testRecall}</span>
                                    </div>
                                )}
                                {step.metrics.cvAccuracy && (
                                    <div className="metric-item">
                                        <span className="metric-label">CV Accuracy</span>
                                        <span className="metric-value">{step.metrics.cvAccuracy}</span>
                                    </div>
                                )}
                                {step.metrics.cvRecall && (
                                    <div className="metric-item">
                                        <span className="metric-label">CV Recall</span>
                                        <span className="metric-value">{step.metrics.cvRecall}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                <div className="panel-nav">
                    <button
                        className="nav-btn"
                        onClick={onPrev}
                        disabled={step.id <= 1}
                    >
                        ← Anterior
                    </button>
                    <button
                        className="nav-btn"
                        onClick={onNext}
                        disabled={step.id >= totalSteps}
                    >
                        Siguiente →
                    </button>
                </div>
            </div>
        </div>
    );
}
