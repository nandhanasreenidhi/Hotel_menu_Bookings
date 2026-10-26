/**
 * Presentation-only copy from the Dakshin Kitchen design (section taglines, big background words,
 * stickers, handwritten dish notes). Keyed by category / item id; anything not listed simply
 * renders without that decoration, so admin-added categories and dishes still display correctly.
 */
export interface CategoryCopy {
  tagline: string;
  word: string;
  sticker: string;
}

export const CATEGORY_COPY: Record<string, CategoryCopy> = {
  'cat-signature-dosas': { tagline: 'Crisp, golden, rolled to order', word: 'DOSA', sticker: 'Crispy, obviously' },
  'cat-idli-vada': { tagline: 'Soft, fluffy and fried-to-crunch', word: 'IDLI', sticker: 'Dunk responsibly' },
  'cat-breakfast-specials': { tagline: 'Slow mornings, warm plates', word: 'MORNING', sticker: 'Slow-morning energy' },
  'cat-meals-thalis': { tagline: 'A feast on a banana leaf', word: 'MEALS', sticker: 'Eat with your hands' },
  'cat-rice-biryanis': { tagline: 'Fragrant, tangy, deeply satisfying', word: 'RICE', sticker: 'Rice is life' },
  'cat-evening-tiffin': { tagline: 'Little bites for chai time', word: 'TIFFIN', sticker: 'Chai’s best friend' },
  'cat-coffee-drinks': { tagline: 'Poured, frothed, chilled', word: 'COFFEE', sticker: 'Froth goals' },
  'cat-sweet-endings': { tagline: 'Jaggery, ghee and cardamom', word: 'SWEET', sticker: 'Save room' },
};

export const ITEM_HINTS: Record<string, string> = {
  'dk-ghee-podi-dosa': '“the podi hits different”',
  'dk-ghee-podi-idli': '“dunk. don’t spoon.”',
  'dk-ven-pongal-vada': '“pongal > cereal”',
  'dk-banana-leaf-meals': '“yes, eat with your hands”',
  'dk-lemon-rice': '“sunshine on a plate”',
  'dk-onion-uthappam': '“crispy edges only”',
  'dk-filter-coffee': '“froth tall, pour taller”',
  'dk-rava-kesari': '“ghee, sugar, joy”',
};
