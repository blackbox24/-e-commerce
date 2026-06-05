# -e-commerce

E-Commerce platform with cart and payment gateway integration.

## Setting Up Typescript env

- Run `npm init` to initialize the project with package.json
- Run `npm install typescript tsx @types/node --save-dev` to install typescript package
- Run `npx tsc --init` to initialize the typescript env
- 

## Using Prisma for ORM

- Run the following to install packages for postgres and prisma

```sh
npm install prisma @types/pg --save-dev
npm install @prisma/client @prisma/adapter-pg pg dotenv
```

```txt
- prisma - The Prisma CLI for running commands like prisma init, prisma migrate, and prisma generate
- @prisma/client - The Prisma Client library for querying your database
- @prisma/adapter-pg - The node-postgres driver adapter that connects Prisma Client to your database
- pg - The node-postgres database driver
- @types/pg - TypeScript type definitions for node-postgres
- dotenv - Loads environment variables from your .env file
```

- Update tsconfig.json for ESM compatibility:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",
    "strict": true,
    "esModuleInterop": true,
    "ignoreDeprecations": "6.0"
  }
}
```

- Update package.json to enable ESM:

```json
{
  "type": "module"
}
```

- Invoke the Prisma CLI by prefixing it with npx `npx prisma`
- Setup a Prisma ORM schema using `npx prisma init --datasource-provider postgresql --output ../generated/prisma`
- Add the `DATABASE_URL` in .env file
- Modify the prisma/schema.prisma file with the following

```txt
model User {
  id    Int     @id @default(autoincrement()) 
  email String  @unique
  first_name  String
  middle_name  String?
  last_name  String
  password  String
}

model Post { 
  id        Int     @id @default(autoincrement()) 
  title     String
  content   String?
  published Boolean @default(false) 
  author    User    @relation(fields: [authorId], references: [id]) 
  authorId  Int
} 
```

- Run  `npx prisma migrate dev --name init` to create your first migration to set up the database tables
- Run `npx prisma generate` to create the tables in the database
- Create instantiate of prisma client

```typescript
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
```

- For test purposes use this script

```typescript
import { prisma } from "@/config/db";

async function main() {
  // Create a new user with a post
  const user = await prisma.user.create({
    data: {
      first_name: "Alice",
      last_name: "Forson",
      email: "alice@prisma.io",
      password: "testthis123"
    },
  });
  console.log("Created user:", user);

  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  console.log("All users:", JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```
