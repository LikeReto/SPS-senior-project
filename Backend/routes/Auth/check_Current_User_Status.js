const router = require("express").Router();
const { UserModel } = require("../../config/DB");


router.get("/", (request, response) => {
    response.send("🚀 file: check_Current_User_Status.js ~> / page: check_Current_User_Status")
});

// Route to check current logged-in user status
router.post("/", async (request, response) => {
    try {
        const userInfo = request.body;
        if (!userInfo) {
            return response.status(400).json({ errorMessage: "Invalid user data." });
        }

        // Find the user in MongoDB by User_$ID
        const existingUser = await UserModel.findOne({ User_$ID: userInfo.User_$ID });
        if (!existingUser) {
            return response.status(404).json({ errorMessage: "User not found in database." });
        }

        // send success response with the userdata
        return response.status(200).json({
            success: true,
            message: "User status retrieved successfully.",
            userData: existingUser,
        });
    }
    catch (error) {
        console.error(`❌ routes/Auth/check_Current_User_Status ~> Error: ${error.message || error}`);
        return response.status(500).json({ errorMessage: "Something went wrong." });
    }
});

module.exports = router;