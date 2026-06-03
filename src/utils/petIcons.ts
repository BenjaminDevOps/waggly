import { Dog, Cat, Bird, Rabbit, PawPrint } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PetType } from '../models/types';
import { Colors } from '../theme/colors';

export const PET_ICON_MAP: Record<PetType, LucideIcon> = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  rabbit: Rabbit,
  other: PawPrint,
};

export const PET_COLOR_MAP: Record<PetType, string> = {
  dog: Colors.primary,
  cat: Colors.accent,
  bird: Colors.success,
  rabbit: Colors.secondary,
  other: Colors.lavender,
};
