export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Login successful. Welcome back!",
    INVALID_CREDENTIALS: "The email or password you entered is incorrect.",
    MFA_REQUIRED: "Multi-factor authentication is required to continue.",
    OTP_INVALID: "The 6-digit code is invalid or has expired.",
    UNAUTHORIZED: "You are not authorized to access this resource.",
    TOKEN_EXPIRED: "Your session has expired. Please log in again.",
  },
  USER: {
    WELCOME: (name: string) => `Hi ${name}, welcome to FlipHealth!`,
    NOT_FOUND: "We couldn't find a user with that information.",
    ALREADY_EXISTS: "A user with this email is already registered.",
    PROFILE_UPDATED: "Your profile has been updated successfully.",
  },
  SYSTEM: {
    INTERNAL_ERROR: "Something went wrong on our end. Please try again later.",
    DATABASE_ERROR: "Failed to connect to the data service.",
  }
} as const;