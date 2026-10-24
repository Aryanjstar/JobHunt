import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { accomplishments, bank, contact, education, preferences, projects, roles } from "@/lib/profile";

export default function ProfilePage() {
  return (
    <Box>
      <Typography variant="h1" sx={{ fontSize: 42, mb: 1 }}>
        Profile
      </Typography>
      <Typography sx={{ mb: 3, color: "text.secondary" }}>
        This is the only source Desk is allowed to use. A number that is not written here cannot appear on a resume or a letter.
      </Typography>
      <Typography sx={{ mb: 3 }}>
        AURA stays in the first project slot. Myriox is the default second project for AI, agent, backend, and member-of-technical-staff roles. The Wedding Home replaces it when the description is product, frontend, or full-stack work. DevTinder stays available for a MERN or payments description. The page stays one page by dropping the least relevant lines, not by inventing shorter ones.
      </Typography>

      <Typography variant="h2" sx={{ fontSize: 26, mt: 2 }}>Contact and education</Typography>
      <Typography>{contact.name}, {contact.location}</Typography>
      <Typography>{contact.email} · {contact.phone}</Typography>
      <Typography sx={{ mb: 2 }}>{education.plain}</Typography>

      <Typography variant="h2" sx={{ fontSize: 26 }}>What you are aiming at</Typography>
      <Typography>Roles: {preferences.roles.join(", ")}.</Typography>
      <Typography>Location: {preferences.location}. {preferences.workMode}</Typography>
      <Typography>Employment: {preferences.employment}.</Typography>
      <Typography>{preferences.authorization}</Typography>
      <Typography sx={{ mb: 2 }}>{preferences.notice} {preferences.salary}</Typography>

      {roles.map((role) => (
        <Box key={role.id} sx={{ mb: 2 }}>
          <Typography variant="h2" sx={{ fontSize: 26 }}>{role.company} — {role.title}</Typography>
          <Typography color="text.secondary">{role.dates}</Typography>
          {role.bullets.map((bullet) => (
            <Typography key={bullet.id} sx={{ mt: 1 }}>{bullet.plain}</Typography>
          ))}
        </Box>
      ))}

      <Typography variant="h2" sx={{ fontSize: 26, mt: 3 }}>Projects that can go on the resume</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
      {projects.filter((project) => project.onResume).map((project) => (
        <Box key={project.id}>
          <Typography sx={{ fontWeight: 700 }}>{project.name}</Typography>
          <Typography color="text.secondary">{project.stack}</Typography>
          {project.note && <Typography color="text.secondary">{project.note}</Typography>}
          {project.bullets.map((bullet) => (
            <Typography key={bullet.id} sx={{ mt: 0.75 }}>{bullet.plain}</Typography>
          ))}
        </Box>
      ))}
      </Box>

      <Typography variant="h2" sx={{ fontSize: 26 }}>Kept off the one-page resume</Typography>
      <Typography sx={{ mb: 1 }} color="text.secondary">
        These are real, and they are not sent unless you later decide one of them should replace a line above. Exotel is the story that carries a full-time application.
      </Typography>
      {bank.map((item) => (
        <Typography key={item.name} sx={{ mb: 1 }}>
          <strong>{item.name}. </strong>{item.line}
        </Typography>
      ))}

      <Typography variant="h2" sx={{ fontSize: 26, mt: 3 }}>Accomplishments</Typography>
      {accomplishments.map((item) => (
        <Typography key={item.id} sx={{ mb: 1 }}>{item.plain}</Typography>
      ))}
    </Box>
  );
}
