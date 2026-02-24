import { useState } from 'react';
import RedNeuronal from '../components/RedNeuronal';
import Heatmap from '../components/Heatmap';
import RedInteractiva from '../components/RedInteractiva';
import RedInteractivaCapa2 from '../components/RedInteractivaCapa2';
import RedInteractivaSalida from '../components/RedInteractivaSalida';
import AnalisisActivaciones from "../components/2.1_AnalisisActivacion";
import AnalisisPesos from "../components/AnalisisPesos";

export default function Home() {
    const [mode, setMode] = useState('dia');

    const theme = {
        dia: {
            bg: '#e2e2e8',
            textPrimary: '#1a1a1a',
            titles: '#2c3e50',
            border: '#0a607f',
        },
        nocturno: {
            bg: '#050518',
            textPrimary: '#e0e0e0',
            titles: '#ffffff',
            border: '#bdc3c7',
        }
    };

    const currentTheme = theme[mode];

    const toggleMode = () => {
        setMode(prev => prev === 'dia' ? 'nocturno' : 'dia');
    };

    return (
        <div style={{
            padding: '2rem',
            backgroundColor: currentTheme.bg,
            color: currentTheme.textPrimary,
            fontFamily: 'sans-serif',
            minHeight: '100vh',
            transition: 'all 0.3s ease',
            position: 'relative'
        }}>
            {/* Botón Flotante de Modo con Sol/Luna */}
            <button
                onClick={toggleMode}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: `2px solid ${mode === 'dia' ? '#2c3e50' : '#ffffff'}`,
                    backgroundColor: mode === 'dia' ? '#ffffff' : '#1e293b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    transition: 'all 0.2s ease'
                }}
                title={mode === 'dia' ? 'Activar modo nocturno' : 'Activar modo día'}
            >
                {mode === 'dia' ? '🌙' : '☀️'}
            </button>

            {/* Título principal */}
            <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.5rem', color: currentTheme.titles }}>
                Autopsia de una Red Neuronal
            </h1>
            <h2 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '3rem', color: currentTheme.titles }}>
                Juana Valentina Guarnizo
            </h2>

            {/* Sección 1 */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.8rem', borderBottom: `2px solid ${currentTheme.border}`, paddingBottom: '0.5rem', color: currentTheme.titles }}>
                    1. Radiografía del script deep.py
                </h2>

                <p style={{ marginTop: '1rem', opacity: 0.8 }}>
                    Visualización interactiva de la matriz de pesos entre la capa de entrada y la primera capa oculta.
                </p>

                <div style={{ marginTop: '2rem' }}>
                    <RedInteractiva />
                </div>

                <p style={{ marginTop: '4rem', opacity: 0.8 }}>
                    Visualización interactiva de la matriz de pesos entre la primera y la segunda capa oculta.
                </p>

                <div style={{ marginTop: '2rem' }}>
                    <RedInteractivaCapa2 />
                </div>

                <p style={{ marginTop: '4rem', opacity: 0.8 }}>
                    Finalmente, la capa de salida procesa las activaciones de la Capa 2 usando la función Sigmoide para entregar la probabilidad final.
                </p>

                <div style={{ marginTop: '2rem' }}>
                    <RedInteractivaSalida />
                </div>
            </section>

            {/* Sección 2 */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.8rem', borderBottom: `2px solid ${currentTheme.border}`, paddingBottom: '0.5rem', color: currentTheme.titles }}>
                    2. ¿Qué neuronas se activan más?
                </h2>
                <p style={{ marginTop: '1rem', opacity: 0.8 }}>Aquí se podrán mostrar las activaciones de las neuronas más importantes.</p>
                <AnalisisActivaciones />
            </section>

            {/* Sección 3 */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.8rem', borderBottom: `2px solid ${currentTheme.border}`, paddingBottom: '0.5rem', color: currentTheme.titles }}>
                    3. ¿Qué variables tienen más peso?
                </h2>
                <p style={{ marginTop: '1rem', opacity: 0.8 }}>Simulación de la influencia de cada variable de entrada sobre las activaciones.</p>
                <AnalisisPesos />
            </section>

            {/* Sección 4 */}
            <section style={{ marginBottom: '4rem', paddingBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.8rem', borderBottom: `2px solid ${currentTheme.border}`, paddingBottom: '0.5rem', color: currentTheme.titles }}>
                    4. Antes y después del entrenamiento
                </h2>
                <p style={{ marginTop: '1rem', opacity: 0.8 }}>Sección donde compararemos visualmente los pesos antes y después del entrenamiento.</p>
            </section>
        </div>
    );
}