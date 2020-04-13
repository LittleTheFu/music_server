import { Controller } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller()
export class SeedController {
  constructor(
    private readonly seedService: SeedService) {
    }
}
