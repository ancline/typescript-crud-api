// src/_helpers/db.ts
import configJson from '../../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';


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

    
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    
    const sequelize = new Sequelize(database, user, password, {
        host,
        dialect: 'mysql',
        logging: false
    });

    
    const { default: userModel } = await import('../users/user.model');
    db.User = userModel(sequelize);

    
    await sequelize.sync({ alter: true });

    console.log('✅ Database initialized and models synced');
}