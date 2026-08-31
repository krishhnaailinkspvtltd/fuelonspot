import {
  Activity,
  BarChart3,
  BatteryCharging,
  Beaker,
  Building,
  Building2,
  ClipboardCheck,
  Clock,
  ConciergeBell,
  CreditCard,
  Factory,
  Forklift,
  GraduationCap,
  HardHat,
  HeartPulse,
  Home,
  Landmark,
  Lock,
  Map,
  MapPin,
  PartyPopper,
  PhoneCall,
  RadioTower,
  ShieldCheck,
  Siren,
  Snowflake,
  Sprout,
  TrafficCone,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Explicit registry so content files can reference icons by a stable string key
 * without pulling the whole lucide surface into the bundle.
 */
export const iconRegistry = {
  activity: Activity,
  "bar-chart": BarChart3,
  "battery-charging": BatteryCharging,
  beaker: Beaker,
  building: Building,
  "building-2": Building2,
  "clipboard-check": ClipboardCheck,
  clock: Clock,
  "concierge-bell": ConciergeBell,
  "credit-card": CreditCard,
  factory: Factory,
  forklift: Forklift,
  "graduation-cap": GraduationCap,
  "hard-hat": HardHat,
  "heart-pulse": HeartPulse,
  home: Home,
  landmark: Landmark,
  lock: Lock,
  map: Map,
  "map-pin": MapPin,
  "party-popper": PartyPopper,
  "phone-call": PhoneCall,
  "radio-tower": RadioTower,
  shield: ShieldCheck,
  siren: Siren,
  snowflake: Snowflake,
  sprout: Sprout,
  "traffic-cone": TrafficCone,
  truck: Truck,
  zap: Zap,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof iconRegistry;

export function Icon({
  name,
  className,
  strokeWidth = 1.6,
}: {
  name: IconKey | string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = iconRegistry[name as IconKey] ?? Truck;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
