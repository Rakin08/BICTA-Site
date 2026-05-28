
import { createConnection } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function resetDb() {
  const conn = await createConnection(process.env.DATABASE_URL!);

  await conn.execute("SET FOREIGN_KEY_CHECKS = 0");

  const [rows] = await conn.execute("SHOW TABLES") as any[];

  for (const row of rows) {
    const tableName = Object.values(row)[0];
    console.log("Dropping table: " + tableName);
    await conn.execute("DROP TABLE IF EXISTS `" + tableName + "`");
  }

  await conn.execute("SET FOREIGN_KEY_CHECKS = 1");

  console.log("All tables dropped.");
  await conn.end();
}

resetDb().catch(console.error);
