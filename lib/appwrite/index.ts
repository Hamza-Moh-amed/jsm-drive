"use server";
// Import required modules and classes from the "node-appwrite" package
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";

// Import the Appwrite configuration object from a local file
import { appwriteConfig } from "./config";

// Import the cookies module from Next.js to manage HTTP cookies
import { cookies } from "next/headers";

/**
 * Creates a session-based Appwrite client.
 * This function is used to authenticate requests based on the current user's session stored in cookies.
 *
 * @returns {Promise<Object>} An object containing Appwrite services (Account, Databases) with the user's session.
 * @throws Will throw an error if the session cookie is not present or invalid.
 */
export const createSessionClient = async () => {
  // Initialize an Appwrite client instance and set the endpoint and project ID from the configuration
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl) // Appwrite server URL
    .setProject(appwriteConfig.projectId); // Appwrite project ID

  // Retrieve the "appwrite-session" cookie from the client's browser
  const session = await (await cookies()).get("appwrite-session");

  // If the session cookie is not available or empty, throw an error
  if (!session || !session.value) throw new Error("no session");

  // Use the session value to authenticate the client
  client.setSession(session.value);

  // Return an object exposing useful Appwrite services (Account, Databases)
  return {
    get account() {
      return new Account(client); // Access the authenticated user's account
    },
    get databases() {
      return new Databases(client); // Access Appwrite database services
    },
  };
};

/**
 * Creates an admin-level Appwrite client.
 * This function is used for server-side operations that require administrative privileges.
 *
 * @returns {Promise<Object>} An object containing Appwrite services (Account, Databases, Storage, Avatars) with admin access.
 */
export const createAdminClient = async () => {
  // Initialize an Appwrite client instance and set the endpoint and project ID from the configuration
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl) // Appwrite server URL
    .setProject(appwriteConfig.projectId) // Appwrite project ID
    .setKey(appwriteConfig.secretKey); // Set the secret API key for admin access

  // Return an object exposing useful Appwrite services (Account, Databases, Storage, Avatars)
  return {
    get account() {
      return new Account(client); // Manage user accounts with admin privileges
    },
    get databases() {
      return new Databases(client); // Perform database operations
    },
    get storage() {
      return new Storage(client); // Manage file storage operations
    },
    get avatars() {
      return new Avatars(client); // Access avatar services for user profile images
    },
  };
};
