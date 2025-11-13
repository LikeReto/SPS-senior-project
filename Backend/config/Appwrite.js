const AppWrite_sdk = require("node-appwrite");

const AppWrite_client = new AppWrite_sdk.Client();

// ✨ for USERS creation 
let USERS = new AppWrite_sdk.Users(AppWrite_client);

// for AUth/Accounts functions
let Accounts = new AppWrite_sdk.Account(AppWrite_client)

let STORAGE = new AppWrite_sdk.Storage(AppWrite_client)

const Init_Appwrite = async () => {
    try {
        console.log("⌚ Initializing AppWrite...");

        AppWrite_client
            .setEndpoint(process.env.AppWrite_Project_EndPoint)
            .setProject(process.env.AppWrite_ProjectID)
            .setKey(process.env.AppWrite_Project_API_KEY)

        console.log("✅ Appwrite Initialized Successfully:");

        return true;
    } catch (error) {
        console.error(`❌ Error during Appwrite initialization: ${error.message}`);
        return false;
    }
};

module.exports = { Init_Appwrite, AppWrite_sdk, USERS, Accounts, STORAGE }
