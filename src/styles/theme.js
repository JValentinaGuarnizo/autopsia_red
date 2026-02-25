export const theme = {
  bg: "#F4F7FB",              // fondo general
  surface: "#FFFFFF",         // tarjetas principales
  surfaceAlt: "#E9EEF5",      // paneles secundarios
  border: "#D4DCE6",

  textPrimary: "#0F172A",
  textSecondary: "#475569",

  accentPos: "#00C2A8",       // verde tecnológico (positivo)
  accentNeg: "#E5484D",       // rojo científico (negativo)
  accentPurple: "#7C3AED",
  accentBlue: "#2563EB",
  accentHighlight: "#14B8A6", // selección activa
};

export const MainCard = {
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: 16,
  padding: "16px 18px",
  color: theme.textPrimary,
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
};

export const SecondaryPanel = {
  background: theme.surfaceAlt,
  border: `1px solid ${theme.border}`,
  borderRadius: 16,
  padding: "16px 18px",
  color: theme.textPrimary,
};

// Mapeos de compatibilidad (opcional, pero ayuda a evitar errores inmediatos si otros archivos importan nombres viejos)
export const DarkCard = MainCard;
export const LightPanel = SecondaryPanel;

