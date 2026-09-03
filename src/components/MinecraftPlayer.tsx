type Props = {
  /** Existing transparent player model image URL. */
  skinUrl: string | null;
  name: string;
  className?: string;
};

export function MinecraftPlayer({ skinUrl, name, className }: Props) {
  if (!skinUrl) return <div className={className} aria-hidden />;

  return (
    <img
      src={skinUrl}
      alt={`${name} Minecraft character`}
      loading="lazy"
      className={className}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
