import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { TypeOrmExModule } from "src/database/typeorm-ex.module";
import { TaskController } from "./task.controller";
import { TaskRepository } from "./task.repository";
import { TaskService } from "./task.service";

// This change is made on git

@Module({
  imports: [TypeOrmExModule.forCustomRepository([TaskRepository]), AuthModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
