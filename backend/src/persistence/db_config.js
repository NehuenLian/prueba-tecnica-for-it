import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function startDB() {
    const connection = await open({
        filename: './databse.sqlite',
        driver: sqlite3.Database
    });

    await connection.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        completed INTEGER DEFAULT 0
        )
    `);

    return connection
}

const db = await startDB();

export default db;