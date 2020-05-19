import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Client } from 'socket.io';
import { Socket } from 'dgram';
import { Injectable } from '@nestjs/common';

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
    async identity(@MessageBody() data: number, @ConnectedSocket() client: Client, ): Promise<number> {

        console.log(client.id);
        return 9;
    }

    notifyUser(userId: number): void {
        const socket = this.userSocketMap.get(userId);
        if(socket) {
            socket.emit('notice', 998);
        }
    }

    @SubscribeMessage('login')
    async login(@MessageBody() id: number, @ConnectedSocket() client: Socket, ): Promise<string> {
        this.userSocketMap.set(id, client);
        console.log(this.userSocketMap.keys());

        return 'bind';
    } 

    @SubscribeMessage('logout')
    async logout(@MessageBody() id: number, @ConnectedSocket() client: Socket, ): Promise<string> {
        this.userSocketMap.get(1)?.emit('events', 199);
        this.userSocketMap.delete(id);
        client.emit('events', 99999);

        console.log(this.userSocketMap.keys());

        return 'unbind';
    }

    public handleConnection(client: Client) {
        console.log("Client " + client.id + " has connected");
    }

    public handleDisconnect(client: Client) {
        console.log("Client " + client.id + " has disconnected");
    }
}

