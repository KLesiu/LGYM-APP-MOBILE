/**
 * SignalR Service Types
 * Defines types for SignalR connection management and events
 */

/**
 * SignalR connection states
 */
export enum ConnectionState {
  Disconnected = "disconnected",
  Connecting = "connecting",
  Connected = "connected",
  Reconnecting = "reconnecting",
}

/**
 * SignalR event handler type
 */
export type SignalREventHandler<T = any> = (data: T) => void;

/**
 * Trainer-related notification event names
 * These correspond to server-side SignalR hub event names
 */
export enum TrainerNotificationEvents {
  ReceiveNotification = "ReceiveNotification",
  /**
   * Fired when a trainer sends an invitation to a user
   */
  TrainerInvitationReceived = "TrainerInvitationReceived",

  /**
   * Fired when a trainer sends a report request
   */
  ReportRequestReceived = "ReportRequestReceived",

  /**
   * Fired when a trainer updates user's training plan
   */
  TrainingPlanUpdated = "TrainingPlanUpdated",

  /**
   * Fired when a trainer sends a message or notification
   */
  TrainerMessageReceived = "TrainerMessageReceived",
}

/**
 * SignalR event payload for trainer invitation
 */
export interface TrainerInvitationPayload {
  notificationId: string;
  trainerId: string;
  trainerName: string;
  message?: string;
  timestamp: string;
}

/**
 * SignalR event payload for report request
 */
export interface ReportRequestPayload {
  notificationId: string;
  trainerId: string;
  trainerName: string;
  reportType: string;
  dueDate?: string;
  timestamp: string;
}

/**
 * SignalR event payload for training plan update
 */
export interface TrainingPlanUpdatePayload {
  notificationId: string;
  trainerId: string;
  trainerName: string;
  planId: string;
  planName: string;
  timestamp: string;
}

/**
 * SignalR event payload for trainer message
 */
export interface TrainerMessagePayload {
  notificationId: string;
  trainerId: string;
  trainerName: string;
  message: string;
  timestamp: string;
}

/**
 * Generic notification event payload
 */
export type NotificationEventPayload =
  | TrainerInvitationPayload
  | ReportRequestPayload
  | TrainingPlanUpdatePayload
  | TrainerMessagePayload;

/**
 * SignalR configuration options
 */
export interface SignalRConfig {
  /**
   * Backend base URL (from env)
   */
  baseUrl: string;

  /**
   * Hub endpoint path
   */
  hubPath?: string;

  /**
   * Enable automatic reconnection
   */
  autoReconnect?: boolean;

  /**
   * Maximum retry delay in milliseconds
   */
  maxRetryDelay?: number;

  /**
   * Enable debug logging
   */
  enableLogging?: boolean;
}
