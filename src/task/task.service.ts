import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dot';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getSingleTask(id: number, user: User): Promise<Task> {
    const singleTask = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!singleTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return singleTask;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTask(id: number, status: TaskStatus, user: User): Promise<Task> {
    const singleTask = this.getSingleTask(id, user);

    (await singleTask).status = status;

    (await singleTask).save();

    return singleTask;
  }

  getTask(taskFilterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTask(taskFilterDto, user);
  }
}
