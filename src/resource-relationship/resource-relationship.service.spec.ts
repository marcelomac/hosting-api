import { Test, TestingModule } from '@nestjs/testing';
import { ResourceRelationshipService } from './resource-relationship.service';

describe('ResourceRelationshipService', () => {
  let service: ResourceRelationshipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceRelationshipService],
    }).compile();

    service = module.get<ResourceRelationshipService>(ResourceRelationshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
