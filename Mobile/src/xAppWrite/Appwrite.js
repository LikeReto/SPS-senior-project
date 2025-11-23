// xAppWrite/Appwrite.js
import { Client, Account, Storage } from "react-native-appwrite";

const userClient = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Appwrite Endpoint
  .setProject("69050d4f003bded93ffb"); // Appwrite Project ID


const userAccount = new Account(userClient);

const storage = new Storage(userClient);

// 🚀Function to get the current account
export async function getCurrentUser() {
  try {
    if (!userClient) {
      console.error('❌ No user Client found');
      return null;
    }
    // Check if the user is logged in
    const accountDetails = await userAccount.get();
    if (!accountDetails) {
      return null;
    }
    const post_data = {
      ...accountDetails,
      password: accountDetails.password || "",
    }
    return post_data;
  }
  catch (error) {
    console.error('❌ Appwrite ~> Error in getting Current Account:', error.message);
    return null;
  }
};

// 🚀Function to register a new user
export const Login_Current_User = async (userInfo) => {
  try {
    if (userInfo) {
      const logging_In = await userAccount.createEmailPasswordSession(
        {
          email: userInfo.email,
          password: userInfo.password,
        }
      );
      if (logging_In) {
        return { success: true, session: logging_In };
      }
      else {
        console.error("❌ Login failed: No session returned");
        return false;
      }
    }
    else {
      console.error("❌ Login failed: No user info provided");
      return false;
    }
  }
  catch (err) {
    console.error("❌ Something went wrong:", err.message);
    return false;
  }
};

// 🚀Function to logout the current user
export const logout_Current_User = async () => {
  try {
    return await userAccount.deleteSession(
      {
        sessionId: "current",
      }
    );
  }
  catch (err) {
    throw err;
  }
};

// 🚀Function to update the current user profile
export const update_Current_User_Profile = async (userInfo) => {
  try {
    if (userInfo) {
      // Now update the name if provided
      if (userInfo.User_Name) {
        const updated_User_Name = await userAccount.updateName({
          name: userInfo.User_Name,
        }
        );
        console.log("✅ Appwrite ~> User Name updated:", updated_User_Name.name);
      }
      // Now update the phone number if provided
      if (userInfo.User_PhoneNumber) {
        const updated_User_Phone = await userAccount.updatePhone(
          {
            phone: userInfo.User_PhoneNumber,
            password: (await userAccount.get()).password,
          }
        )
        console.log("✅ Appwrite ~> User Phone updated:", updated_User_Phone.phone);
      }
      // Now update the email if provided
      if (userInfo.newEmail) {
        const updated_User_Email = await userAccount.updateEmail(
          {
            email: userInfo.newEmail,
            password: (await userAccount.get()).password,
          }
        );
        console.log("✅ Appwrite ~> User Email updated:", updated_User_Email.newEmail);
      }

      return {
        success: true,
        // return the updated user info
        updatedUserInfo: await userAccount.get(),
      };
    }
  }
  catch (err) {
    console.error("❌Appwrite ~> Something went wrong:", err.message);
    return false;
  }
}

// 🚀Function to upload a file to storage 
export const upload_File_To_Storage = async (MediaFile) => {
  try {
    if (MediaFile) {
      const upload_Response = await storage.createFile({
        bucketId: "6907d2c4000600e306c5",
        file: MediaFile,
        fileId: `unique()`,
      });
      // Assuming you have already uploaded a file and have its fileId
      const fileId = upload_Response.$id;
      const bucketId = "6907d2c4000600e306c5";
      const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID
      
      // Generate the file URL
      const fileURL = `${userClient.config.endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
      return {
        success: true,
        projectFileURL: fileURL,
      }
    }
  }
  catch (err) {
    console.error("❌ Appwrite ~> Error uploading file to storage:", err.message);
    return false;
  }
};
// 🚀Function to remove a file from storage
export const delete_File_From_Storage = async (fileId) => {
  try {
    if (fileId) {
      const delete_Response = await storage.deleteFile({
        bucketId: "6907d2c4000600e306c5",
        fileId: fileId,
      });
      return {
        success: true,
        response: delete_Response,
      }
    }
  }
  catch (err) {
    console.error("❌ Appwrite ~> Error deleting file from storage:", err.message);
    return false;
  }
};
