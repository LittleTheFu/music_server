import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelperService } from './helper.service'

@Global()
@Module({
    imports: [ConfigModule],
    providers: [HelperService],
    exports: [HelperService],
})

export class HelperModule { }