const router = require("express").Router();
const { UserModel } = require("../../config/DB");
const { getUserBy_Id_Email_AppWrite } = require("../../hooks/xAppwrite/Appwrite");


router.get("/", (request, response) => {
    response.send("🚀 file: login_Current_User.js ~> / page: login_Current_User")
});

// Route to get current logged-in user info
router.post("/", async (request, response) => {
    try {
        const userInfo = request.body;
        if (!userInfo) {
            return response.status(400).json({ errorMessage: "Invalid user data." });
        }

        // Use the getUserBy_Id_Email correctly to search by email
        const authUser = await getUserBy_Id_Email_AppWrite(userInfo);
        if (!authUser || !authUser.$id) {
            return response.status(404).json({ errorMessage: "User not found." });
        }
        // Find the user in MongoDB by User_$ID
        const existingUser = await UserModel.findOne({ User_$ID: authUser.$id });
        if (!existingUser) {
            return response.status(404).json({ errorMessage: "User not found in database." });
        }
        // send success response with the userdata
        return response.status(200).json({
            success: true,
            message: "User logged in successfully.",
            userData: existingUser,
        });

    }
    catch (error) {
        console.error(`❌ routes/Auth/login_Current_User ~> Error: ${error.message || error}`);
        return response.status(500).json({ errorMessage: "Something went wrong." });
    }
});

module.exports = router;