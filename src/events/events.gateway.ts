import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private userSocketMap: Map<number, Socket>;

    constructor() {
        this.userSocketMap = new Map<number, Socket>();
    }

    @WebSocketServer()
    server: Server;


    // @SubscribeMessage('events')
    // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    //     return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    // }

    @SubscribeMessage('identity')
    async identity(@MessageBody() data: number, @ConnectedSocket() client: Socket, ): Promise<number> {

        console.log(client.id);
        return 9;
    }

    notifyNewMail(userId: number): void {
        const socket = this.userSocketMap.get(userId);
        if (socket) {
            socket.emit('new_mail');
        }
    }

    @SubscribeMessage('login')
    async login(@MessageBody() id: number, @ConnectedSocket() client: Socket, ): Promise<string> {
        const oldClient = this.userSocketMap.get(id);

        // console.log('old client :' + oldClient);
        // console.log('new client :' + client);

        if(oldClient && oldClient !== client ) {
          
            oldClient.emit('banned');
        }
        this.userSocketMap.set(id, client);
        console.log(this.userSocketMap.keys());

        return 'bind';
    }

    @SubscribeMessage('logout')
    async logout(@MessageBody() id: number, @ConnectedSocket() client: Socket, ): Promise<string> {
        const c = this.userSocketMap.get(id);
        if( c == client) {
            this.userSocketMap.delete(id);
        }
        client.emit('events', 99999);

        console.log(this.userSocketMap.keys());

        return 'unbind';
    }

    public handleConnection(client: Socket) {
        console.log("Client " + client.id + " has connected");
    }

    public handleDisconnect(client: Socket) {
        console.log("Client " + client.id + " has disconnected");
    }
}

