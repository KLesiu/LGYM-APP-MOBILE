import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { AppState, AppStateStatus } from "react-native";
import {
  ConnectionState,
  SignalREventHandler,
  SignalRConfig,
  TrainerNotificationEvents,
} from "./types";
import { resolveBackendBaseUrl } from "../../../api/custom-instance";

class SignalRService {
  private static instance: SignalRService;
  private connection: HubConnection | null = null;
  private connectionState: ConnectionState = ConnectionState.Disconnected;
  private authToken: string | null = null;
  private config: SignalRConfig;
  private eventHandlers: Map<string, Set<SignalREventHandler>> = new Map();
  private appStateSubscription: any = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;

  private constructor() {
    const backendUrl = resolveBackendBaseUrl(process.env.REACT_APP_BACKEND) || "https://localhost:7025";
    this.config = {
      baseUrl: backendUrl,
      hubPath: "/hubs/notifications",
      autoReconnect: true,
      maxRetryDelay: 30000,
      enableLogging: __DEV__,
    };
  }

  static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  async connect(token: string): Promise<void> {
    if (!token) {
      console.error("[SignalR] Cannot connect: no auth token provided");
      return;
    }

    if (this.connection && this.connectionState === ConnectionState.Connected) {
      console.log("[SignalR] Already connected");
      return;
    }

    this.authToken = token;
    this.connectionState = ConnectionState.Connecting;

    try {
      const hubUrl = `${this.config.baseUrl}${this.config.hubPath}`;
      console.log(`[SignalR] Connecting to: ${hubUrl}`);

      this.connection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => this.authToken || "",
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            const delay = Math.min(
              1000 * Math.pow(2, retryContext.previousRetryCount),
              this.config.maxRetryDelay || 30000
            );
            console.log(
              `[SignalR] Reconnect attempt ${retryContext.previousRetryCount + 1}, delay: ${delay}ms`
            );
            return delay;
          },
        })
        .configureLogging(
          this.config.enableLogging ? LogLevel.Information : LogLevel.Warning
        )
        .build();

      this.setupConnectionHandlers();
      this.setupAppStateListener();

      await this.connection.start();
      this.connectionState = ConnectionState.Connected;
      this.reconnectAttempts = 0;
      console.log("[SignalR] Connected successfully");
    } catch (error) {
      this.connectionState = ConnectionState.Disconnected;
      console.error("[SignalR] Connection failed:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      this.removeAppStateListener();

      if (this.connection) {
        await this.connection.stop();
        this.connection = null;
      }

      this.connectionState = ConnectionState.Disconnected;
      this.authToken = null;
      this.eventHandlers.clear();
      console.log("[SignalR] Disconnected");
    } catch (error) {
      console.error("[SignalR] Disconnect error:", error);
    }
  }

  on<T = any>(event: string, handler: SignalREventHandler<T>): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }

    this.eventHandlers.get(event)!.add(handler);

    if (this.connection) {
      this.connection.on(event, handler);
    }
  }

  off<T = any>(event: string, handler: SignalREventHandler<T>): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(event);
      }
    }

    if (this.connection) {
      this.connection.off(event, handler);
    }
  }

  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  isConnected(): boolean {
    return (
      this.connection?.state === HubConnectionState.Connected &&
      this.connectionState === ConnectionState.Connected
    );
  }

  private setupConnectionHandlers(): void {
    if (!this.connection) return;

    this.connection.onreconnecting(() => {
      this.connectionState = ConnectionState.Reconnecting;
      this.reconnectAttempts++;
      console.log(`[SignalR] Reconnecting... attempt ${this.reconnectAttempts}`);
    });

    this.connection.onreconnected(() => {
      this.connectionState = ConnectionState.Connected;
      this.reconnectAttempts = 0;
      console.log("[SignalR] Reconnected successfully");
      this.reattachEventHandlers();
    });

    this.connection.onclose((error) => {
      this.connectionState = ConnectionState.Disconnected;
      if (error) {
        console.error("[SignalR] Connection closed with error:", error);
      } else {
        console.log("[SignalR] Connection closed");
      }

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error(
          `[SignalR] Max reconnection attempts (${this.maxReconnectAttempts}) reached`
        );
      }
    });
  }

  private reattachEventHandlers(): void {
    if (!this.connection) return;

    this.eventHandlers.forEach((handlers, event) => {
      handlers.forEach((handler) => {
        this.connection!.on(event, handler);
      });
    });
  }

  private setupAppStateListener(): void {
    this.appStateSubscription = AppState.addEventListener(
      "change",
      this.handleAppStateChange
    );
  }

  private removeAppStateListener(): void {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  private handleAppStateChange = async (nextAppState: AppStateStatus): Promise<void> => {
    if (nextAppState === "active") {
      if (
        this.authToken &&
        this.connection?.state === HubConnectionState.Disconnected
      ) {
        console.log("[SignalR] App became active, reconnecting...");
        try {
          await this.connection.start();
          this.connectionState = ConnectionState.Connected;
          this.reattachEventHandlers();
        } catch (error) {
          console.error("[SignalR] Failed to reconnect on app active:", error);
        }
      }
    } else if (nextAppState === "background" || nextAppState === "inactive") {
      console.log("[SignalR] App went to background/inactive");
    }
  };
}

export default SignalRService;
