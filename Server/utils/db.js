const mongoose = require("mongoose"); // Corrected 'required' to 'require'

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect("mongodb+srv://dvverma9211:1GkvU0xKULaQfSA3@cluster0.gzxku.mongodb.net/", {
      useNewUrlParser: true, // Recommended options for better compatibility
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected:", connectionInstance.connection.host);
  } catch (error) {
    console.log("MongoDB connection FAILED:", error);
    process.exit(1); // Exit the process with failure code
  }
};

module.exports = connectDB; // Corrected 'export default' to CommonJS syntax for Node.js
