import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Learti.123',
  database: 'nestjs-blog',
  entities: ['**/*.entity.js'],
  migrations: ['migrations/*/js'],
});
