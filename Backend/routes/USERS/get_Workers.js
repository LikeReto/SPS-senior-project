const router = require("express").Router();
const { UserModel } = require("../../config/DB");

// Route to get all workers
router.get("/", async (request, response) => {
    return response.send("🚀 file: get_Workers.js ~> / page: get_Workers");
});

router.post("/", async (request, response) => {
    try {
        // get all users data
        const providers = await UserModel.find({ User_Permission: "user" }).select("-__v -updatedAt");
        
        return response.status(200).json({
            success: true,
            workersData: providers
        });
    }
    catch (error) {
        console.error(`❌ routes/USERS/get_Workers ~> Error: ${error.message || error}`);

        return response.status(500).json({ message: "Something went wrong." });
    }
});

module.exports = router;