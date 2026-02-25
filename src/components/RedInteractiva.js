import { useState } from "react";
import { theme, LightPanel } from "../styles/theme";

export default function RedInteractiva() {
    const [activeCell, setActiveCell] = useState(null);
    const [activeBias, setActiveBias] = useState(null);

    const [selectedNeuron, setSelectedNeuron] = useState(null);

    const [modoCalculo, setModoCalculo] = useState(null);
    const [showActivacion, setShowActivacion] = useState(false);


    const inputLabels = [
        "Preg", "Gluc", "Pres", "Plieg",
        "Insul", "IMC", "Pedig", "Edad"
    ];

    const hiddenLabels = ["N1", "N2", "N3", "N4"];

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

    const sumaSinSesgo = [-12.53151488, -2.36888706, 6.79207027, -4.14176706];
    const sumaConSesgo = [-12.55327156, -2.36904537, 6.81361613, -4.18974686];
    const activacion = [0, 0, 6.81361613, 0];

    const positiveColor = theme.accentPos;
    const negativeColor = theme.accentNeg;
    const textMain = theme.textOnDark;
    const textMuted = theme.mutedOnDark;
    const inputNode = theme.accentBlue;
    const hiddenNode = theme.accentPurple;
    const lightBorder = theme.borderLight;
    const lightText = theme.textOnLight;

    const width = 900;
    const height = 560;

    const inputX = 112;
    const hiddenX = 630;

    const inputYSpacing = 50;
    const hiddenYSpacing = 110;

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap", gap: "28px", marginTop: "24px" }}>

            {/* 🔵 RED GRANDE */}
            <div>

                <div style={{ display: "flex", justifyContent: "space-between", width: "650px" }}>
                    <h4 style={{ fontSize: "17px", color: textMain }}>
                        Capa de Entrada
                    </h4>
                    <h4 style={{ fontSize: "17px", color: textMain }}>
                        Capa 1
                    </h4>
                </div>

                <svg width={width} height={height} style={{ width: "100%", maxWidth: width, height: "auto" }}>

                    {/* ARISTAS */}
                    {weights.map((row, i) =>
                        row.map((value, j) => {
                            const x1 = inputX;
                            const y1 = 60 + i * inputYSpacing;
                            const x2 = hiddenX;
                            const y2 = 90 + j * hiddenYSpacing;

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
                                        style={{ filter: isActive ? "drop-shadow(0 0 8px rgba(0,245,196,0.6))" : "none" }}
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

                    {/* ENTRADA */}
                    {inputLabels.map((label, i) => {
                        const y = 60 + i * inputYSpacing;
                        return (
                            <g key={i}>
                                <circle cx={inputX} cy={y} r={22} fill={inputNode} />
                                <text
                                    x={inputX - 80}
                                    y={y + 4}
                                    fontSize="15"
                                    textAnchor="end"
                                    fill={textMain}
                                >
                                    {label}
                                </text>
                            </g>
                        );
                    })}

                    {/* CAPA 1 */}
                    {hiddenLabels.map((label, j) => {
                        const y = 90 + j * hiddenYSpacing;
                        const isBiasActive = activeBias === j;

                        return (
                            <g key={j}>
                                <circle cx={hiddenX} cy={y} r={27} fill={hiddenNode} />
                                <text
                                    x={hiddenX}
                                    y={y + 5}
                                    fontSize="16"
                                    textAnchor="middle"
                                    fill={lightText}
                                >
                                    {label}
                                </text>

                                {selectedNeuron === j && modoCalculo && (
                                    <text
                                        x={hiddenX + 80}
                                        y={y}
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
                                        <text
                                            x={hiddenX + 80}
                                            y={y + 22}
                                            fill={activacion[j] > 0 ? positiveColor : "#475569"}
                                            fontSize="18"
                                            fontWeight="bold"
                                        >
                                            → {activacion[j] > 0 ? "😃" : "😶"}
                                        </text>
                                    )}

                                {/* MOSTRAR SESGO AL HACER HOVER */}
                                {isBiasActive && (
                                    <text
                                        x={hiddenX + 60}
                                        y={y + 5}
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
            <div style={{ width: "100%", maxWidth: "350px" }}>

                <h3 style={{ color: textMain, marginBottom: "5px", fontSize: "18px" }}>
                    Función Detalles_capa
                </h3>

                <h4 style={{ color: textMuted, marginBottom: "15px", fontWeight: "600", fontSize: "16px" }}>
                    Valores de pesos (Capa 1)
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
                                                padding: "6px 8px",
                                                fontSize: "14px",
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
                    Valores de sesgos (Capa 1)
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
                                        style={{
                                            padding: "6px 8px",
                                            fontSize: "14px",
                                            textAlign: "center",
                                            cursor: "pointer",
                                            border: `1px solid ${lightBorder}`,
                                            backgroundColor:
                                                selectedNeuron === j &&
                                                    (modoCalculo === "bias" || modoCalculo === "con")
                                                    ? hiddenNode
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
                                                ? hiddenNode
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
                    Activación (ReLU)
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
        </div>
    );
}
