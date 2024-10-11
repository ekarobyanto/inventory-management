import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @IsNotEmpty()
  @IsString({ message: 'Name is Required' })
  name: string;

  @IsNotEmpty()
  @IsString({ message: 'Password is Required' })
  password: string;
}
