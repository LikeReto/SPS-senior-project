const express = require('express');
const cors = require("cors");
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');


// cors options
const corsOptions = {
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
};

const set_config = async (app) => {
    try {
        // CORS Configuration
        app.use(cors(corsOptions));

        // JSON & URL-Encoded Middleware
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        // Serve Static Files (Cache for 1 Year)
        app.use(express.static("public", { maxAge: 31536000 }));

        // Enable Gzip Compression
        app.use(compression());

        // middleware
        // Helmet for security headers
        app.use(helmet());
        // Logging HTTP requests
        app.use(morgan("common"));

        return true;
    }
    catch (error) {
        console.error("❌ Failed to Setting Express Configs ", error)
        return false;
    }
}

const configureExpress = async (app) => {
    try {
        // Setup Logging
        console.log("🛠️ Configuring Express middleware...");
        console.log("⌚ Initializing Express...");

        const set_config_response = await set_config(app)

        if (set_config_response !== true) {
            return false;
        }

        console.log('✅ Express & Middleware are Initialized Successfully!')

        return true;
    }
    catch (error) {
        console.error("❌ Failed to Initializing Express ", error)
        return false;
    }
}

module.exports = { configureExpress }