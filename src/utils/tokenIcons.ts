// Utility for loading token icons
export const TOKEN_ICONS_BASE_PATH = '/icons/tokens/';

// Token icon mappings
export const TOKEN_ICONS = {
  BTC: 'btc.png',
  MOTO: 'moto.png', 
  PILL: 'pill.png',  // Changed from piil.png to pill.png to match your filename
} as const;

// Load token icon URLs
export const getTokenIcon = (token: keyof typeof TOKEN_ICONS): string => {
  return `${TOKEN_ICONS_BASE_PATH}${TOKEN_ICONS[token]}`;
};

// Check if icon exists (basic validation)
export const tokenIconExists = async (iconPath: string): Promise<boolean> => {
  try {
    const response = await fetch(iconPath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Get available token icons (filter out missing ones)
export const getAvailableTokenIcons = async (): Promise<Record<string, string>> => {
  const available: Record<string, string> = {};
  
  for (const [token, filename] of Object.entries(TOKEN_ICONS)) {
    const iconPath = getTokenIcon(token as keyof typeof TOKEN_ICONS);
    const exists = await tokenIconExists(iconPath);
    if (exists) {
      available[token] = iconPath;
    }
  }
  
  return available;
};
