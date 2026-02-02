import React from 'react';

export const FontAwesomeIcon = ({ icon }: { icon: any }) => (
  <span data-testid={`icon-${icon?.iconName || icon || 'icon'}`} />
);

export default { FontAwesomeIcon };
