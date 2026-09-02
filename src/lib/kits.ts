import { Trophy, Swords, Gem, Heart, FlaskConical, CircleDot, Sword, Axe, Hammer } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Kit = {
  /** stable key used in the bot / API data */
  key: string;
  label: string;
  icon: LucideIcon;
  color: string;
  filled: boolean;
};

export const KITS: Kit[] = [
  { key: "overall", label: "Overall", icon: Trophy, color: "text-kit-gold", filled: true },
  { key: "ltms", label: "LTMs", icon: Swords, color: "text-kit-silver", filled: false },
  { key: "vanilla", label: "Vanilla", icon: Gem, color: "text-kit-violet", filled: true },
  { key: "uhc", label: "UHC", icon: Heart, color: "text-kit-red", filled: true },
  { key: "pot", label: "Pot", icon: FlaskConical, color: "text-kit-silver", filled: false },
  { key: "nethop", label: "NethOP", icon: CircleDot, color: "text-kit-violet", filled: true },
  { key: "smp", label: "SMP", icon: CircleDot, color: "text-kit-teal", filled: true },
  { key: "sword", label: "Sword", icon: Sword, color: "text-kit-blue", filled: false },
  { key: "axe", label: "Axe", icon: Axe, color: "text-kit-blue", filled: false },
  { key: "mace", label: "Mace", icon: Hammer, color: "text-kit-silver", filled: false },
];

/** Kits shown on a player row (everything except the aggregate "Overall"). */
export const RANKED_KITS = KITS.filter((k) => k.key !== "overall");
