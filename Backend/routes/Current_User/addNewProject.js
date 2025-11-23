const router = require("express").Router();
const { UserModel } = require("../../config/DB");

router.get("/", (request, response) => {
    response.send("🚀 file: addNewProject.js ~> / page: addNewProject")
});

// Route to update current logged-in user profile
router.post("/", async (request, response) => {
    try {
        const newProject_Data = request.body;
        if (!newProject_Data || !newProject_Data.User_$ID) {
            console.error("❌ routes/Current_User/addNewProject ~> Invalid user data:", newProject_Data);
            return response.status(400).json({ errorMessage: "Invalid user data." });
        }
        // generate a unique project ID
        const projectId = `project_${Date.now()}_${Math.floor(Math.random() * 1000)}`; // e.g., project_1627891234567_123  

        const newProject = {
            Project_ID: projectId,
            Project_Title: newProject_Data.newProject.Project_Title || "Untitled Project",
            Project_Type: newProject_Data.newProject.Project_Type || "null",
            Project_Description: newProject_Data.newProject.Project_Description || "",
            Project_Status: newProject_Data.newProject.Project_Status || "active",
            Project_Image: newProject_Data.newProject.Project_Image || null,
            Project_Price: newProject_Data.newProject.Project_Price || 0,
            Project_Created_At: new Date(),
        }
        // Find the user in MongoDB by _id and update their profile(add new project to User_Projects array)
        const updatedUser = await UserModel.findOneAndUpdate(
            { User_$ID: newProject_Data.User_$ID },
            { // addToSet means to add the new project only if it doesn't already exist in the array
                $addToSet: { User_Projects: newProject }
            },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            console.error("❌ routes/Current_User/addNewProject ~> User not found with _id:", newProject_Data._id);
            return response.status(404).json({ errorMessage: "User not found." });
        }
        return response.status(200).json({
            message: "Project added successfully.",
            success: true,
            updatedUser: updatedUser
        });

    }
    catch (error) {
        console.error("❌ routes/Current_User/addNewProject ~> Error updating user profile:", error);
        return response.status(500).json({ errorMessage: "An error occurred while updating the user profile." });
    }
});

module.exports = router;