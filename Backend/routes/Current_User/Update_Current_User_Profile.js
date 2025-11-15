const router = require("express").Router();
const { UserModel } = require("../../config/DB");
const { update_Current_User_AppWrite } = require("../../hooks/xAppwrite/Appwrite");

router.get("/", (request, response) => {
    response.send("🚀 file: Update_Current_User_Profile.js ~> / page: Update_Current_User_Profile")
});

// Route to update current logged-in user profile
router.post("/", async (request, response) => {
    try {
        const updatedUserInfo = request.body;
        if (!updatedUserInfo || !updatedUserInfo._id) {
            console.error("❌ routes/Current_User/Update_Current_User_Profile ~> Invalid user data:", updatedUserInfo);
            return response.status(400).json({ errorMessage: "Invalid user data." });
        }

        // First, update user info in Appwrite
        const appwriteUpdateResult = await update_Current_User_AppWrite(updatedUserInfo);
        if (!appwriteUpdateResult.success) {
            return response.status(500).json({ errorMessage: "Failed to update user in Appwrite." });
        }
        // Find the user in MongoDB by _id and update their profile
        const updatedUser = await UserModel.findByIdAndUpdate(
            updatedUserInfo._id,
            {
                User_Age: updatedUserInfo.User_Age,
                User_Job: updatedUserInfo.User_Job,
                User_Degree: updatedUserInfo.User_Degree,
                User_Bio: updatedUserInfo.User_Bio,
                User_Birthday: updatedUserInfo.User_Birthday,
                User_Country: updatedUserInfo.User_Country,
                User_Name: updatedUserInfo.User_Name,
                User_UserName: updatedUserInfo.User_UserName,
                User_PhoneNumber: updatedUserInfo.User_PhoneNumber,
                User_CountryCode: updatedUserInfo.User_CountryCode,
                User_CallingCode: updatedUserInfo.User_CallingCode,
                User_Profile_Picture: appwriteUpdateResult.updatedData.profileURL,
                onBoarded_finished: updatedUserInfo.onBoarded_finished,
                User_Skills: updatedUserInfo.User_Skills,
                User_Projects: updatedUserInfo.User_Projects,
            },
            { new: true } // Return the updated document
        )
            ||
            // If not found by _id, try to find by User_$ID
            await UserModel.findOneAndUpdate(
                { User_$ID: updatedUserInfo.User_$ID },
                {
                    User_Age: updatedUserInfo.User_Age,
                    User_Job: updatedUserInfo.User_Job,
                    User_Degree: updatedUserInfo.User_Degree,
                    User_Bio: updatedUserInfo.User_Bio,
                    User_Birthday: updatedUserInfo.User_Birthday,
                    User_Country: updatedUserInfo.User_Country,
                    User_Name: updatedUserInfo.User_Name,
                    User_UserName: updatedUserInfo.User_UserName,
                    User_PhoneNumber: updatedUserInfo.User_PhoneNumber,
                    User_Profile_Picture: updatedUserInfo.User_Profile_Picture,
                    onBoarded_finished: updatedUserInfo.onBoarded_finished,
                    User_Skills: updatedUserInfo.User_Skills,
                    User_Projects: updatedUserInfo.User_Projects,
                },
                { new: true } // Return the updated document
            );

        if (!updatedUser) {
            return response.status(404).json({ errorMessage: "User not found in database." });
        }
        // send success response with the updated userdata
        return response.status(200).json({
            success: true,
            message: "User profile updated successfully.",
            updateUserData: updatedUser,
        });
    }
    catch (error) {
        console.error(`❌ routes/Current_User/Update_Current_User_Profile ~> Error: ${error.message || error}`);
        return response.status(500).json({ errorMessage: "Something went wrong." });
    }
});

module.exports = router;