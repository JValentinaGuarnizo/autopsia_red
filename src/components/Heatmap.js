// src/components/Heatmap.js
export default function Heatmap({ palette = 'dia' }) {
    // Paleta que te gusta
    const colors = ['#84b6f4', '#95c6ff', '#ef5fb2', '#bc409a', '#0a607f'];

    const matrix = [
        [0.2, -0.5, 0.1, 0.3],
        [-0.1, 0.4, 0.0, -0.2],
        [0.3, -0.3, 0.2, 0.1]
    ];

    const maxWeight = Math.max(...matrix.flat().map(v => Math.abs(v)), 0.001);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${matrix[0].length}, 50px)`, gap: '8px', marginTop: '24px' }}>
            {matrix.flat().map((v, idx) => {
                const intensity = Math.min(1, Math.abs(v) / maxWeight);
                const color = v >= 0 ? theme.accentPos : theme.accentNeg;
                return (
                    <div
                        key={idx}
                        style={{
                            width: 50,
                            height: 50,
                            backgroundColor: Math.abs(v) < 0.01 ? theme.surfaceAlt : color,
                            opacity: Math.abs(v) < 0.01 ? 1 : 0.2 + intensity * 0.8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: Math.abs(v) < 0.01 ? theme.textSecondary : "#FFFFFF",
                            fontSize: '13px',
                            borderRadius: '10px',
                            border: `1px solid ${theme.border}`,
                            fontWeight: 'bold',
                            boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                        }}
                        title={`Valor: ${v.toFixed(4)}`}
                    >
                        {v.toFixed(2)}
                    </div>
                );
            })}
        </div>
    );

}