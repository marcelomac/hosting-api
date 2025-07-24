import { PartialType } from '@nestjs/swagger';
import { CreateResourceRelationshipDto } from './create-resource-relationship.dto';

export class UpdateResourceRelationshipDto extends PartialType(
  CreateResourceRelationshipDto,
) {}
