import { useState } from "react";

export default function AnalisisActivaciones() {

    const [registroActivo, setRegistroActivo] = useState(0);

    const hiddenLabels = ["N1", "N2", "N3", "N4"];

    const activacionesRegistros = [
        [-12.53, -2.36, 6.81, -4.18],
        [-8.52, -2.80, 5.09, -2.61],
        [-12.54, -0.66, 6.98, -6.85],
        [-8.03, -5.84, 5.28, -6.07],
        [-9.90, -6.97, 5.31, -8.22]
    ];

    const inputLabels = [
        "Preg", "Gluc", "Pres", "Plieg",
        "Insul", "IMC", "Pedig", "Edad"
    ];

    const entradas = [
        [6, 148, 72, 35, 0, 33.6, 0.627, 50],
        [1, 85, 66, 29, 0, 26.6, 0.351, 31],
        [8, 183, 64, 0, 0, 23.3, 0.672, 32],
        [1, 89, 66, 23, 94, 28.1, 0.167, 21],
        [0, 137, 40, 35, 168, 43.1, 2.288, 33]
    ];

    const weights = [
        [-0.02175668, -0.00015831, 0.02154585, -0.0479798],
        [-0.04214019, 0.01265594, 0.02549983, -0.03267942],
        [-0.03712874, -0.04473295, 0.04425292, -0.02695481],
        [-0.00224584, -0.02534449, 0.0224576, 0.02690658],
        [0.00369109, -0.03312949, 0.00028085, -0.03000574],
        [-0.04647031, -0.01872196, -0.00256057, 0.00597994],
        [0.03235373, 0.00913667, -0.01797307, 0.02625214],
        [-0.03742474, 0.00980286, -0.01972204, 0.03528589]
    ];

    const biases = [-0.022, -0.000, 0.022, -0.048];

    const hiddenX = 400;
    const hiddenYSpacing = 100;

    const activacionStats = [
        { label: "N1", avg: 0.0, min: 0.0, max: 0.0 },
        { label: "N2", avg: 0.0255, min: 0.0, max: 1.08 },
        { label: "N3", avg: 6.5799, min: 1.71, max: 10.53 },
        { label: "N4", avg: 0.009, min: 0.0, max: 0.63 },
    ];

    const fmtAvg = (v) => Number(v).toFixed(4);
    const fmtMinMax = (v) => Number(v).toFixed(2);

    return (
        <div style={{ marginTop: "28px", textAlign: "center" }}>

            <h2>¿Qué neuronas se activan más?</h2>

            {/* Selector */}
            <div style={{ marginBottom: "30px" }}>
                {activacionesRegistros.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setRegistroActivo(index)}
                        style={{
                            margin: "0 8px",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                            backgroundColor:
                                registroActivo === index ? "#ef5fb2" : "#ddd",
                            color: registroActivo === index ? "#fff" : "#333",
                            fontWeight: "600"
                        }}
                    >
                        Registro {index + 1}
                    </button>
                ))}
            </div>


            <div style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "14px",
                fontSize: "13px",
                color: "#2c3e50"
            }}>
                <span><b style={{ color: "#2ecc71" }}>●</b> Peso positivo</span>
                <span><b style={{ color: "#e74c3c" }}>●</b> Peso negativo</span>
                <span><b style={{ color: "#2ecc71" }}>+</b> Sesgo &gt; 0</span>
                <span><b style={{ color: "#e74c3c" }}>+</b> Sesgo ≤ 0</span>
                <span><b style={{ color: "#999" }}>●</b> Neurona apagada (ReLU ≤ 0)</span>
            </div>

            {/* Red básica */}
            <svg width={900} height={500} style={{ width: "100%", maxWidth: 900, height: "auto" }}>


                {/* ARISTAS Entrada -> Capa 1 */}
                {inputLabels.map((_, i) =>
                    hiddenLabels.map((_, j) => {
                        const x1 = 150;
                        const y1 = 60 + i * 50;

                        const x2 = 500;
                        const y2 = 100 + j * 100;

                        // 🔒 Protección contra undefined / NaN
                        const activaciones = activacionesRegistros[registroActivo] || [];

                        const act = activaciones[j] ?? 0;

                        const maxAct =
                            activaciones.length > 0
                                ? Math.max(...activaciones, 0)
                                : 0;

                        const intensidad = maxAct > 0 ? act / maxAct : 0;

                        const w = weights[i][j];
                        const color = w >= 0 ? "#2ecc71" : "#e74c3c";

                        return (
                            <line
                                key={`${i}-${j}`}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={color}
                                strokeOpacity={0.7}
                                strokeWidth={1 + intensidad * 2}
                            />
                        );
                    })
                )}







                {/* ENTRADA */}
                {inputLabels.map((label, i) => {

                    const y = 60 + i * 50;
                    const valorEntrada = entradas[registroActivo][i];

                    return (
                        <g key={i}>
                            <circle
                                cx={150}
                                cy={y}
                                r={22}
                                fill="#84b6f4"
                            />

                            {/* Nombre variable */}
                            <text
                                x={100}
                                y={y + 4}
                                textAnchor="end"
                                fontSize="12"
                            >
                                {label}
                            </text>

                            {/* Valor dinámico */}
                            <text
                                x={150}
                                y={y + 4}
                                textAnchor="middle"
                                fill="#fff"
                                fontSize="12"
                                fontWeight="bold"
                            >
                                {valorEntrada}
                            </text>

                        </g>
                    );
                })}

                {/* CAPA 1 */}
                {hiddenLabels.map((label, j) => {

                    const y = 100 + j * 100;
                    const valor = activacionesRegistros[registroActivo][j];
                    const b = biases[j];
                    const biasColor = b > 0 ? "#2ecc71" : "#e74c3c";

                    return (
                        <g key={j}>
                            <circle
                                cx={500}
                                cy={y}
                                r={35}
                                fill={valor <= 0 ? "#e0e0e0" : "#ef5fb2"}
                            />

                            <text
                                x={500}
                                y={y + 5}
                                textAnchor="middle"
                                fill="#fff"
                                fontSize="16"
                                fontWeight="bold"
                            >
                                {valor.toFixed(2)}
                            </text>

                            <text
                                x={500}
                                y={y - 45}
                                textAnchor="middle"
                                fontSize="14"
                            >
                                {label}
                            </text>

                            <text
                                x={500 + 70}
                                y={y + 5}
                                fill={biasColor}
                                fontSize="14"
                                fontWeight="700"
                            >
                                +({b.toFixed(3)})
                            </text>
                        </g>
                    );
                })}

            </svg>


            <div style={{
                marginTop: "20px",
                maxWidth: "900px",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "left",
                background: "#f6f7f9",
                borderRadius: "10px",
                padding: "14px 16px",
                border: "1px solid #e6e8ee"
            }}>
                <div style={{ fontWeight: "700", marginBottom: "8px", color: "#0a607f" }}>
                    Registro {registroActivo + 1}: activaciones en Capa 1 (ReLU)
                </div>

                <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
                    {activacionesRegistros[registroActivo].map((valor, j) => {
                        const activado = valor > 0;        // ReLU: activo si > 0
                        const reluOut = activado ? valor : 0;

                        return (
                            <div
                                key={j}
                                style={{
                                    padding: "6px 10px",
                                    borderRadius: "999px",
                                    backgroundColor: activado ? "#ef5fb2" : "#e0e0e0",
                                    color: activado ? "#fff" : "#333",
                                    fontWeight: "600"
                                }}
                            >
                                {hiddenLabels[j]}: {activado ? reluOut.toFixed(3) : "0 (apagada)"}
                            </div>
                        );
                    })}
                </div>

            </div>

            <div style={{
                marginTop: "16px",
                maxWidth: "900px",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "left",
                background: "#0b2239",
                borderRadius: "14px",
                padding: "18px 20px",
                border: "1px solid #16324f",
                boxShadow: "0 12px 26px rgba(0,0,0,0.18)"
            }}>
                <div style={{ fontWeight: "900", marginBottom: "14px", color: "#ffffff", fontSize: "20px" }}>
                    Reporte de activación por neurona (promedio, min y max)
                </div>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(200px, 1fr))",
                    gap: "14px"
                }}>
                    {activacionStats.map((item) => (
                        <div
                            key={item.label}
                            style={{
                                background: "#ffffff",
                                borderRadius: "14px",
                                border: "2px solid #dbe6f5",
                                padding: "14px 16px",
                                boxShadow: "0 10px 20px rgba(0,0,0,0.14)",
                                display: "grid",
                                gap: "10px"
                            }}
                        >
                            <div style={{ fontWeight: "900", color: "#10263a", fontSize: "18px" }}>{item.label}</div>
                            <div style={{ fontSize: "18px", color: "#10263a" }}>
                                avg <strong style={{ color: "#2ecc71" }}>{fmtAvg(item.avg)}</strong>
                            </div>
                            <div style={{ display: "flex", gap: "14px", fontSize: "16px", color: "#2c3e50" }}>
                                <span>min <strong style={{ color: "#0f5f99" }}>{fmtMinMax(item.min)}</strong></span>
                                <span>max <strong style={{ color: "#e74c3c" }}>{fmtMinMax(item.max)}</strong></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>



        </div>
    );
}
