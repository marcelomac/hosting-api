import {
  Logger,
  Module,
  // RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartmentModule } from './department/department.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeeModule } from './employee/employee.module';
import { MovimentModule } from './moviment/moviment.module';
import { RelationshipModule } from './relationship/relationship.module';
import { ResourceModule } from './resource/resource.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './profile/profile.module';
import { EmailController } from './email/email.controller';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { SettingModule } from './setting/setting.module';
import { UploadModule } from './upload/upload.module';
import { RobotModule } from './robot/robot.module';
import { OrdinanceModule } from './ordinance/ordinance.module';
import { UserLogModule } from './user-log/user-log.module';
import { ScriptModule } from './script/script.module';
import { TemplateModule } from './template/template.module';
import { UserService } from './user/user.service';
import { ProfileService } from './profile/profile.service';
import { CommonModule } from './common/common.module';
import { ResourceRelationshipModule } from './resource-relationship/resource-relationship.module';
import { ChatModule } from './chat/chat.module';
// import { AuthMiddleware } from './middlewares/auth-middleware';
// import { UserLogMiddleware } from './middlewares/user-log-middlware';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserLogService } from './user-log/user-log.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobModule } from './cronjob/cronjob.module';
import { SettingService } from './setting/setting.service';
import { CronjobService } from './cronjob/cronjob.service';
import { MovimentService } from './moviment/moviment.service';
import { EmployeeService } from './employee/employee.service';
import { DepartmentService } from './department/department.service';
import { OrdinanceService } from './ordinance/ordinance.service';
import { SysLogModule } from './syslog/syslog.module';
import { SysLogService } from './syslog/syslog.service';

@Module({
  imports: [
    DepartmentModule,
    PrismaModule,
    EmployeeModule,
    MovimentModule,
    RelationshipModule,
    ResourceModule,
    AuthModule,
    UserModule,
    ProfileModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProfileModule,
    EmailModule,
    SettingModule,
    UploadModule,
    RobotModule,
    OrdinanceModule,
    SysLogModule,
    UserLogModule,
    ScriptModule,
    TemplateModule,
    CommonModule,
    ResourceRelationshipModule,
    ChatModule,
    ScheduleModule.forRoot(),
    CronjobModule,
  ],
  controllers: [AppController, EmailController],
  providers: [
    AppService,
    EmailService,
    UserService,
    ProfileService,
    Logger,
    AuthService,
    PrismaService,
    JwtService,
    UserLogService,
    SysLogService,
    SettingService,
    CronjobService,
    EmailService,
    MovimentService,
    EmployeeService,
    DepartmentService,
    OrdinanceService,
  ],
})
export class AppModule {}

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware)
//       .forRoutes({ path: '*', method: RequestMethod.ALL }); // Aplicando o AuthMiddleware para todas as rotas

//     consumer
//       .apply(UserLogMiddleware)
//       .forRoutes({ path: '*', method: RequestMethod.ALL }); // Aplicando o middleware para todas as rotas
//   }
// }
