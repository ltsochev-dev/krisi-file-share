export declare global {
  interface turnstileOpts {
    callback?: (token: string) => void;
    [key: string]: string | ((token: string) => void) | undefined;
  }

  interface Window {
    turnstile: {
      render: (el: HTMLElement | string, opts: turnstileOpts) => string;
      remove: (id: string) => void;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
}
