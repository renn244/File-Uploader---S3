import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export const databaseProviders: Provider[] = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async (configService: ConfigService) => {
            const isProduction = configService.get<string>('SOFTWARE_ENV') === 'production' ? true : false
            
            const dataSource = new DataSource({
                type: 'postgres',
                url: configService.get<string>('DATABASE_URL'),
                logging: isProduction ? false : true,
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                synchronize: isProduction ? false : true,
            })

            return dataSource.initialize();
        },
        inject: [ConfigService]
    }
]