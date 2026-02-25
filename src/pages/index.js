import { useState } from 'react';
import RedInteractiva from '../components/RedInteractiva';
import RedInteractivaCapa2 from '../components/RedInteractivaCapa2';
import RedInteractivaSalida from '../components/RedInteractivaSalida';
import AnalisisActivaciones from "../components/2.1_AnalisisActivacion";
import AnalisisPesos from "../components/AnalisisPesos";
import AnalisisActivacionesPromedio from "../components/AnalisisActivacionesPromedio";
import AnalisisPesosAntesDespues from "../components/AnalisisPesosAntesDespues";
import PipelineView from "../components/PipelineView";

export default function Home() {
    const [view, setView] = useState('home');

    const renderHeader = () => (
        <header className="hero">
            <h1 className="hero-title">Autopsia de una Red Neuronal</h1>
            <p className="hero-subtitle">Visualización e Interpretación de Modelos de Inteligencia Artificial</p>
            <p className="hero-subtitle" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Juana Valentina Guarnizo, Jhon Ángel Castellanos
            </p>
        </header>
    );

    const renderHome = () => (
        <div className="view-switcher">
            <button className="big-btn" onClick={() => setView('radiografia')}>
                <div className="big-btn-icon">🧠</div>
                <h3 className="big-btn-title">Radiografía red neural</h3>
                <p className="big-btn-desc">Explora la arquitectura, pesos y activaciones en tiempo real.</p>
            </button>
            <button className="big-btn" onClick={() => setView('entrenando')}>
                <div className="big-btn-icon">🏗️</div>
                <h3 className="big-btn-title">Entrenando una mejor red</h3>
                <p className="big-btn-desc">Tubería de datos (pipeline) y decisiones del modelo de ML.</p>
            </button>
        </div>
    );

    const renderRadiografia = () => (
        <>
            <a className="back-link" onClick={() => setView('home')}>
                ← Volver al inicio
            </a>
            {/* Sección 1 */}
            <section className="section-surface">
                <h2 className="section-title">
                    1. Radiografía del script deep.py
                </h2>

                <p className="section-desc">
                    Visualización interactiva de la matriz de pesos entre la capa de entrada y la primera capa oculta.
                </p>

                <div className="viz-frame">
                    <RedInteractiva />
                </div>

                <p className="section-desc section-gap">
                    Visualización interactiva de la matriz de pesos entre la primera y la segunda capa oculta.
                </p>

                <div className="viz-frame">
                    <RedInteractivaCapa2 />
                </div>

                <p className="section-desc section-gap">
                    Finalmente, la capa de salida procesa las activaciones de la Capa 2 usando la función Sigmoide para entregar la probabilidad final.
                </p>

                <div className="viz-frame">
                    <RedInteractivaSalida />
                </div>
            </section>

            {/* Sección 2 */}
            <section className="section-surface">
                <h2 className="section-title">
                    2. ¿Qué neuronas se activan más?
                </h2>
                <p className="section-desc">
                    Aquí se podrán mostrar las activaciones de las neuronas más importantes.
                </p>
                <div className="viz-frame">
                    <AnalisisActivaciones />
                </div>
            </section>

            {/* Sección 3 */}
            <section className="section-surface">
                <h2 className="section-title">
                    3. ¿Qué variables tienen más peso?
                </h2>
                <p className="section-desc">
                    Simulación de la influencia de cada variable de entrada sobre las activaciones.
                </p>
                <div className="viz-frame">
                    <AnalisisPesos />
                </div>
            </section>

            {/* Sección 4 */}
            <section className="section-surface">
                <h2 className="section-title">
                    4. Antes y después del entrenamiento
                </h2>
                <p className="section-desc">
                    Comparación visual de pesos antes y después (por capa) y reporte de activaciones promedio.
                </p>
                <div className="viz-frame">
                    <AnalisisPesosAntesDespues />
                </div>
                <div className="viz-frame">
                    <AnalisisActivacionesPromedio />
                </div>
            </section>
        </>
    );

    const renderEntrenando = () => (
        <>
            <a className="back-link" onClick={() => setView('home')}>
                ← Volver al inicio
            </a>
            <PipelineView />
        </>
    );

    return (
        <div className="app-shell">
            <main className="app-container">
                {renderHeader()}

                {view === 'home' && renderHome()}
                {view === 'radiografia' && renderRadiografia()}
                {view === 'entrenando' && renderEntrenando()}
            </main>
        </div>
    );
}
