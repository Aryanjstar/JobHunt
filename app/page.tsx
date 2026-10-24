import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const cards = [
  {
    href: "/studio",
    title: "Tailor",
    body: "Paste one description. Get a one-page resume and a five-paragraph letter. You download them.",
  },
  {
    href: "/projects",
    title: "Projects",
    body: "Pin the two projects that should appear. Each bullet keeps a metric that is already yours, and no action verb repeats.",
  },
  {
    href: "/jobs",
    title: "Shortlist",
    body: "Public company boards only. A role has to score 4 of 5. Desk prepares the documents and stops before submit.",
  },
];

export default function HomePage() {
  return (
    <Box sx={{ maxWidth: 820 }}>
      <Typography sx={{ letterSpacing: "0.16em", fontSize: 12, color: "text.secondary", mb: 1 }}>
        PRIVATE · FOR ARYAN JAISWAL
      </Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: 48, md: 68 }, lineHeight: 0.95, mb: 2 }}>
        Desk
      </Typography>
      <Typography sx={{ fontSize: 18, maxWidth: 560, mb: 4 }}>
        Early-career screens still read the first page. Recruiters then search the text for tools you actually used. Desk mirrors those words, keeps every number inside your profile, and never sends the application.
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 1.5 }}>
        {cards.map((card) => (
          <Box
            key={card.href}
            component={NextLink}
            href={card.href}
            sx={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              p: 2.5,
              minHeight: 180,
            }}
          >
            <Typography sx={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, mb: 1 }}>
              {card.title}
            </Typography>
            <Typography color="text.secondary">{card.body}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
