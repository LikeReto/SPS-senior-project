const router = require("express").Router();
const { UserModel } = require("../../config/DB");
const { create_New_User_AppWrite, delete_User_AppWrite } = require("../../hooks/xAppwrite/Appwrite");
const { check_username_password } = require("../../hooks/Auth/check_username_password");

router.get("/", (request, response) => {
    response.send("🚀 file: create_New_User.js ~> / page: create_New_User");
});

// Route to create a new user
router.post("/", async (request, response) => {
    try {
        const userInfo = request.body;
        console.log(userInfo)
        // check username and password
        const checkResult = await check_username_password(userInfo);
        if (!checkResult.success) {
            return response.status(400).json({ message: checkResult.message });
        }
        // Create new user
        // first create it in Appwrite then in MongoDB

        // Appwrite user creation
        const appwriteReesponse = await create_New_User_AppWrite(userInfo);
        if (!appwriteReesponse || !appwriteReesponse.$id) {
            return response.status(500).json({ message: "Failed to create user in Appwrite." });
        }

        const newUser = new UserModel({
            User_$ID: appwriteReesponse.$id,
            User_Name: appwriteReesponse.name,
            User_UserName: userInfo.username.toLowerCase().replace(/\s+/g, ''),
        });

        // Save the new user to MongoDB
        const savedUser = await newUser.save();

        if (savedUser && savedUser._id) {
            // send success response with the userdata
            return response.status(200).json({
                success: true,
                message: "User created successfully.",
            });
        }
        else {
            // delete the user from Appwrite since MongoDB save failed
            await delete_User_AppWrite(appwriteReesponse.$id);

            return response.status(500).json({ message: "Failed to create user in database." });
        }


    }
    catch (error) {
        console.error(`❌ routes/Auth/create_New_User ~> Error: ${error.message || error}`);

        return response.status(500).json({ message: "Something went wrong." });
    }
});

module.exports = router;