import { Turtle, Rat, Squirrel, Bird, Fish, Waves, Bug, PawPrint } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PetType } from '../models/types';
import { Colors } from '../theme/colors';

export const PET_ICON_MAP: Record<PetType, LucideIcon> = {
  reptile: Turtle,
  rodent: Rat,
  ferret: Squirrel,
  bird: Bird,
  fish: Fish,
  amphibian: Waves,
  invertebrate: Bug,
  other: PawPrint,
};

export const PET_COLOR_MAP: Record<PetType, string> = {
  reptile: Colors.primary,
  rodent: Colors.accent,
  ferret: Colors.lavender,
  bird: Colors.success,
  fish: Colors.sky,
  amphibian: Colors.mint,
  invertebrate: Colors.inkTertiary,
  other: Colors.secondary,
};
