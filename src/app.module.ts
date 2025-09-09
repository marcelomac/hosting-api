import {
  Logger,
  Module,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartmentModule } from './department/department.module';
import { PrismaModule } from './prisma/prisma.module';
import { PersonModule } from './person/person.module';
import { VisitModule } from './visit/visit.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './profile/profile.module';
import { UploadModule } from './upload/upload.module';
import { UserLogModule } from './user-log/user-log.module';
import { UserService } from './user/user.service';
import { ProfileService } from './profile/profile.service';
import { CommonModule } from './common/common.module';
import { ChatModule } from './chat/chat.module';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserLogService } from './user-log/user-log.service';
import { ScheduleModule } from '@nestjs/schedule';
import { VisitService } from './visit/visit.service';
import { PersonService } from './person/person.service';
import { DepartmentService } from './department/department.service';
import { SysLogModule } from './syslog/syslog.module';
import { SysLogService } from './syslog/syslog.service';

@Module({
  imports: [
    DepartmentModule,
    PrismaModule,
    PersonModule,
    VisitModule,
    AuthModule,
    UserModule,
    ProfileModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProfileModule,
    UploadModule,
    SysLogModule,
    UserLogModule,
    CommonModule,
    ChatModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    ProfileService,
    Logger,
    AuthService,
    PrismaService,
    JwtService,
    UserLogService,
    SysLogService,
    VisitService,
    PersonService,
    DepartmentService,
  ],
})
export class AppModule {}
