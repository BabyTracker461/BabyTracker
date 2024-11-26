import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "../../../.env" });

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Supabase credentials are missing.");
  throw new Error("Supabase credentials are missing.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name } = req.body;

    console.log("Registering user:", { email, full_name });

    if (!email || !password || !full_name) {
      res.status(400).json({ error: "Email, password, and full name are required" });
      return;
    }

    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      console.error("Supabase signUp error:", authError.message);
      res.status(400).json({ error: authError.message });
      return;
    }

    const userId = authData.user?.id;

    if (!userId) {
      console.error("User ID is missing after registration");
      res.status(500).json({ error: "Failed to retrieve user ID" });
      return;
    }

    console.log("User successfully registered with ID:", userId);

    // Insert into the custom user_profiles table
    const { error: profileError } = await supabase.from("user_profiles").insert([
      {
        auth_user_id: userId, // Link to the Supabase auth.users table
        full_name, // User's full name
      },
    ]);

    if (profileError) {
      console.error("Profile creation error:", profileError.message);
      res.status(500).json({ error: "Failed to create user profile" });
      return;
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Unhandled error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    console.log("Attempting login for user:", { email });

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Log the user in
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Supabase login error:", error.message);
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      console.error("User ID is missing after login");
      res.status(500).json({ error: "Failed to retrieve user ID" });
      return;
    }

    console.log("User logged in successfully with ID:", userId);

    // Fetch the user's profile from user_profiles table
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("auth_user_id", userId)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError.message);
      res.status(500).json({ error: "Failed to fetch user profile" });
      return;
    }

    res.status(200).json({
      message: "Login successful",
      session: data.session,
      profile, // Return the user's profile
    });
  } catch (error) {
    console.error("Unhandled error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
