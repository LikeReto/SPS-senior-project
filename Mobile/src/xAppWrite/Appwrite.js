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
