import { createClient } from "@supabase/supabase-js";

// Define types for the parameters
interface RegisterUserParams {
  email: string;
  password: string;
  fullName: string;
}

interface LoginUserParams {
  email: string;
  password: string;
}

// Initialize the Supabase client
const SUPABASE_URL = "https://nhiqqduzovucbeexfilx.supabase.co"; // Your Supabase URL
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oaXFxZHV6b3Z1Y2JlZXhmaWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyMjc3MTksImV4cCI6MjA0NzgwMzcxOX0.z6aTL4go6uJH1-Ow5ef066WZbRE70OToaEe06SXPO48"; // Your anon key

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase credentials are missing.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to register a new user
export const registerUser = async ({ email, password, fullName }: RegisterUserParams) => {
  try {
    if (!email || !password || !fullName) {
      throw new Error("Email, password, and full name are required");
    }

    console.log(`Registering user: ${email}, ${fullName}`);

    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Auth Error:", authError.message);
      throw new Error(authError.message);
    }

    const userId = authData.user?.id;

    if (!userId) {
      throw new Error("Failed to retrieve user ID from Supabase Auth");
    }

    console.log("User registered successfully in auth.users. ID:", userId);

    // Insert user profile into the `user_profiles` table
    const { error: profileError } = await supabase.from("user_profiles").insert([
      {
        auth_user_id: userId, // Link to the Supabase auth.users table
        full_name: fullName, // User's full name
      },
    ]);

    if (profileError) {
      console.error("Profile Insertion Error:", profileError.message);
      throw new Error("Failed to insert user profile into user_profiles");
    }

    console.log("User profile created successfully for ID:", userId);

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
export const loginUser = async ({ email, password }: LoginUserParams) => {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    console.log(`Logging in user: ${email}`);

    // Log the user in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Auth Login Error:", error.message);
      throw new Error("Invalid credentials");
    }

    const userId = data.user?.id;

    if (!userId) {
      throw new Error("Failed to retrieve user ID during login");
    }

    console.log("User logged in successfully. ID:", userId);

    // Fetch the user's profile from the `user_profiles` table
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("auth_user_id", userId)
      .single();

    if (profileError) {
      console.error("Profile Fetch Error:", profileError.message);
      throw new Error("Failed to fetch user profile");
    }

    console.log("User profile fetched successfully for ID:", userId);

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

// Additional helper function to check user profile
export const getUserProfile = async (authUserId: string) => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("auth_user_id", authUserId)
      .single();

    if (error) {
      console.error("Profile Fetch Error:", error.message);
      throw new Error("Failed to fetch user profile");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching user profile:", error.message);
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred while fetching user profile");
  }
};
