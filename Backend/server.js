const express = require("express");
const http = require("http");
const { Init_Appwrite } = require("./config/Appwrite");
const { Init_MongoDB } = require("./config/DB");
const { configureExpress } = require("./config/express");
const { Socket_io } = require("./config/Socket_io");
require("dotenv/config");

const app = express();
const router = express.Router();
const PORT = process.env.SERVER_PORT || 8800;

// Main entry point for server startup
// ✅ Start Server Only After Services Are Ready
const startServer = async () => {
    try {
        console.log("⚡ Initializing services...");

        // Initialize all services
        const init_service_response = await initServices();
        if (!init_service_response) {
            console.error("❌ Failed to initialize services. Exiting...");
            process.exit(1);
        }

        console.log("🚀 Services are initialized successfully!");

        // ✅ Create HTTP server from Express
        const server = http.createServer(app);

        // start Socket io 
        await Socket_io(server);

        const createServer_response = await createServer();
        if (!createServer_response) {
            console.error("❌ Failed to create Express server. Exiting...");
            process.exit(1); 
        }

        // ✅ Start both Express + Socket.io together
        server.listen(PORT, () => {
            console.log(`🚀 Server started! Listening on PORT: ${PORT}`);
        });

    }
    catch (error) {
        console.error("❌ Error in Starting the Server", error);
        process.exit(1);
    }
};


// Create and configure Express server
const createServer = async () => {
    try {
        const configureExpress_response = await configureExpress(app);
        if (!configureExpress_response) return false;

        // Define the root route first
        app.get("/", (req, res) => {
            res.send("🚀🚀🚀 Server Running");
        });

        app.use("/", router)

        // Dynamically Load Routes
        const routes = require("./routes/index");
        app.use("/", routes);

        return true;
    }
    catch (error) {
        console.error('❌ Error during server creation:', error);
        return null
    }
};

// Async Initialization for all services
const initServices = async () => {
    try {
        // Initialize Appwrite
        const Init_Appwrite_response = await Init_Appwrite();
        if (Init_Appwrite_response !== true) return false;
        // Initialize MongoDB
        const Init_MongoDB_response = await Init_MongoDB();
        if (Init_MongoDB_response !== true) return false;

        //  pre-populate the databases if needed


        return true;
    }
    catch (error) {
        console.error("❌ Error during services initialization:", error);
        return false;
    }
};

// Start the server
startServer();