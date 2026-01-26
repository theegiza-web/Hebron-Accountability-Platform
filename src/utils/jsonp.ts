// src/utils/jsonp.ts
export function loadJsonp<T>(url: string, timeoutMs = 15000): Promise<T> {
  return new Promise((resolve, reject) => {
    const cb = `cb_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const u = new URL(url);

    // Ensure callback is present
    u.searchParams.set('callback', cb);

    // Cache-bust
    u.searchParams.set('t', String(Date.now()));

    const script = document.createElement('script');
    script.src = u.toString();
    script.async = true;

    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error('JSONP request timed out'));
    }, timeoutMs);

    function cleanup() {
      window.clearTimeout(timer);
      delete (window as any)[cb];
      script.remove();
    }

    (window as any)[cb] = (data: T) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('JSONP script failed to load (blocked or invalid response)'));
    };

    document.head.appendChild(script);
  });
}
