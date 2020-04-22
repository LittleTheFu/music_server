export class DeleteMailDto {
    mailId: number;
}

export class GetMailDto {
    mailId: number;
}

export class SendMailDto {
    toId: number;
    content: string;
}