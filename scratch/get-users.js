import dns from 'node:dns';
dns.setServers(['1.1.1.1']);

import fs from 'fs';
import path from 'path';

// Load backend .env variables
const backendEnvPath = path.resolve('../ibl-fintech-backend/.env');
const envContent = fs.readFileSync(backendEnvPath, 'utf8');
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().replace(/^['"](.*)['"]$/, '$1');
    if (key && !key.startsWith('#')) {
      process.env[key] = value;
    }
  }
});

import connectDB from '../../ibl-fintech-backend/src/config/database.js';
import User from '../../ibl-fintech-backend/src/models/user.model.js';
import Role from '../../ibl-fintech-backend/src/models/role.model.js';
import mongoose from '../../ibl-fintech-backend/node_modules/mongoose/index.js';

const run = async () => {
  await connectDB();
  const user = await User.findOne({ email: 'admin@gmail.com' });
  if (user) {
    user.password = 'admin1234';
    await user.save();
    console.log('Successfully set password for admin@gmail.com to admin1234');
  } else {
    console.log('admin@gmail.com user not found');
  }
  await mongoose.disconnect();
};

run().catch(console.error);
