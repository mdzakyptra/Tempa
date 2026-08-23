import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';


@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  //<---------- constructor -------------->
  constructor() {
    super({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    });
  }

  //<---------- onModuleInit -------------->
  async onModuleInit() {
    await this.$connect();
  }

  //<---------- onModuleDestroy -------------->
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
