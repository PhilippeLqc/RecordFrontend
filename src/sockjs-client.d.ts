declare namespace SockJSN {
    type CONNECTING = 0;
    type OPEN = 1;
    type CLOSING = 2;
    type CLOSED = 3;
  
    type State = CONNECTING | OPEN | CLOSING | CLOSED;
  
    interface BaseEvent extends Event {
      type: string;
    }
  
    type OpenEvent = BaseEvent;
  
    interface CloseEvent extends BaseEvent {
      code: number;
      reason: string;
      wasClean: boolean;
    }
  
    interface MessageEvent extends BaseEvent {
      data: string;
    }
  
    type SessionGenerator = () => string;
  
    interface Options {
      server?: string | undefined;
      sessionId?: number | SessionGenerator | undefined;
      transports?: string | string[] | undefined;
      timeout?: number | undefined;
    }
  }
  
  declare module 'sockjs-client/dist/sockjs' {
    const SockJS: {
      new (
        url: string,
        _reserved?: unknown,
        options?: SockJSN.Options
      ): WebSocket;
      (url: string, _reserved?: unknown, options?: SockJSN.Options): WebSocket;
      prototype: WebSocket;
      CONNECTING: SockJSN.CONNECTING;
      OPEN: SockJSN.OPEN;
      CLOSING: SockJSN.CLOSING;
      CLOSED: SockJSN.CLOSED;
    };
  
    export default SockJS;
  }