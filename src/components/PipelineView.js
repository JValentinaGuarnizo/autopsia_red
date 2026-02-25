import React, { useState, useEffect } from "react";
import PipelineDiagram from "./PipelineDiagram";
import PipelineSidePanel from "./PipelineSidePanel";
import { pipelineSteps } from "../data/pipelineSteps";

export default function PipelineView() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar cambios de tamaño para el modo responsivo
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 960);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleNodeClick = (id) => {
        setActiveIndex(id);
        setIsPanelOpen(true);
    };

    const handleNext = () => {
        if (activeIndex < pipelineSteps.length) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const handlePrev = () => {
        if (activeIndex > 1) {
            setActiveIndex(activeIndex - 1);
        }
    };

    const activeStep = pipelineSteps.find(s => s.id === activeIndex);

    return (
        <section className="section-surface" style={{ overflow: 'hidden' }}>
            <div className="pipeline-header">
                <h2 className="section-title">Pipeline de Entrenamiento MLP – Pima Indians Diabetes</h2>
                <p className="section-desc">
                    Cada nodo es un paso del pipeline; haz clic para ver detalles del proceso y decisiones.
                </p>
            </div>

            <PipelineDiagram
                steps={pipelineSteps}
                activeIndex={activeIndex}
                onNodeClick={handleNodeClick}
                isMobile={isMobile}
            />

            <PipelineSidePanel
                step={activeStep}
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onPrev={handlePrev}
                onNext={handleNext}
                totalSteps={pipelineSteps.length}
            />
        </section>
    );
}
