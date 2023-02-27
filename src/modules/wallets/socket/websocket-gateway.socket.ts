import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  intervals = {};

  @WebSocketServer()
  server: Server;

  async afterInit() {
    console.log('WebSocket gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.sendLiveRates(client.id);

    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const intervalId = this.intervals[client.id];

    if (intervalId) {
      clearInterval(intervalId);
      delete this.intervals[client.id];
    }

    console.log(`Client disconnected: ${client.id}`);
  }

  sendLiveRates = (clientId: string) => {
    this.intervals[clientId] = setInterval(() => {
      this.server.emit('live rates', Math.random());
    }, 3000);
  };
}
