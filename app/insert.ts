import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { user as usersTable } from '../database/schema';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const user: typeof usersTable.$inferInsert = {
    id: crypto.randomUUID(),
    name: 'Ingolf Didriksen',
    email: 'ingolf@test.no',
  };

  await db.insert(usersTable).values(user);
  console.log('New user created!')

  const user2: typeof usersTable.$inferInsert = {
    id: crypto.randomUUID(),
    name: 'Johannes Flaskepost',
    email: 'Johannes@posten.no',
  };

  await db.insert(usersTable).values(user2);

  const user3: typeof usersTable.$inferInsert = {
    id: crypto.randomUUID(),
    name: 'Carmelita Bonita',
    email: 'carmelita@asdf.es',
  };

  await db.insert(usersTable).values(user3);

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

}

main();

