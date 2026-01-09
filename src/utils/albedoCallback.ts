export function openAlbedoPopup(url: string): Window {
  const popup = window.open(
    url,
    "albedo",
    "width=420,height=720,resizable=yes,scrollbars=yes"
  );

  if (!popup) {
    throw new Error("Failed to open Albedo popup (blocked by browser)");
  }

  return popup;
}

export function waitForAlbedoResult(): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Albedo response timeout"));
    }, 2 * 60 * 1000);

    const parseResult = () => {
      const params = new URLSearchParams(window.location.search);

      if (
        !params.has("pubkey") &&
        !params.has("signed_envelope_xdr") &&
        !params.has("signed_xdr")
      ) {
        return;
      }

      clearTimeout(timeout);

      const result: Record<string, string> = {};
      params.forEach((value, key) => {
        result[key] = value;
      });

      // Clean URL (important UX polish)
      window.history.replaceState({}, document.title, window.location.pathname);

      resolve(result);
    };

    parseResult();
    window.addEventListener("popstate", parseResult);
  });
}

export function handleAlbedoCallback(): Record<string, string> | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);

  if (
    !params.has("pubkey") &&
    !params.has("signed_envelope_xdr") &&
    !params.has("signed_xdr")
  ) {
    return null;
  }

  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });

  // Clean URL
  window.history.replaceState({}, document.title, window.location.pathname);

  return result;
}

export function waitForAlbedoPopup(): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Albedo response timeout"));
    }, 2 * 60 * 1000);

    function handler(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.data?.type !== "ALBEDO_RESULT"
      ) {
        return;
      }

      clearTimeout(timeout);
      window.removeEventListener("message", handler);
      resolve(event.data.payload);
    }

    window.addEventListener("message", handler);
  });
}
