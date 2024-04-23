import { IsNotEmpty } from 'class-validator';

const messageAddForIsNotEmpty = (propertyName: string) => {
  const obj = {
    message: `${propertyName} не должен быть пустым`,
  };
  return obj;
};

export class CreatePlayerDto {
  @IsNotEmpty(messageAddForIsNotEmpty('name'))
  name: string;
  @IsNotEmpty(messageAddForIsNotEmpty('nickname'))
  nickname: string;
  birthDate: Date;
}
