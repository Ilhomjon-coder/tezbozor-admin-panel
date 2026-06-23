import { useEffect, useState } from 'react';
import { WifiOutlined } from '@ant-design/icons';
import { brand } from '../theme';
import { text } from '../i18n/uz';

// Fixed top banner shown when the browser is offline (WS3 §3e). Field screens keep
// their last-loaded data (served from the service-worker cache); this just makes
// the state obvious. `no-print` so it never appears on a printed buy-list.
export const OfflineBanner = () => {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div
      className="no-print"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        background: brand.danger,
        color: '#fff',
        textAlign: 'center',
        padding: '6px 12px',
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      <WifiOutlined /> {text.common.offline}
    </div>
  );
};
