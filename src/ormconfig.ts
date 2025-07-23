import {ConnectionOptions, getMetadataArgsStorage} from 'typeorm';
// You can load you .env file here synchronously using dotenv package (not installed here),
// import * as dotenv from 'dotenv';
// import * as fs from 'fs';
// const environment = process.env.NODE_ENV || 'development';
// const data: any = dotenv.parse(fs.readFileSync(`${environment}.env`));
// You can also make a singleton service that load and expose the .env file content.
// ...


// Check typeORM documentation for more information.
const config: ConnectionOptions = {
  type: 'sqlite',
  database: 'db',
  // entities: ["./**/*.entity.js" ],
  entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),

  // We are using migrations, synchronize should be set to false.
//   synchronize: false,

    synchronize: true,
 

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
//   migrationsRun: true,
//   logging: true,
//   logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/migrations/**/*{.ts,.js}']
};

// TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db',
    //   entities: [Music, MusicCollection, User],
    //   migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    //   synchronize: true,
    //   autoLoadEntities: true,
    // }),

export = config;