import { PawPrint } from 'lucide-react';
import { PET_ICON_MAP, PET_COLOR_MAP } from '../utils/petIcons';
import { Colors } from '../theme/colors';
import type { Pet } from '../models/types';

interface Props {
  pet: Pet;
  size: number;
  radius: number;
  /** Defaults to half the avatar size, which matches the existing sites. */
  iconSize?: number;
}

/** Pet avatar: the owner's photo when there is one, the species icon otherwise. */
export function PetAvatar({ pet, size, radius, iconSize }: Props) {
  const Icon = PET_ICON_MAP[pet.type] || PawPrint;
  const color = PET_COLOR_MAP[pet.type] || Colors.lavender;

  return (
    <div
      style={{
        width: size, height: size, borderRadius: radius,
        backgroundColor: color + '18', flexShrink: 0, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {pet.photoUrl ? (
        <img
          src={pet.photoUrl}
          alt={pet.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <Icon size={iconSize ?? Math.round(size / 2)} color={color} />
      )}
    </div>
  );
}
