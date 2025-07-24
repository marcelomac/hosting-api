import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateResourceRelationshipDto {
  @IsString()
  @IsNotEmpty()
  resourceId: string;

  @IsString()
  @IsNotEmpty()
  relationshipId: string;

  @IsBoolean()
  active?: boolean = true;
}
