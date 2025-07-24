import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { RelationshipService } from 'src/relationship/relationship.service';
import { ResourceService } from 'src/resource/resource.service';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService, RelationshipService, ResourceService],
})
export class TemplateModule {}
