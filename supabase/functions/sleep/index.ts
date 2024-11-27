import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const SUPABASE_URL = "https://your-supabase-url.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key"; // Use the anon/public key

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase credentials are missing.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to register a new user
export const registerUser = async (email: string, password: string, fullName: string) => {
  try {
    if (!email || !password || !fullName) {
      throw new Error("Email, password, and full name are required");
    }

    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      throw new Error(authError.message);
    }

    const userId = authData.user?.id;

    if (!userId) {
      throw new Error("Failed to retrieve user ID");
    }

    // Insert user profile into the `user_profiles` table
    const { error: profileError } = await supabase.from("user_profiles").insert([
      {
        auth_user_id: userId, // Link to the Supabase auth.users table
        full_name: fullName, // User's full name
      },
    ]);

    if (profileError) {
      throw new Error(profileError.message);
    }

    return { message: "User registered successfully" };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during user registration:", error.message);
      return { error: error.message };
    }
    console.error("Unknown error during user registration:", error);
    return { error: "An unexpected error occurred" };
  }
};

// Function to log in a user
export const loginUser = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Log the user in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw new Error("Invalid credentials");
    }

    const userId = data.user?.id;

    if (!userId) {
      throw new Error("Failed to retrieve user ID");
    }

    // Fetch the user's profile from the `user_profiles` table
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("auth_user_id", userId)
      .single();

    if (profileError) {
      throw new Error(profileError.message);
    }

    return {
      message: "Login successful",
      session: data.session, // Contains tokens for future API requests
      profile, // User's profile data
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during login:", error.message);
      return { error: error.message };
    }
    console.error("Unknown error during login:", error);
    return { error: "An unexpected error occurred" };
  }
};

// Function to add a sleep entry
export const addSleepEntry = async (startTime: string, endTime: string, notes: string) => {
  try {
    if (!startTime || !endTime) {
      throw new Error("Start time and end time are required");
    }

    // Calculate duration in seconds
    const durationSeconds = Math.floor(
      (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
    );

    if (durationSeconds <= 0) {
      throw new Error("End time must be after start time");
    }

    // Insert sleep data into Supabase
    const { data, error } = await supabase
      .from("sleep_tracker")
      .insert([{ start_time: startTime, end_time: endTime, duration_seconds: durationSeconds, notes }]);

    if (error) {
      throw new Error(error.message);
    }

    return { message: "Sleep entry added successfully", data };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during adding sleep entry:", error.message);
      return { error: error.message };
    }
    console.error("Unknown error during adding sleep entry:", error);
    return { error: "An unexpected error occurred" };
  }
};

// Function to fetch sleep entries
export const fetchSleepEntries = async (startDate?: string, endDate?: string) => {
  try {
    let query = supabase.from("sleep_tracker").select("*");

    if (startDate) {
      query = query.gte("start_time", new Date(startDate).toISOString());
    }
    if (endDate) {
      query = query.lte("end_time", new Date(endDate).toISOString());
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return { data };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during fetching sleep entries:", error.message);
      return { error: error.message };
    }
    console.error("Unknown error during fetching sleep entries:", error);
    return { error: "An unexpected error occurred" };
  }
};
