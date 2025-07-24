import { PartialType } from '@nestjs/swagger';
import { CreateOrdinanceDto } from './create-ordinance.dto';

export class UpdateOrdinanceDto extends PartialType(CreateOrdinanceDto) {}
