import { PartialType } from '@nestjs/swagger';
import { CreateUserDto, UserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(UserDto) {} 