import { io, Socket } from 'socket.io-client';

// Define the socket events and their payload types
export interface ServerToClientEvents {
  'room-created': (data: { roomId: string; isHost: boolean }) => void;
  'room-joined': (data: { roomId: string; isHost: boolean; players: Player[]; text: string }) => void;
  'player-joined': (data: { players: Player[] }) => void;
  'players-updated': (data: { players: Player[] }) => void;
  'game-countdown': (data: { countdown: number }) => void;
  'game-started': (data: { text: string }) => void;
  'progress-updated': (data: { players: Player[] }) => void;
  'player-finished': (data: { playerId: string; playerName: string; wpm: number }) => void;
  'game-over': (data: { players: Player[] }) => void;
  'player-left': (data: { players: Player[]; newHost: string }) => void;
  'error': (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  'create-room': () => void;
  'join-room': (data: { roomId: string; playerName: string }) => void;
  'player-ready': (data: { roomId: string; ready: boolean }) => void;
  'update-progress': (data: { roomId: string; progress: number; wpm: number }) => void;
  'leave-room': (data: { roomId: string }) => void;
}

export interface Player {
  id: string;
  name: string;
  wpm: number;
  progress: number;
  ready: boolean;
}

// Socket.io client singleton
class SocketClient {
  private static instance: SocketClient;
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private listeners: Map<string, Function[]> = new Map();
  
  private constructor() {}
  
  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }
  
  public connect(): void {
    if (this.socket) return;
    
    // Connect to the Socket.io server
    this.socket = io('http://localhost:3001');
    
    // Log connection status
    this.socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });
    
    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  public disconnect(): void {
    if (!this.socket) return;
    
    this.socket.disconnect();
    this.socket = null;
  }
  
  public createRoom(): void {
    if (!this.socket) this.connect();
    this.socket?.emit('create-room');
  }
  
  public joinRoom(roomId: string, playerName: string): void {
    if (!this.socket) this.connect();
    this.socket?.emit('join-room', { roomId, playerName });
  }
  
  public setReady(roomId: string, ready: boolean): void {
    this.socket?.emit('player-ready', { roomId, ready });
  }
  
  public updateProgress(roomId: string, progress: number, wpm: number): void {
    this.socket?.emit('update-progress', { roomId, progress, wpm });
  }
  
  public leaveRoom(roomId: string): void {
    this.socket?.emit('leave-room', { roomId });
  }
  
  public on<K extends keyof ServerToClientEvents>(
    event: K,
    callback: ServerToClientEvents[K]
  ): void {
    if (!this.socket) this.connect();
    
    // Add to our listeners map for cleanup
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, []);
    }
    this.listeners.get(event as string)?.push(callback as Function);
    
    // Add the actual socket.io listener
    this.socket?.on(event, callback as any);
  }
  
  public off<K extends keyof ServerToClientEvents>(
    event: K,
    callback?: ServerToClientEvents[K]
  ): void {
    if (!this.socket) return;
    
    if (callback) {
      // Remove specific callback
      this.socket.off(event, callback as any);
      
      // Update our listeners map
      const callbacks = this.listeners.get(event as string) || [];
      const index = callbacks.indexOf(callback as Function);
      if (index !== -1) {
        callbacks.splice(index, 1);
        this.listeners.set(event as string, callbacks);
      }
    } else {
      // Remove all callbacks for this event
      this.socket.off(event as string);
      this.listeners.delete(event as string);
    }
  }
  
  private setupEventListeners(): void {
    // Re-add all listeners if we reconnect
    for (const [event, callbacks] of this.listeners.entries()) {
      for (const callback of callbacks) {
        this.socket?.on(event as keyof ServerToClientEvents, callback as any);
      }
    }
  }
}

export default SocketClient.getInstance(); 