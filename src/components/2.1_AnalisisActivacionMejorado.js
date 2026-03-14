import { useState } from "react";
import { theme, LightPanel } from "../styles/theme";

export default function AnalisisActivacionesMejorado() {

    const [registroActivo, setRegistroActivo] = useState(0);

    const hiddenLabels = ["N1", "N2", "N3", "N4"];

    const positiveColor = theme.accentPos;
    const negativeColor = theme.accentNeg;
    const textMain = theme.textPrimary;
    const textMuted = theme.textSecondary;
    const inputNode = theme.accentBlue;
    const hiddenNode = theme.accentPurple;

    const activacionesRegistros = [
        [0.0000, 0.6039, 1.3356, 0.0000], // R1
        [0.0000, 0.0000, 0.0000, 0.0000], // R2
        [0.0000, 0.0000, 0.5702, 0.3715], // R3
        [1.0046, 0.5511, 0.2962, 1.1884], // R4
        [0.4310, 0.0000, 0.3309, 0.1838]  // R5
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
        [0.04545073, -0.8515836, -0.13340735, 0.09059415],
        [0.5148121, 0.4121364, -0.6165441, 0.5709409],
        [-0.12461212, 0.838777, -0.12325263, -0.15125173],
        [0.20505102, -0.60495555, -0.28540835, -0.5833098],
        [0.15851279, 0.44289604, 0.46137828, 0.4713644],
        [0.5140562, -0.47557425, -0.36225626, 0.36648035],
        [0.7669518, 0.46408454, -0.468575, -0.89425975],
        [0.15797631, -0.16025622, -0.500683, -0.11181547]
    ];

    const biases = [0.23089342, -0.07109793, 0.0470638, 0.62113106];

    const hiddenX = 400;
    const hiddenYSpacing = 100;

    const activacionStats = [
        { label: "N1", avg: 0.2871, min: 0.0, max: 1.0046 },
        { label: "N2", avg: 0.2310, min: 0.0, max: 0.6039 },
        { label: "N3", avg: 0.5066, min: 0.0, max: 1.3356 },
        { label: "N4", avg: 0.3487, min: 0.0, max: 1.1884 },
    ];

    const fmtAvg = (v) => Number(v).toFixed(4);
    const fmtMinMax = (v) => Number(v).toFixed(2);

    return (
        <div style={{ marginTop: "28px", textAlign: "center", color: textMain }}>

            <h2>¿Qué neuronas se activan más?</h2>

            {/* Selector */}
            <div style={{ marginBottom: "30px" }}>
                {activacionesRegistros.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setRegistroActivo(index)}
                        style={{
                            margin: "0 8px",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                            backgroundColor:
                                registroActivo === index ? positiveColor : theme.borderDark,
                            color: registroActivo === index ? theme.textOnLight : textMuted,
                            fontWeight: "700"
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
                color: textMain
            }}>
                <span><b style={{ color: positiveColor }}>●</b> Peso positivo</span>
                <span><b style={{ color: negativeColor }}>●</b> Peso negativo</span>
                <span><b style={{ color: positiveColor }}>+</b> Sesgo &gt; 0</span>
                <span><b style={{ color: negativeColor }}>+</b> Sesgo ≤ 0</span>
                <span><b style={{ color: "#475569" }}>●</b> Neurona apagada (ReLU ≤ 0)</span>
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
                        const color = w >= 0 ? positiveColor : negativeColor;

                        return (
                            <line
                                key={`${i}-${j}`}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={color}
                                strokeOpacity={0.45}
                                strokeWidth={1.1 + intensidad * 2.2}
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
                                r={24}
                                fill={inputNode}
                            />

                            {/* Nombre variable */}
                            <text
                                x={100}
                                y={y + 4}
                                textAnchor="end"
                                fontSize="12"
                                fill={textMain}
                            >
                                {label}
                            </text>

                            {/* Valor dinámico */}
                            <text
                                x={150}
                                y={y + 4}
                                textAnchor="middle"
                                fill={theme.textOnLight}
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
                    const biasColor = b > 0 ? positiveColor : negativeColor;

                    return (
                        <g key={j}>
                            <circle
                                cx={500}
                                cy={y}
                                r={38}
                                fill={valor <= 0 ? "#1f2937" : hiddenNode}
                            />

                            <text
                                x={500}
                                y={y + 5}
                                textAnchor="middle"
                                fill={theme.textOnLight}
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
                                fill={textMuted}
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
                ...LightPanel,
                borderRadius: "14px",
                padding: "16px 18px"
            }}>
                <div style={{ fontWeight: "800", marginBottom: "8px", color: theme.textOnLight }}>
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
                                    backgroundColor: activado ? positiveColor : "#e2e8f0",
                                    color: activado ? theme.textOnLight : theme.mutedOnLight,
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
                ...LightPanel,
                borderRadius: "14px",
                padding: "18px 20px"
            }}>
                <div style={{ fontWeight: "900", marginBottom: "14px", color: theme.textOnLight, fontSize: "20px" }}>
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
                                border: `2px solid ${theme.borderLight}`,
                                padding: "14px 16px",
                                boxShadow: "0 8px 16px rgba(2, 6, 23, 0.12)",
                                display: "grid",
                                gap: "10px"
                            }}
                        >
                            <div style={{ fontWeight: "900", color: theme.textOnLight, fontSize: "18px" }}>{item.label}</div>
                            <div style={{ fontSize: "18px", color: theme.textOnLight }}>
                                avg <strong style={{ color: positiveColor }}>{fmtAvg(item.avg)}</strong>
                            </div>
                            <div style={{ display: "flex", gap: "14px", fontSize: "16px", color: theme.textOnLight }}>
                                <span>min <strong style={{ color: theme.accentBlue }}>{fmtMinMax(item.min)}</strong></span>
                                <span>max <strong style={{ color: negativeColor }}>{fmtMinMax(item.max)}</strong></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>



        </div>
    );
}
