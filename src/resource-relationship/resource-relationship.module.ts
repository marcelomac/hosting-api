import { Module } from '@nestjs/common';
import { ResourceRelationshipService } from './resource-relationship.service';
import { ResourceRelationshipController } from './resource-relationship.controller';

@Module({
  controllers: [ResourceRelationshipController],
  providers: [ResourceRelationshipService],
})
export class ResourceRelationshipModule {}
