import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const MONGODB_URI = 'mongodb://localhost:27017/mern-db';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // 1. Create a Tenant
    let tenant = await db.collection('tenants').findOne({ name: 'Default Tenant' });
    if (!tenant) {
      const res = await db.collection('tenants').insertOne({
        name: 'Default Tenant',
        code: 'DEFAULT',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      tenant = { _id: res.insertedId, name: 'Default Tenant' };
      console.log('Created Default Tenant:', tenant._id);
    } else {
      console.log('Default Tenant exists:', tenant._id);
    }

    // 2. Create a Role
    let role = await db.collection('roles').findOne({ name: 'Admin', tenantId: tenant._id });
    if (!role) {
      const res = await db.collection('roles').insertOne({
        name: 'Admin',
        tenantId: tenant._id,
        permissions: ['all'],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      role = { _id: res.insertedId, name: 'Admin' };
      console.log('Created Admin Role:', role._id);
    } else {
      console.log('Admin Role exists:', role._id);
    }

    // 3. Create a User
    const email = 'admin@example.com';
    const password = 'Password123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await db.collection('users').findOne({ email });
    if (!user) {
      const res = await db.collection('users').insertOne({
        firstName: 'Admin',
        lastName: 'User',
        email: email,
        password: hashedPassword,
        tenantId: tenant._id,
        role: role._id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Created Admin User. Email:', email, 'Password:', password);
    } else {
      await db.collection('users').updateOne({ email }, { $set: { password: hashedPassword, tenantId: tenant._id, role: role._id } });
      console.log('Updated Admin User password. Email:', email, 'Password:', password);
    }

    console.log('Seed completed successfully.');
    console.log('--- CREDENTIALS ---');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Tenant ID:', tenant._id.toString());
    console.log('Role ID:', role._id.toString());
    
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
