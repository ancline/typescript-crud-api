// src/_helpers/db.ts
import configJson from '../../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';

// Type the config explicitly
const config = configJson as {
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    };
    jwtSecret: string;
};

export interface Database {
    User: any;
}

export const db: Database = {} as Database;

export async function initialize(): Promise<void> {
    const { host, port, user, password, database } = config.database;

    // Create database if it doesn't exist
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    // Connect with Sequelize
    const sequelize = new Sequelize(database, user, password, {
        host,
        dialect: 'mysql',
        logging: false
    });

    // Initialize models
    const { default: userModel } = await import('../users/user.model');
    db.User = userModel(sequelize);

    // Sync models
    await sequelize.sync({ alter: true });

    console.log('✅ Database initialized and models synced');
}