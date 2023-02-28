import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';


//Prisma Client allows you to connect to database
@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config:ConfigService){
        super({
            datasources:{
                db:{
                    url:config.get('DATABASE_URL')
                }
            }
        })
    }
}
