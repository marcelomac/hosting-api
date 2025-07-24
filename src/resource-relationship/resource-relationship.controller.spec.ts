import { Test, TestingModule } from '@nestjs/testing';
import { ResourceRelationshipController } from './resource-relationship.controller';
import { ResourceRelationshipService } from './resource-relationship.service';

describe('ResourceRelationshipController', () => {
  let controller: ResourceRelationshipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceRelationshipController],
      providers: [ResourceRelationshipService],
    }).compile();

    controller = module.get<ResourceRelationshipController>(ResourceRelationshipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
