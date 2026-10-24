"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

const items = [
  { href: "/", label: "Home" },
  { href: "/studio", label: "Tailor" },
  { href: "/projects", label: "Projects" },
  { href: "/jobs", label: "Shortlist" },
  { href: "/profile", label: "Profile" },
  { href: "/log", label: "Log" },
];

function NavLinks({ onDark }: { onDark: boolean }) {
  const pathname = usePathname();
  return (
    <Box sx={{ display: "flex", flexDirection: onDark ? "column" : "row", gap: onDark ? 0.5 : 2 }}>
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            component={NextLink}
            href={item.href}
            underline="none"
            sx={{
              color: onDark ? "#efe6d6" : "#24312c",
              px: 1.25,
              py: 0.75,
              borderLeft: onDark ? "3px solid" : "none",
              borderColor: active ? "#c4a574" : "transparent",
              bgcolor: active && onDark ? "#31423b" : "transparent",
              fontWeight: active ? 650 : 500,
              fontSize: 15,
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </Box>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login") {
    return <Box sx={{ minHeight: "100vh" }}>{children}</Box>;
  }
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box
        component="nav"
        aria-label="Primary"
        sx={{
          width: 220,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          gap: 3,
          bgcolor: "#24312c",
          color: "#efe6d6",
          px: 2,
          py: 3,
          flexShrink: 0,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box component="img" src="/mark.svg" alt="" sx={{ width: 28, height: 28 }} />
            <Box sx={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 32, lineHeight: 1 }}>Desk</Box>
          </Box>
          <Box sx={{ mt: 1, color: "#cfc3b0", fontSize: 13, lineHeight: 1.4 }}>
            One profile. One description. Nothing is sent.
          </Box>
        </Box>
        <NavLinks onDark />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderBottom: "1px solid #d9d0c2",
          }}
        >
          <Box sx={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 24 }}>Desk</Box>
          <NavLinks onDark={false} />
        </Box>
        <Box component="main" sx={{ px: { xs: 2, md: 5 }, py: { xs: 3, md: 4 }, maxWidth: 1080 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
