/**
 * Menu image resolution — LOCAL assets only (public/images/menu/*.webp).
 *
 * Every dish has a 1024px image (`<slug>.webp`) and a 640px variant (`<slug>-640.webp`).
 * Resolution order:
 *   1. item.image, if set (so photos edited in Admin → Menu are respected)
 *   2. the local file mapped to the item id below
 *   3. a neutral on-brand placeholder (never another dish's photo)
 */
const BASE = '/images/menu/';

export const HERO_IMAGE = `${BASE}hero-masala-dosa.webp`;

/** item id → image slug (file is /images/menu/<slug>.webp) */
export const FOOD_IMAGE_SLUG_BY_ID: Record<string, string> = {
  'dk-ghee-podi-dosa': 'ghee-podi-dosa',
  'dk-paper-roast': 'paper-roast',
  'dk-mysore-masala-dosa': 'mysore-masala-dosa',
  'dk-chettinad-chicken-dosa': 'chettinad-chicken-dosa',
  'dk-ghee-podi-idli': 'ghee-podi-idli',
  'dk-medu-vada': 'medu-vada',
  'dk-sambar-idli': 'sambar-idli',
  'dk-idli-vada-combo': 'idli-vada-combo',
  'dk-ven-pongal-vada': 'ven-pongal-vada',
  'dk-poori-masala': 'poori-masala',
  'dk-kal-dosa-set': 'kal-dosa-set',
  'dk-banana-leaf-meals': 'banana-leaf-meals',
  'dk-mini-tiffin-thali': 'mini-tiffin-thali',
  'dk-curd-rice-bowl': 'curd-rice-bowl',
  'dk-lemon-rice': 'lemon-rice',
  'dk-ambur-chicken-biryani': 'ambur-chicken-biryani',
  'dk-puliyodarai': 'puliyodarai',
  'dk-onion-uthappam': 'onion-uthappam',
  'dk-mini-bonda': 'mini-bonda',
  'dk-mirchi-bajji': 'mirchi-bajji',
  'dk-filter-coffee': 'filter-coffee',
  'dk-jigarthanda': 'jigarthanda',
  'dk-rose-milk': 'rose-milk',
  'dk-spiced-buttermilk': 'spiced-buttermilk',
  'dk-rava-kesari': 'rava-kesari',
  'dk-palada-payasam': 'palada-payasam',
  'dk-mysore-pak': 'mysore-pak',
};

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'><rect width='200' height='150' fill='#3a2a20'/>" +
      "<circle cx='100' cy='75' r='44' fill='#C9A25B'/><circle cx='100' cy='75' r='38' fill='#E8D39C'/>" +
      "<circle cx='100' cy='75' r='38' fill='none' stroke='#a07a35' stroke-dasharray='2 4'/></svg>"
  );

type ImageLike = { id?: string; name?: string; image?: string };

export function getFoodImage(item: ImageLike): string {
  const own = item.image?.trim();
  if (own && (own.startsWith('/') || /^https?:\/\//i.test(own) || own.startsWith('data:image/'))) {
    return own;
  }
  const slug = item.id ? FOOD_IMAGE_SLUG_BY_ID[item.id] : undefined;
  return slug ? `${BASE}${slug}.webp` : PLACEHOLDER;
}

/** src + srcSet (640w / 1024w) for local menu photos; plain src for anything else. */
export function getFoodImageProps(item: ImageLike): { src: string; srcSet?: string } {
  const src = getFoodImage(item);
  if (src.startsWith(BASE) && src.endsWith('.webp') && !src.endsWith('-640.webp')) {
    return { src, srcSet: `${src.replace(/\.webp$/, '-640.webp')} 640w, ${src} 1024w` };
  }
  return { src };
}
