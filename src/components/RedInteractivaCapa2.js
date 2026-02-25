import { useState } from "react";

export default function RedInteractivaCapa2() {
    const [activeCell, setActiveCell] = useState(null);
    const [activeBias, setActiveBias] = useState(null);

    const [selectedNeuron, setSelectedNeuron] = useState(null);

    const [modoCalculo, setModoCalculo] = useState(null);
    const [showActivacion, setShowActivacion] = useState(false);


    const realInputLabels = ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"];
    const inputLabels = ["N1", "N2", "N3", "N4"];
    const hiddenLabels = ["H1", "H2"];

    const weights = [
        [0.04223222, -0.04701018],
        [-0.01347315, 0.03376298],
        [0.01534155, -0.00617155],
        [0.01383995, -0.03479979]
    ];

    const biases = [0.0, 0.0];

    const sumaSinSesgo = [-0.03251303, 0.0904508];
    const sumaConSesgo = [-0.03251303, 0.0904508];
    const activacion = [0, 0.09045079682259215];

    const positiveColor = "#2ecc71";
    const negativeColor = "#e74c3c";

    const width = 850;
    const height = 400; // Ajustado para 8 inputs

    const realInputX = 50;
    const inputX = 300;
    const hiddenX = 630;

    const realInputYSpacing = 45; // 8 inputs
    const inputYSpacing = 80; // 4 nodes
    const hiddenYSpacing = 160; // 2 nodes

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap", gap: "28px", marginTop: "24px" }}>

            {/* 🔵 RED GRANDE */}
            <div>

                <div style={{ display: "flex", justifyContent: "space-between", width: "650px", marginBottom: "20px", marginLeft: "25px" }}>
                    <h4 style={{ fontSize: "17px", color: "#2c3e50" }}>
                        Entrada
                    </h4>
                    <h4 style={{ fontSize: "17px", color: "#2c3e50" }}>
                        Capa 1
                    </h4>
                    <h4 style={{ fontSize: "17px", color: "#2c3e50" }}>
                        Capa 2
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
                                    stroke="#064056"
                                    strokeOpacity={0.15}
                                    strokeWidth={1}
                                />
                            );
                        })
                    )}

                    {/* ARISTAS (Capa 1 -> Capa 2) */}
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
                                        stroke={isActive ? activeColor : "#064056"}
                                        strokeOpacity={isActive ? 1 : 0.25}
                                        strokeWidth={isActive ? 4 : 1}
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
                                <circle cx={realInputX} cy={y} r={14} fill="#84b6f4" />
                                <text
                                    x={realInputX - 25}
                                    y={y + 4}
                                    fontSize="14"
                                    fontWeight="bold"
                                    textAnchor="end"
                                    fill="#7f8c8d"
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
                                <circle cx={inputX} cy={y} r={20} fill="#bc409a" />
                                <text
                                    x={inputX - 35}
                                    y={y + 4}
                                    fontSize="16"
                                    fontWeight="bold"
                                    textAnchor="end"
                                    fill="#2c3e50"
                                >
                                    {label}
                                </text>
                            </g>
                        );
                    })}

                    {/* CAPA 2 */}
                    {hiddenLabels.map((label, j) => {
                        const y = 90 + j * hiddenYSpacing;
                        const isBiasActive = activeBias === j;

                        return (
                            <g key={j}>
                                <circle cx={hiddenX} cy={y} r={24} fill="#e67e22" />
                                <text
                                    x={hiddenX}
                                    y={y + 5}
                                    fontSize="17"
                                    textAnchor="middle"
                                    fill="#fff"
                                    fontWeight="bold"
                                >
                                    {label}
                                </text>

                                {selectedNeuron === j && modoCalculo && (
                                    <text
                                        x={hiddenX + 80}
                                        y={y}
                                        fill="#2c3e50"
                                        fontSize="16"
                                        fontWeight="600"
                                    >
                                        {modoCalculo === "sin" &&
                                            sumaSinSesgo[j].toFixed(3)
                                        }

                                        {modoCalculo === "bias" && (
                                            <>
                                                <tspan fill="#f39c12" fontWeight="bold">
                                                    + ({biases[j].toFixed(3)})
                                                </tspan>
                                            </>
                                        )}

                                        {modoCalculo === "con" && (
                                            <>
                                                <tspan fill="#2c3e50">
                                                    {sumaSinSesgo[j].toFixed(3)} + (
                                                </tspan>

                                                <tspan fill="#f39c12" fontWeight="bold">
                                                    {biases[j].toFixed(3)}
                                                </tspan>

                                                <tspan fill="#2c3e50">
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
                                            fill={activacion[j] > 0 ? "#2ecc71" : "#999"}
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
                                        fill="#f39c12"
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

                <h3 style={{ color: "#2c3e50", marginBottom: "5px", fontSize: "18px" }}>
                    Función Detalles_capa
                </h3>

                <h4 style={{ color: "#0a607f", marginBottom: "15px", fontWeight: "600", fontSize: "16px" }}>
                    Valores de pesos (Capa 2)
                </h4>

                <table style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
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
                                                borderBottom: "1px solid #eee",
                                                backgroundColor: isActive ? activeColor : "#ffffff",
                                                color: isActive ? "#ffffff" : "#2c3e50",
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
                <h4 style={{ color: "#0a607f", marginTop: "25px", marginBottom: "10px", fontWeight: "600", fontSize: "16px" }}>
                    Valores de sesgos (Capa 2)
                </h4>
                <table style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
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
                                            border: "1px solid #eee",
                                            backgroundColor:
                                                selectedNeuron === j &&
                                                    (modoCalculo === "bias" || modoCalculo === "con")
                                                    ? "#e67e22"
                                                    : "#ffffff",
                                            color:
                                                selectedNeuron === j &&
                                                    (modoCalculo === "bias" || modoCalculo === "con")
                                                    ? "#ffffff"
                                                    : "#2c3e50",
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
                    color: "#2c3e50",
                    marginTop: "30px",
                    fontSize: "18px",
                    fontWeight: "600"
                }}>
                    Función Pasando_por_capa
                </h3>
                <h4 style={{
                    marginTop: "15px",
                    marginBottom: "10px",
                    color: "#0a607f",
                    fontSize: "16px",
                    fontWeight: "600"
                }}>
                    Suma ponderada sin sesgo
                </h4>

                <table style={{
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
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
                                        border: "1px solid #eee",
                                        backgroundColor:
                                            selectedNeuron === j &&
                                                (modoCalculo === "sin" || modoCalculo === "con")
                                                ? "#f39c12"
                                                : "#ffffff",

                                        color:
                                            selectedNeuron === j &&
                                                (modoCalculo === "sin" || modoCalculo === "con")
                                                ? "#ffffff"
                                                : "#2c3e50",
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
                    color: "#0a607f",
                    fontSize: "16px",
                    fontWeight: "600"
                }}>
                    Suma ponderada con sesgo
                </h4>

                <table style={{
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
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
                                        border: "1px solid #eee",
                                        backgroundColor:
                                            selectedNeuron === j && modoCalculo === "con"
                                                ? "#e67e22"
                                                : "#ffffff",
                                        color:
                                            selectedNeuron === j && modoCalculo === "con"
                                                ? "#ffffff"
                                                : "#2c3e50",
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
                    color: "#0a607f",
                    fontSize: "16px",
                    fontWeight: "600"
                }}>
                    Activación (ReLU)
                </h4>

                <table style={{
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
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
                                        border: "1px solid #eee",
                                        backgroundColor:
                                            selectedNeuron === j && showActivacion
                                                ? "#84b6f4"
                                                : "#ffffff",
                                        color:
                                            selectedNeuron === j && showActivacion
                                                ? "#ffffff"
                                                : "#2c3e50",
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
