interface AdBannerProps {
  slot?: string;
  className?: string;
}

export default function AdBanner({ slot = '', className = '' }: AdBannerProps) {
  const isDev = import.meta.env.DEV;

  if (isDev) {
    // Placeholder in development
    return (
      <div
        className={`flex items-center justify-center h-[50px] md:h-[90px] bg-slate-800/30 border border-dashed border-slate-600 text-slate-500 text-sm ${className}`}
      >
        Ad Space
      </div>
    );
  }

  // Production: AdSense
  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
