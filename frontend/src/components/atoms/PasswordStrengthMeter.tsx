import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

function getStrength(password: string): StrengthLevel {
  if (!password || password.length < 8) return 'weak';

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const typeCount = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;

  if (password.length >= 12 && typeCount === 4) return 'strong';
  if (typeCount >= 3) return 'good';
  if (typeCount >= 2) return 'fair';
  return 'weak';
}

const STRENGTH_CONFIG: Record<StrengthLevel, { label: string; bars: number; colour: string }> = {
  weak:   { label: 'Weak',   bars: 1, colour: 'bg-red-500' },
  fair:   { label: 'Fair',   bars: 2, colour: 'bg-orange-400' },
  good:   { label: 'Good',   bars: 3, colour: 'bg-yellow-400' },
  strong: { label: 'Strong', bars: 4, colour: 'bg-green-500' },
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null;

  const level = getStrength(password);
  const { label, bars, colour } = STRENGTH_CONFIG[level];

  return (
    <div className="mt-2" aria-label={`Password strength: ${label}`}>
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= bars ? colour : 'bg-neutral-200'}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${colour.replace('bg-', 'text-')}`}>
        {label}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
