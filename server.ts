import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.post("/api/email/send", async (req, res) => {
    try {
      const { to, subject, htmlContent, senderName, senderEmail } = req.body;

      if (!process.env.BREVO_API_KEY) {
        return res.status(500).json({ error: 'BREVO_API_KEY is not configured in .env' });
      }

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: {
            name: senderName || "MoX Hunter Agent",
            email: senderEmail || "agent@moxhunter.com"
          },
          to: [
            { email: to }
          ],
          subject: subject || 'Outreach Update',
          htmlContent: htmlContent
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Brevo API Error:', errorData);
        return res.status(response.status).json({ error: 'Failed to send email', details: errorData });
      }

      const data = await response.json();
      return res.json({ success: true, data });
    } catch (error) {
      console.error('Error in email sending route:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
