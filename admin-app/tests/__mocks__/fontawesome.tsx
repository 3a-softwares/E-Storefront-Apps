import React from 'react';

// Mock FontAwesomeIcon component
export const FontAwesomeIcon: React.FC<{
  icon: any;
  className?: string;
  size?: string;
}> = ({ icon, className }) => (
  <span data-testid="mock-icon" className={className} data-icon={icon?.iconName || 'unknown'} />
);

export default { FontAwesomeIcon };
