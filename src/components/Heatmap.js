// src/components/Heatmap.js
export default function Heatmap({ palette = 'dia' }) {
    // Paleta que te gusta
    const colors = ['#84b6f4', '#95c6ff', '#ef5fb2', '#bc409a', '#0a607f'];

    const matrix = [
        [0.2, -0.5, 0.1, 0.3],
        [-0.1, 0.4, 0.0, -0.2],
        [0.3, -0.3, 0.2, 0.1]
    ];

    // Función para elegir color según signo y magnitud
    const getColor = (v) => {
        const absV = Math.abs(v);
        if (v >= 0) {
            if (absV < 0.2) return colors[0]; // azul medio
            else if (absV < 0.4) return colors[1]; // azul claro
            else if (absV < 0.6) return colors[4]; // azul oscuro
            else return colors[2]; // rosa fuerte
        } else {
            if (absV < 0.2) return colors[2]; // rosa fuerte
            else if (absV < 0.4) return colors[3]; // rosa oscuro
            else if (absV < 0.6) return colors[1]; // azul claro
            else return colors[4]; // azul oscuro
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${matrix[0].length}, 50px)`, gap: '5px', marginTop: '2rem' }}>
            {matrix.flat().map((v, idx) => (
                <div
                    key={idx}
                    style={{
                        width: 50,
                        height: 50,
                        backgroundColor: getColor(v), // color sólido según valor
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1a1a1a', // texto legible sobre colores
                        fontSize: '12px',
                        borderRadius: '4px',
                        border: '1px solid #0a607f', // borde para resaltar
                        fontWeight: 'bold'
                    }}
                >
                    {v.toFixed(2)}
                </div>
            ))}
        </div>
    );
}