import { useState } from "react";
import { theme, LightPanel } from "../styles/theme";

export default function RedInteractivaCapa2() {
    const [activeCell, setActiveCell] = useState(null);
    const [activeBias, setActiveBias] = useState(null);

    const [selectedNeuron, setSelectedNeuron] = useState(null);

    const [modoCalculo, setModoCalculo] = useState(null);
    const [showActivacion, setShowActivacion] = useState(false);


    const realInputLabels = ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"];
    const inputLabels = ["N1", "N2", "N3", "N4"];
    const hiddenLabels = ["H1", "H2"];
    const outputLabels = ["O1"];

    const weights = [
        [-0.03649466],
        [-0.02077454]
    ];

    const biases = [0.0];

    const sumaSinSesgo = [-0.00187907];
    const sumaConSesgo = [-0.00187907];
    const activacion = [0.49353023]; // Sigmoid output

    const positiveColor = theme.accentPos;
    const negativeColor = theme.accentNeg;
    const textMain = theme.textPrimary;
    const textMuted = theme.textSecondary;
    const inputNode = theme.accentBlue;
    const hiddenNode = theme.accentPurple;
    const hiddenNode2 = theme.accentPurple;
    const outputNode = theme.accentHighlight;
    const lightBorder = theme.border;
    const lightText = "#FFFFFF";

    const width = 850;
    const height = 400; // Ajustado para 8 inputs

    const realInputX = 50;
    const inputX = 220;
    const hiddenX = 420;
    const outputX = 650;

    const realInputYSpacing = 45; // 8 inputs
    const inputYSpacing = 80; // 4 nodes
    const hiddenYSpacing = 160; // 2 nodes
    const outputYSpacing = 200; // 1 node

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap", gap: "28px", marginTop: "24px" }}>

            {/* 🔵 RED GRANDE */}
            <div>

                <div style={{ display: "flex", justifyContent: "space-between", width: "700px", marginBottom: "20px", marginLeft: "25px" }}>
                    <h4 style={{ fontSize: "17px", color: textMain }}>
                        Entrada
                    </h4>
                    <h4 style={{ fontSize: "17px", color: textMain }}>
                        Capa 1
                    </h4>
                    <h4 style={{ fontSize: "17px", color: textMain }}>
                        Capa 2
                    </h4>
                    <h4 style={{ fontSize: "17px", color: textMain }}>
                        Salida
                    </h4>
                </div>

                <svg width={width} height={height} style={{ width: "100%", maxWidth: width, height: "auto" }}>

                    {/* CONEXIONES ESTÁTICAS (Entrada -> Capa 1) */}
                    {realInputLabels.map((_, i) =>
                        inputLabels.map((_, j) => {
                            const x1 = realInputX;
                            const y1 = 40 + i * realInputYSpacing;
                            const x2 = inputX;
                            const y2 = 60 + j * inputYSpacing;

                            return (
                                <line
                                    key={`static-${i}-${j}`}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke="#334155"
                                    strokeOpacity={0.45}
                                    strokeWidth={1}
                                />
                            );
                        })
                    )}

                    {/* CONEXIONES ESTÁTICAS (Capa 1 -> Capa 2) */}
                    {inputLabels.map((_, i) =>
                        hiddenLabels.map((_, j) => {
                            const x1 = inputX;
                            const y1 = 60 + i * inputYSpacing;
                            const x2 = hiddenX;
                            const y2 = 90 + j * hiddenYSpacing;

                            return (
                                <line
                                    key={`static-h-${i}-${j}`}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke="#334155"
                                    strokeOpacity={0.45}
                                    strokeWidth={1}
                                />
                            );
                        })
                    )}

                    {/* ARISTAS (Capa 2 -> Salida) */}
                    {weights.map((row, i) =>
                        row.map((value, j) => {
                            const x1 = hiddenX;
                            const y1 = 90 + i * hiddenYSpacing;
                            const x2 = outputX;
                            const y2 = 140 + j * outputYSpacing;

                            const isActive =
                                activeCell && activeCell.i === i && activeCell.j === j;

                            const activeColor = value >= 0 ? positiveColor : negativeColor;

                            return (
                                <g key={`${i}-${j}`}>
                                    <line
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke={activeColor}
                                        strokeOpacity={isActive ? 0.95 : 0.45}
                                        strokeWidth={isActive ? 2.5 : 1.2}
                                        style={{ filter: isActive ? `drop-shadow(0 0 6px ${activeColor}88)` : "none" }}
                                    />
                                    {isActive && (
                                        <text
                                            x={(x1 + x2) / 2}
                                            y={(y1 + y2) / 2}
                                            fill={activeColor}
                                            fontSize="15"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                        >
                                            {value.toFixed(3)}
                                        </text>
                                    )}
                                </g>
                            );
                        })
                    )}

                    {/* ENTRADA REAL */}
                    {realInputLabels.map((label, i) => {
                        const y = 40 + i * realInputYSpacing;
                        return (
                            <g key={`real-${i}`}>
                                <circle cx={realInputX} cy={y} r={16} fill={inputNode} />
                                <text
                                    x={realInputX - 25}
                                    y={y + 4}
                                    fontSize="14"
                                    fontWeight="bold"
                                    textAnchor="end"
                                    fill={textMuted}
                                >
                                    {label}
                                </text>
                            </g>
                        );
                    })}

                    {/* CAPA 1 */}
                    {inputLabels.map((label, i) => {
                        const y = 60 + i * inputYSpacing;
                        return (
                            <g key={i}>
                                <circle cx={inputX} cy={y} r={22} fill={hiddenNode} />
                                <text
                                    x={inputX - 35}
                                    y={y + 4}
                                    fontSize="16"
                                    fontWeight="bold"
                                    textAnchor="end"
                                    fill={textMain}
                                >
                                    {label}
                                </text>
                            </g>
                        );
                    })}

                    {/* CAPA 2 */}
                    {hiddenLabels.map((label, j) => {
                        const y = 90 + j * hiddenYSpacing;

                        return (
                            <g key={j}>
                                <circle cx={hiddenX} cy={y} r={27} fill={hiddenNode2} />
                                <text
                                    x={hiddenX}
                                    y={y + 5}
                                    fontSize="17"
                                    textAnchor="middle"
                                    fill={lightText}
                                    fontWeight="bold"
                                >
                                    {label}
                                </text>
                            </g>
                        );
                    })}

                    {/* SALIDA (Capa 3) */}
                    {outputLabels.map((label, j) => {
                        const y = 140 + j * outputYSpacing;
                        const isBiasActive = activeBias === j;

                        return (
                            <g key={`out-${j}`}>
                                {/* Highlight aura if activation shown */}
                                {selectedNeuron === j && modoCalculo === "con" && showActivacion && (
                                    <circle cx={outputX} cy={y} r={40} fill={activacion[j] >= 0.5 ? "rgba(0, 245, 196, 0.2)" : "rgba(255, 77, 109, 0.2)"} />
                                )}

                                <circle cx={outputX} cy={y} r={27} fill={outputNode} />
                                <text
                                    x={outputX}
                                    y={y + 5}
                                    fontSize="17"
                                    textAnchor="middle"
                                    fill={lightText}
                                    fontWeight="bold"
                                >
                                    {label}
                                </text>

                                {selectedNeuron === j && modoCalculo && (
                                    <text
                                        x={outputX + 50}
                                        y={y - 10}
                                        fill={textMain}
                                        fontSize="16"
                                        fontWeight="600"
                                    >
                                        {modoCalculo === "sin" &&
                                            sumaSinSesgo[j].toFixed(3)
                                        }

                                        {modoCalculo === "bias" && (
                                            <>
                                                <tspan fill={positiveColor} fontWeight="bold">
                                                    + ({biases[j].toFixed(3)})
                                                </tspan>
                                            </>
                                        )}

                                        {modoCalculo === "con" && (
                                            <>
                                                <tspan fill={textMain}>
                                                    {sumaSinSesgo[j].toFixed(3)} + (
                                                </tspan>

                                                <tspan fill={positiveColor} fontWeight="bold">
                                                    {biases[j].toFixed(3)}
                                                </tspan>

                                                <tspan fill={textMain}>
                                                    ) = {sumaConSesgo[j].toFixed(3)}
                                                </tspan>
                                            </>
                                        )}
                                    </text>
                                )}


                                {selectedNeuron === j &&
                                    modoCalculo === "con" &&
                                    showActivacion && (
                                        <g>
                                            <rect
                                                x={outputX + 50}
                                                y={y + 15}
                                                width="120"
                                                height="35"
                                                rx="6"
                                                fill={activacion[j] >= 0.5 ? positiveColor : negativeColor}
                                            />
                                            <text
                                                x={outputX + 110}
                                                y={y + 38}
                                                fill={lightText}
                                                fontSize="16"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                            >
                                                {activacion[j] >= 0.5 ? "✅ POSITIVO" : "❌ NEGATIVO"}
                                            </text>
                                            <text
                                                x={outputX + 110}
                                                y={y + 65}
                                                fill={textMain}
                                                fontSize="14"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                            >
                                                P = {(activacion[j] * 100).toFixed(1)}%
                                            </text>
                                        </g>
                                    )}

                                {/* MOSTRAR SESGO AL HACER HOVER */}
                                {isBiasActive && (
                                    <text
                                        x={outputX + 60}
                                        y={y - 10}
                                        fill={positiveColor}
                                        fontSize="16"
                                        fontWeight="bold"
                                    >
                                        + ({biases[j].toFixed(3)})
                                    </text>
                                )}
                            </g>
                        );
                    })}

                </svg>
            </div>

            {/* 🟣 TABLAS MÁS PEQUEÑAS */}
            <div style={{ width: "350px" }}>

                <h3 style={{ color: textMain, marginBottom: "5px", fontSize: "18px" }}>
                    Función Detalles_capa
                </h3>

                <h4 style={{ color: textMuted, marginBottom: "15px", fontWeight: "600", fontSize: "16px" }}>
                    Valores de pesos (Capa Salida)
                </h4>

                <table style={{
                    ...LightPanel,
                    padding: 0,
                    borderCollapse: "collapse",
                    width: "100%",
                    backgroundColor: theme.surfaceLight,
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 8px 18px rgba(2, 6, 23, 0.08)"
                }}>
                    <tbody>
                        {weights.map((row, i) => (
                            <tr key={i}>
                                {row.map((value, j) => {
                                    const isActive =
                                        activeCell && activeCell.i === i && activeCell.j === j;
                                    const activeColor = value >= 0 ? positiveColor : negativeColor;

                                    return (
                                        <td
                                            key={j}
                                            onMouseEnter={() => setActiveCell({ i, j })}
                                            onMouseLeave={() => setActiveCell(null)}
                                            style={{
                                                padding: "9px 12px",
                                                fontSize: "15px",
                                                textAlign: "center",
                                                cursor: "pointer",
                                                borderBottom: `1px solid ${lightBorder}`,
                                                backgroundColor: theme.surfaceLight,
                                                color: isActive ? activeColor : theme.textOnLight,
                                                boxShadow: isActive ? `inset 0 0 0 2px ${activeColor}` : "none",
                                                fontWeight: isActive ? "bold" : "500",
                                                transition: "all 0.2s ease"
                                            }}
                                        >
                                            {value.toFixed(3)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* TABLA SESGOS */}
                <h4 style={{ color: textMuted, marginTop: "25px", marginBottom: "10px", fontWeight: "600", fontSize: "16px" }}>
                    Valores de sesgos (Capa Salida)
                </h4>
                <table style={{
                    ...LightPanel,
                    padding: 0,
                    borderCollapse: "collapse",
                    width: "100%",
                    backgroundColor: theme.surfaceLight,
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 8px 18px rgba(2, 6, 23, 0.08)"
                }}>
                    <tbody>
                        <tr>
                            {biases.map((value, j) => {

                                return (
                                    <td
                                        key={j}
                                        onClick={() => {
                                            setSelectedNeuron(j);
                                            setModoCalculo("bias");
                                            setShowActivacion(false);
                                        }}
                                        onMouseEnter={() => setActiveBias(j)}
                                        onMouseLeave={() => setActiveBias(null)}
                                        style={{
                                            padding: "9px 12px",
                                            fontSize: "15px",
                                            textAlign: "center",
                                            cursor: "pointer",
                                            border: `1px solid ${lightBorder}`,
                                            backgroundColor:
                                                selectedNeuron === j &&
                                                    (modoCalculo === "bias" || modoCalculo === "con")
                                                    ? hiddenNode2
                                                    : theme.surfaceLight,
                                            color:
                                                selectedNeuron === j &&
                                                    (modoCalculo === "bias" || modoCalculo === "con")
                                                    ? lightText
                                                    : theme.textOnLight,
                                            fontWeight: "600",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        {value.toFixed(3)}
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>

                <h3 style={{
                    color: textMain,
                    marginTop: "30px",
                    fontSize: "18px",
                    fontWeight: "600"
                }}>
                    Función Pasando_por_capa
                </h3>
                <h4 style={{
                    marginTop: "15px",
                    marginBottom: "10px",
                    color: textMuted,
                    fontSize: "16px",
                    fontWeight: "600"
                }}>
                    Suma ponderada sin sesgo
                </h4>

                <table style={{
                    ...LightPanel,
                    padding: 0,
                    width: "100%",
                    backgroundColor: theme.surfaceLight,
                    borderRadius: "12px",
                    boxShadow: "0 8px 18px rgba(2, 6, 23, 0.08)"
                }}>
                    <tbody>
                        <tr>
                            {sumaSinSesgo.map((value, j) => (
                                <td
                                    key={j}
                                    onClick={() => {
                                        setSelectedNeuron(j);
                                        setModoCalculo("sin");
                                        setShowActivacion(false);
                                    }}
                                    style={{
                                        padding: "9px 12px",
                                        fontSize: "15px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        border: `1px solid ${lightBorder}`,
                                        backgroundColor:
                                            selectedNeuron === j &&
                                                (modoCalculo === "sin" || modoCalculo === "con")
                                                ? positiveColor
                                                : theme.surfaceLight,

                                        color:
                                            selectedNeuron === j &&
                                                (modoCalculo === "sin" || modoCalculo === "con")
                                                ? lightText
                                                : theme.textOnLight,
                                        fontWeight: "600",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    {value.toFixed(3)}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>

                <h4 style={{
                    marginTop: "20px",
                    marginBottom: "10px",
                    color: textMuted,
                    fontSize: "16px",
                    fontWeight: "600"
                }}>
                    Suma ponderada con sesgo
                </h4>

                <table style={{
                    ...LightPanel,
                    padding: 0,
                    width: "100%",
                    backgroundColor: theme.surfaceLight,
                    borderRadius: "12px",
                    boxShadow: "0 8px 18px rgba(2, 6, 23, 0.08)"
                }}>
                    <tbody>
                        <tr>
                            {sumaConSesgo.map((value, j) => (
                                <td
                                    key={j}
                                    onClick={() => {
                                        setSelectedNeuron(j);
                                        setModoCalculo("con");
                                        setShowActivacion(false);
                                    }}
                                    style={{
                                        padding: "9px 12px",
                                        fontSize: "15px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        border: `1px solid ${lightBorder}`,
                                        backgroundColor:
                                            selectedNeuron === j && modoCalculo === "con"
                                                ? hiddenNode2
                                                : theme.surfaceLight,
                                        color:
                                            selectedNeuron === j && modoCalculo === "con"
                                                ? lightText
                                                : theme.textOnLight,
                                        fontWeight: "600",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    {value.toFixed(3)}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
                <h4 style={{
                    marginTop: "20px",
                    marginBottom: "10px",
                    color: textMuted,
                    fontSize: "16px",
                    fontWeight: "600"
                }}>
                    Activación (Sigmoid)
                </h4>

                <table style={{
                    ...LightPanel,
                    padding: 0,
                    width: "100%",
                    backgroundColor: theme.surfaceLight,
                    borderRadius: "12px",
                    boxShadow: "0 8px 18px rgba(2, 6, 23, 0.08)"
                }}>
                    <tbody>
                        <tr>
                            {activacion.map((value, j) => (
                                <td
                                    key={j}
                                    onClick={() => {
                                        if (modoCalculo === "con") {
                                            setSelectedNeuron(j);
                                            setShowActivacion(true);
                                        }
                                    }}
                                    style={{
                                        padding: "9px 12px",
                                        fontSize: "15px",
                                        textAlign: "center",
                                        cursor: modoCalculo === "con" ? "pointer" : "not-allowed",
                                        border: `1px solid ${lightBorder}`,
                                        backgroundColor:
                                            selectedNeuron === j && showActivacion
                                                ? inputNode
                                                : theme.surfaceLight,
                                        color:
                                            selectedNeuron === j && showActivacion
                                                ? lightText
                                                : theme.textOnLight,
                                        fontWeight: "600",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    {value.toFixed(3)}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>


            </div>
        </div >
    );
}
