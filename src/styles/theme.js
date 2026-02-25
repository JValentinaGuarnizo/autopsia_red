export const theme = {
  bg: "#0B1220",
  surfaceDark: "#111827",
  borderDark: "#1F2937",
  textOnDark: "#E6EDF3",
  mutedOnDark: "#9BA7B4",

  surfaceLight: "#F3F6FA",
  borderLight: "#D6DEE8",
  textOnLight: "#0B1220",
  mutedOnLight: "#334155",

  accentPos: "#00F5C4",
  accentNeg: "#FF4D6D",
  accentPurple: "#A855F7",
  accentDeepPurple: "#7C3AED",
  accentBlue: "#1F6FEB",
  accentWarn: "#FACC15",
  accentOrange: "#F97316",
};

export const DarkCard = {
  background: theme.surfaceDark,
  border: `1px solid ${theme.borderDark}`,
  borderRadius: 16,
  padding: "16px 18px",
  color: theme.textOnDark,
  boxShadow: "0 0 20px rgba(0, 245, 196, 0.05)",
};

export const LightPanel = {
  background: theme.surfaceLight,
  border: `1px solid ${theme.borderLight}`,
  borderRadius: 16,
  padding: "16px 18px",
  color: theme.textOnLight,
  boxShadow: "0 8px 18px rgba(2, 6, 23, 0.08)",
};
