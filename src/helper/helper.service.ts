import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
    port: string;
    hostName: string;
    host: string;
    constructor(private readonly configService: ConfigService) {

        this.hostName = this.configService.get<string>('HOSTNAME');
        this.port = this.configService.get<string>('PORT');

        this.host = 'http://' + this.hostName + (':') + this.port + '/';
    }

    getProt(): string {
        return this.port;
    }

    getHostName(): string {
        return this.hostName;
    }

    getHost(): string {
        return this.host;
    }
}
