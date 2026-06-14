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

    // 2. Create Roles with proper permissions
    // First, delete ALL existing roles for this tenant to start fresh
    await db.collection('roles').deleteMany({ tenantId: tenant._id });
    console.log('✓ Cleared existing roles for this tenant');
    
    const rolesToCreate = [
      { 
        name: 'Admin', 
        permissions: ['all'],
        description: 'Administrator with all permissions'
      },
      { 
        name: 'Principal', 
        permissions: ['staff.read', 'staff.create', 'staff.update', 'staff.delete', 'students.read', 'students.create', 'students.update', 'students.delete', 'class.manage', 'academic.manage', 'reports.generate'],
        description: 'School Principal'
      },
      { 
        name: 'Teacher', 
        permissions: ['students.read', 'students.update', 'attendance.mark', 'attendance.read', 'class.view', 'leave.request', 'leave.view'],
        description: 'Teacher'
      },
      { 
        name: 'Accountant', 
        permissions: ['staff.read', 'students.read', 'fees.collect', 'fees.view', 'fees.report', 'reports.view'],
        description: 'School Accountant'
      },
      { 
        name: 'Librarian', 
        permissions: ['students.read', 'staff.read', 'class.view'],
        description: 'School Librarian'
      },
      { 
        name: 'Counselor', 
        permissions: ['students.read', 'staff.read', 'leave.view', 'attendance.view'],
        description: 'School Counselor'
      },
      {
        name: 'Student',
        permissions: ['attendance.read', 'leave.request', 'academic.view'],
        description: 'Student'
      },
      {
        name: 'Parent',
        permissions: ['students.read', 'attendance.read', 'academic.view'],
        description: 'Parent/Guardian'
      }
    ];

    console.log('\n=== Creating Roles ===');
    let adminRole = null;
    
    for (const roleData of rolesToCreate) {
      try {
        // Create new role
        const res = await db.collection('roles').insertOne({
          name: roleData.name,
          description: roleData.description,
          tenantId: tenant._id,
          permissions: roleData.permissions,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`✓ Created ${roleData.name} role:`, res.insertedId);
        
        if (roleData.name === 'Admin') {
          adminRole = { _id: res.insertedId, name: 'Admin' };
        }
      } catch (err) {
        console.error(`✗ Error creating ${roleData.name} role:`, err.message);
      }
    }

    // Verify roles were created
    const createdRoles = await db.collection('roles').find({ tenantId: tenant._id }).toArray();
    console.log(`\n✓ Total roles created: ${createdRoles.length}`);
    createdRoles.forEach(r => console.log(`  - ${r.name}`));

    // 3. Create a User
    const email = 'admin@example.com';
    const password = 'Password123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await db.collection('users').findOne({ email, tenantId: tenant._id });
    
    if (!user && adminRole) {
      const res = await db.collection('users').insertOne({
        firstName: 'Admin',
        lastName: 'User',
        email: email,
        password: hashedPassword,
        tenantId: tenant._id,
        role: adminRole._id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('\n✓ Created Admin User:', email);
    } else if (user) {
      console.log('\n✓ Admin User already exists:', email);
    }

    console.log('\n=== Seed Completed ===');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Tenant ID:', tenant._id.toString());
    
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
