import { handleAlbedoCallback } from 'stellar-wallet-kit';

export default function AlbedoCallback() {
  useEffect(() => {
    const result = handleAlbedoCallback();

    if (window.opener && result) {
      window.opener.postMessage(
        { type: 'ALBEDO_RESULT', payload: result },
        window.location.origin
      );
      window.close();
    }
  }, []);

  return <p>Connecting wallet…</p>;
}
