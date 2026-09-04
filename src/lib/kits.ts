import { Swords } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Kit = {
  /** stable key used in the bot / API data */
  key: string;
  label: string;
  /** custom emoji image URL (preferred) */
  image?: string;
  /** lucide fallback when no image is set */
  icon?: LucideIcon;
  color: string;
  filled: boolean;
};

const emoji = (id: string) =>
  `https://cdn.discordapp.com/emojis/${id}.png?size=160&quality=lossless`;

export const KITS: Kit[] = [
  { key: "overall", label: "Overall", image: emoji("1529450501417205781"), color: "text-kit-gold", filled: true },
  { key: "ltms", label: "LTMs", icon: Swords, color: "text-kit-silver", filled: false },
  { key: "vanilla", label: "Vanilla", image: emoji("1529449290500669540"), color: "text-kit-violet", filled: true },
  { key: "uhc", label: "UHC", image: emoji("1529449344779157677"), color: "text-kit-red", filled: true },
  { key: "pot", label: "Pot", image: emoji("1529449278198648943"), color: "text-kit-silver", filled: false },
  { key: "nethop", label: "NethOP", image: emoji("1529449259076812931"), color: "text-kit-violet", filled: true },
  { key: "smp", label: "SMP", image: emoji("1529449318753370332"), color: "text-kit-teal", filled: true },
  { key: "sword", label: "Sword", image: emoji("1529449305516150885"), color: "text-kit-blue", filled: false },
  { key: "axe", label: "Axe", image: emoji("1529449334611902574"), color: "text-kit-blue", filled: false },
  { key: "mace", label: "Mace", image: emoji("1529449244707258419"), color: "text-kit-silver", filled: false },
];

/** Kits shown on a player row (everything except the aggregate "Overall"). */
export const RANKED_KITS = KITS.filter((k) => k.key !== "overall");

/** Renders a kit icon: custom emoji image when available, lucide fallback otherwise. */
export function KitIcon({
  kit,
  className,
  active,
}: {
  kit: Kit;
  className?: string;
  active?: boolean;
}) {
  if (kit.image) {
    return (
      <img
        src={kit.image}
        alt={kit.label}
        loading="lazy"
        className={`${className ?? ""} object-contain ${active ? "" : "opacity-80"}`}
      />
    );
  }
  const Icon = kit.icon ?? Swords;
  return (
    <Icon
      className={`${className ?? ""} ${kit.color} ${active ? "" : "opacity-80"}`}
      strokeWidth={2.25}
      fill={kit.filled ? "currentColor" : "none"}
    />
  );
}
