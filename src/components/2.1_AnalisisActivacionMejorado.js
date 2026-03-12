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

    // OJO: Estas activaciones de ejemplo no son las reales evaluadas para esta nueva red sobre los 5 registros,
    // pero como el reporte no provee las "activacionesRegistro" pre-calculadas de los 5 pacientes, haré un seteo dummy > 0
    // para que la UI no se rompa (podrían quedar negativas y apagarse, pero pondré unos valores ilustrativos basados en la media)
    const activacionesRegistros = [
        [110.38, 2.41, 5.30, 81.67], // Promedio como R1
        [379.43, 145.61, 299.06, 471.37], // Max como R2
        [22.90, 0, 0, 0], // Min como R3
        [-8.03, -5.84, 5.28, -6.07], // Random 1 (apagadas N1 N2 N4)
        [50.1, 10.5, 0, 15.2] // Random 2
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
        [-0.16139945, -0.62433326, -0.04223842, 0.13126098],
        [0.46537235, -0.29361084, -0.60242856, 0.5252675],
        [-0.02884118, 0.45421892, -0.26369917, -0.20380513],
        [0.11620278, -0.5893649, -0.24052233, -0.62186086],
        [0.2955946, 0.30955124, 0.5497323, 0.46467063],
        [0.5039663, -0.8880986, -0.2792889, 0.28231946],
        [0.666122, 0.40894002, -0.5660965, -0.9346113],
        [0.4219358, -0.79326355, -0.37209475, -0.05634119]
    ];

    const biases = [0.3004001, -0.47274107, -0.16322827, 0.58526754];

    const hiddenX = 400;
    const hiddenYSpacing = 100;

    const activacionStats = [
        { label: "N1", avg: 110.38541, min: 22.902493, max: 379.43835 },
        { label: "N2", avg: 2.4115338, min: 0.0, max: 145.617 },
        { label: "N3", avg: 5.3078218, min: 0.0, max: 299.0696 },
        { label: "N4", avg: 81.678535, min: 0.0, max: 471.37402 },
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
