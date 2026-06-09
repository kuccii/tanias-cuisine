interface StatsCardProps {
  label: string;
  value: number;
  color?: string;
}

const cardStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: "20px 24px",
  textAlign: "center",
  minWidth: 140,
};

const valueStyle = (color: string): React.CSSProperties => ({
  fontSize: 36,
  fontWeight: 700,
  lineHeight: 1.1,
  color,
});

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "var(--text2)",
  marginTop: 6,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

export default function StatsCard({ label, value, color = "#999" }: StatsCardProps) {
  return (
    <div style={cardStyle}>
      <div style={valueStyle(color)}>{value}</div>
      <div style={labelStyle}>{label}</div>
    </div>
  );
}
