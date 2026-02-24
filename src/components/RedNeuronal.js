import React from 'react';

export default function RedNeuronal({ mode = 'dia' }) {
    // Paletas proporcionadas
    const colors = {
        dia: { active: '#ef5fb2', inactive: '#bc409a', line: '#0a607f', text: '#2c3e50' },
        nocturno: { active: '#f39c12', inactive: '#2980b9', line: '#bdc3c7', text: '#e0e0e0' },
    };

    const chosen = colors[mode] || colors['dia'];

    const neurons = [3, 4, 1];

    return (
        <div style={{ margin: '2rem 0', width: '100%' }}>
            {neurons.map((n, layerIdx) => (
                <div key={layerIdx} style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                    {Array.from({ length: n }).map((_, idx) => {
                        // Simulamos que la primera neurona de cada capa es "activa" para mostrar ambos colores solicitados en el prototipo
                        const isActive = idx === 0;
                        const nodeColor = isActive ? chosen.active : chosen.inactive;

                        return (
                            <div
                                key={idx}
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    backgroundColor: nodeColor,
                                    margin: '0 5px',
                                    border: `2px solid ${chosen.line}`,
                                    boxShadow: mode === 'dia' ? '0 2px 4px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.5)',
                                    transition: 'all 0.3s ease'
                                }}
                            ></div>
                        );
                    })}
                </div>
            ))}
            <p style={{ textAlign: 'center', color: chosen.text, marginTop: '1.5rem', fontStyle: 'italic', fontSize: '0.9rem' }}>
                Simulación: Capa de Entrada → Capa Oculta → Capa de Salida
            </p>
        </div>
    );
}
