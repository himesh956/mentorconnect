import { db } from './db/database.ts';

console.log('--- Seeding Mentor Connect AI Database ---');
db.seed();
console.log('✅ Database seeded successfully with:');
console.log(`- ${db.users.size} Users`);
console.log(`- ${db.mentorProfiles.size} Mentors`);
console.log(`- ${db.studentProfiles.size} Students`);
console.log(`- ${db.bookings.size} Bookings`);
console.log(`- ${db.verifications.size} Verifications`);
console.log(`- ${db.availability.size} Availability Slots`);
console.log(`- ${db.reviews.size} Reviews`);
console.log('Seed completed successfully!');
