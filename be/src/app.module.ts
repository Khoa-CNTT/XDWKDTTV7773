import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CartModule } from './modules/cart/cart.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { ChatSupportModule } from './modules/chat-support/chat-support.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Chỉ nên dùng true ở môi trường phát triển
      }),
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    CartModule,
    PaymentsModule,
    PromotionsModule,
    InventoryModule,
    StatisticsModule,
    ChatSupportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
