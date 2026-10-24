"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setError("That password does not match.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2 }}>
      <Box component="form" onSubmit={submit} sx={{ width: "min(420px, 100%)" }}>
        <Typography variant="h1" sx={{ fontSize: 42, mb: 1 }}>Desk</Typography>
        <Typography sx={{ mb: 2, color: "text.secondary" }}>This copy is locked. Enter the password set for it.</Typography>
        <TextField
          type="password"
          label="Password"
          fullWidth
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <Typography sx={{ mt: 1, color: "secondary.main" }}>{error}</Typography>}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Open</Button>
      </Box>
    </Box>
  );
}
