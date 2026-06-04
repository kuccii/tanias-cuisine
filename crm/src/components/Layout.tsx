import { NavLink } from "react-router-dom";
import { getTeam, getActiveTeamMember, setActiveTeamMember } from "../data/store";
import { useState } from "react";
import type { TeamMember } from "../data/types";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard" },
  { to: "/planner", label: "Planner" },
  { to: "/assets", label: "Assets" },
  { to: "/review", label: "Review" },
  { to: "/calendar", label: "Calendar" },
];

const headerStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  background: "#0d0d0d",
  borderBottom: "1px solid #333",
};

const headerInnerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  maxWidth: 1600,
  margin: "0 auto",
  padding: "0 24px",
  height: 56,
};

const brandStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: 4,
  overflowX: "auto",
  flex: 1,
  marginLeft: 32,
};

const teamSwitcherStyle: React.CSSProperties = {
  position: "relative",
  cursor: "pointer",
  userSelect: "none",
  flexShrink: 0,
};

const teamTriggerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 12px",
  borderRadius: 8,
  background: "#1a1a1a",
  border: "1px solid #333",
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  right: 0,
  marginTop: 4,
  width: 220,
  background: "#1a1a1a",
  border: "1px solid #333",
  borderRadius: 8,
  overflow: "hidden",
  zIndex: 60,
};

const dropdownItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 14px",
  border: "none",
  background: "transparent",
  color: "#e5e5e5",
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
  fontSize: 14,
};

const mainStyle: React.CSSProperties = {
  maxWidth: 1600,
  margin: "0 auto",
  padding: "24px",
};

const mobileNavStyle: React.CSSProperties = {
  display: "flex",
  gap: 4,
  overflowX: "auto",
  padding: "8px 16px",
  borderBottom: "1px solid #333",
};

const dropdownRoleStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#999",
  marginLeft: "auto",
};

function TeamDropdown({ member, members, onSelect }: { member: TeamMember; members: TeamMember[]; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={teamSwitcherStyle} onClick={() => setOpen(!open)} onBlur={() => setOpen(false)} tabIndex={0}>
      <div style={teamTriggerStyle}>
        <span>{member.avatar}</span>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{member.name}</span>
        <span style={{ fontSize: 10, color: "#999" }}>▾</span>
      </div>
      {open && (
        <div style={dropdownStyle}>
          {members.map((m) => (
            <button
              key={m.id}
              style={{
                ...dropdownItemStyle,
                background: m.id === member.id ? "#222" : "transparent",
              }}
              onMouseEnter={(e) => { if (m.id !== member.id) e.currentTarget.style.background = "#222"; }}
              onMouseLeave={(e) => { if (m.id !== member.id) e.currentTarget.style.background = "transparent"; }}
              onClick={() => { onSelect(m.id); setOpen(false); }}
            >
              <span>{m.avatar}</span>
              <span>{m.name}</span>
              <span style={dropdownRoleStyle}>{m.role}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavLinks({ vertical }: { vertical?: boolean }) {
  const containerStyle: React.CSSProperties = vertical ? { ...mobileNavStyle, borderBottom: "none" } : navStyle;
  return (
    <nav style={containerStyle}>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          style={({ isActive }) => ({
            display: "block",
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            whiteSpace: "nowrap",
            color: isActive ? "#c4943d" : "#999",
            background: isActive ? "rgba(196,148,61,0.1)" : "transparent",
            transition: "color 0.15s, background 0.15s",
          })}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState(getActiveTeamMember);
  const members = getTeam();

  const handleTeamSwitch = (id: string) => {
    setActiveTeamMember(id);
    setMember(getActiveTeamMember());
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={headerStyle}>
        <div style={headerInnerStyle}>
          <div style={brandStyle}>🍽 Tania's Posting System</div>
          <NavLinks />
          <TeamDropdown member={member} members={members} onSelect={handleTeamSwitch} />
        </div>
        <NavLinks vertical />
      </header>
      <main style={mainStyle}>{children}</main>
    </div>
  );
}
