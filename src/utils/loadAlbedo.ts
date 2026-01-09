export async function loadAlbedo() {
  if (typeof window === 'undefined') {
    throw new Error('Albedo can only be used in the browser');
  }

  if ((window as any).albedo) {
    return (window as any).albedo;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/albedo-link@latest/albedo.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Albedo'));
    document.body.appendChild(script);
  });

  return (window as any).albedo;
}
