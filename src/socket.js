import io from "socket.io-client";

export class SocketService {
  static socket;
  static getSocket() {
    if (!this.socket) this.socket = io(process.env.REACT_APP_BFF_SERVER);
    return this.socket;
  }
}
