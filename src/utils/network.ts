// Network utilities
export async function checkNetworkConnection(): Promise<boolean> {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
}

export function getNetworkType(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  return (navigator as any).connection?.effectiveType || 'unknown';
}
 
