const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();


// Route Definitions
// Routes
const routeGroups = [
    {
        path: "/api/sps",
        folder: "Auth",
        files: [
            "check_Current_User_Status",
            "create_New_User",
            "delete_Current_User",
            "forgot_Password",
            "login_Current_User",
            "logout_Current_User",
            "reset_Password",
        ]
    },
    {
        path: "/api/sps",
        folder: "Current_User",
        files: [
            "Update_Current_User_Profile",
            "getALL_User_Notifications",
        ]
    },
    {
        path: "/api/sps",
        folder: "second_User2",
        files: [
            "getUserData_User2",
        ]
    },
    {
        path: "/api/sps",
        folder: "Chats",
        files: [
            "create_new_Conversation",
            "getMessages",
            "getConversations",
            "sendMessage",
        ]
    },
    {
        path: "/api/sps",
        folder: "USERS",
        files: [
            "get_Workers",
        ]
    }
];

// Dynamically Load Routes
routeGroups.forEach(({ path: basePath, folder, files }) => {
    let folderLogged = false; // Track if the folder name has been logged
    let loadedCount = 0; // Track the number of successfully loaded files

    files.forEach((file) => {
        try {
            const routePath = path.join(__dirname, folder, `${file}.js`);
            if (!fs.existsSync(routePath)) {
                console.warn(`⚠️ WARNING: ${file}.js in ${folder} not found.`);
                return;
            }

            if (!folderLogged) {
                console.log(`\n----📂 ( ${folder} ) ----- 🗃️  ${files.length || 0} \n`); // Print folder name once
                folderLogged = true;
            }

            const loadedRoute = require(routePath);
            if (typeof loadedRoute === "function") {
                router.use(`${basePath}/${file}`, loadedRoute);
                loadedCount++; // Increment the count of successfully loaded routes
                console.log(`✅ Route registered: ${basePath}/${file}`);
            } else {
                console.error(`❌ ERROR: ${file} in ${folder} is not exporting a valid router.`);
            }
        }
        catch (error) {
            console.error(`❌ Failed to load: ${file} from ${folder}\n`, error.message);
        }
    });

    console.log(`\n--------🗃️  ${loadedCount} routes loaded ------------`);
});


module.exports = router;