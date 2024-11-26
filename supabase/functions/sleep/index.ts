import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Import authentication logic from auth.ts
import { registerUser, loginUser } from "../Auth/auth"; 

// Load environment variables
dotenv.config({ path: "../../../.env" });

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Supabase credentials are missing.");
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Middleware to validate JSON payloads
const validateJSONMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ error: "Invalid or missing JSON payload" });
  } else {
    next();
  }
};

// Authentication routes
app.post("/register", registerUser);
app.post("/login", loginUser);

// POST endpoint to add a sleep entry
app.post(
  "/sleep",
  validateJSONMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { start_time, end_time, notes } = req.body;

      // Validate required fields
      if (!start_time || !end_time) {
        res.status(400).json({ error: "Missing required fields: start_time and/or end_time" });
        return;
      }

      // Calculate duration in seconds
      const duration_seconds = Math.floor(
        (new Date(end_time).getTime() - new Date(start_time).getTime()) / 1000
      );

      if (duration_seconds <= 0) {
        res.status(400).json({ error: "End time must be after start time" });
        return;
      }

      // Insert sleep data into Supabase
      const { data, error } = await supabase
        .from("sleep_tracker")
        .insert([{ start_time, end_time, duration_seconds, notes }]);

      if (error) {
        console.error("Database insert error:", error.message);
        res.status(500).json({ error: "Database error", details: error.message });
        return;
      }

      res.status(201).json({ success: true, data });
    } catch (error) {
      console.error("Unhandled error:", error instanceof Error ? error.message : error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET endpoint to retrieve sleep entries
app.get("/sleep", async (req: Request, res: Response): Promise<void> => {
  try {
    const { start_date, end_date } = req.query;

    // Build query for Supabase
    let query = supabase.from("sleep_tracker").select("*");

    if (start_date) {
      query = query.gte("start_time", new Date(start_date as string).toISOString());
    }
    if (end_date) {
      query = query.lte("end_time", new Date(end_date as string).toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database query error:", error.message);
      res.status(500).json({ error: "Database error", details: error.message });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Unhandled error:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Catch-all route for unsupported methods
app.use((req: Request, res: Response) => {
  res.status(405).json({ error: "Method not allowed" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

