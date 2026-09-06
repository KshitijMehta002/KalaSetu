import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kalasetu';

  try {
    // Attempt connecting to configured URI with short timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`[Database] Connected to MongoDB at: ${uri}`);
  } catch (err) {
    console.warn(`[Database] Direct connection to ${uri} failed: ${err.message}`);
    console.log('[Database] Starting built-in MongoDB Memory Server for seamless development...');
    
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to in-memory MongoDB at: ${memoryUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to start MongoDB Memory Server:', memErr.message);
      throw memErr;
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
    console.log('[Database] Disconnected from MongoDB');
  } catch (err) {
    console.error('[Database] Error during disconnection:', err.message);
  }
};

export default connectDB;
