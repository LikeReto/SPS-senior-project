const router = require("express").Router();
const { UserModel } = require("../../config/DB");

router.get("/", (request, response) => {
    response.send("🚀 file: updateLocation_coords ~> / page: updateLocation_coords")
});

// Update User_Rating of all users to a random float between 2.0 and 5.0
async function dummyFunction() {
  try {
    const users = await UserModel.find({});

    for (const user of users) {
      const randomRating = (Math.random() * (5 - 2) + 2).toFixed(1);

      user.User_Rating = parseFloat(randomRating); // ensures it's double, not string
      await user.save();

      console.log(`✅ Updated User_Rating for ${user.User_$ID} -> ${user.User_Rating}`);
    }

    console.log("🎉 All users updated successfully.");
  }
  catch (error) {
    console.error("❌ Error in dummyFunction:", error);
  }
}


// Route to update current logged-in user location coordinates
router.post("/", async (request, response) => {
    try {
        const locationData = request.body;
        if (!locationData || !locationData.User_$ID) {
            console.error("❌ routes/Current_User/updateLocation_coords ~> Invalid location data:", locationData);
            return response.status(400).json({ errorMessage: "Invalid location data." });
        }
        // Find the user in MongoDB by User_$ID and update their location coordinates
        const updatedUser = await UserModel.findOneAndUpdate(
            { User_$ID: locationData.User_$ID },
            {
                User_Location_Coords: {
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                }
            },
        );
        if (!updatedUser) {
            console.error("❌ routes/Current_User/updateLocation_coords ~> User not found with User_$ID:", locationData.User_$ID);
            return response.status(404).json({ errorMessage: "User not found." });
        }
        return response.status(200).json({
            message: "Location coordinates updated successfully.",
            success: true,
        });
    } 
    catch (error) {
        console.error("❌ routes/Current_User/updateLocation_coords ~> Error updating location coordinates:", error);
        return response.status(500).json({ errorMessage: "Internal server error." });
    }
});

module.exports = router;