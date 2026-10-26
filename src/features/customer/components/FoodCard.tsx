import React from 'react';
import { MenuItem } from '../../../types';
import { formatINR } from '../../../lib/utils';
import { getFoodImageProps } from '../utils/foodImageMap';
import { useInView } from '../hooks/useInView';

interface FoodCardProps {
  item: MenuItem;
  onOpenDetails: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem, sourceEl?: HTMLElement) => void;
  onUpdateQuantity?: (itemId: string, delta: number) => void;
  cartQuantity?: number;
  /** First card of a section — rendered as the large "signature" card. */
  isWideHighlight?: boolean;
  categoryName?: string;
  /** Handwritten side-note shown under the description. */
  hint?: string;
  /** Position inside its section, used to stagger the reveal. */
  index?: number;
}

const TAG_LABEL: Record<string, string> = {
  V: 'Veg',
  N: 'Non-veg',
  S: 'Spicy',
  B: 'Bestseller',
  C: 'Chef’s special',
};

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  onOpenDetails,
  onAddToCart,
  onUpdateQuantity,
  cartQuantity = 0,
  isWideHighlight = false,
  categoryName,
  hint,
  index = 0,
}) => {
  const [ref, seen] = useInView<HTMLElement>(0.12, (index % 4) * 90);
  const isVeg = item.dietary === 'veg' || item.dietary === 'vegan';
  const tagCodes = [
    item.dietary === 'veg' || item.dietary === 'vegan' ? 'V' : 'N',
    item.spiceLevel === 'spicy' || item.spiceLevel === 'extra-spicy' ? 'S' : '',
    item.isBestseller ? 'B' : '',
    item.isChefSpecial ? 'C' : '',
  ].filter(Boolean);
  const tags = tagCodes.map(c => (
    <span key={c} className={`tg ${c}`}>
      {TAG_LABEL[c]}
    </span>
  ));
  const img = getFoodImageProps(item);
  const open = () => onOpenDetails(item);

  return (
    <article
      ref={ref}
      className={`card${isWideHighlight ? ' f' : ''}${seen ? ' in' : ''}${item.isAvailable ? '' : ' na'}`}
      data-id={item.id}
      data-v={isVeg ? 1 : 0}
    >
      <div
        className="im"
        role="button"
        tabIndex={0}
        aria-label={`View details for ${item.name}`}
        onClick={open}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open();
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={img.src}
          srcSet={img.srcSet}
          sizes="(max-width: 760px) 92vw, 520px"
          alt={item.name}
          loading="lazy"
          decoding="async"
        />
        <div className="tags">{tags}</div>
      </div>

      <div className="bd">
        {isWideHighlight && categoryName && <span className="sig">Signature · {categoryName}</span>}
        <h3>
          <i
            className={`dot ${isVeg ? 'v' : 'n'}`}
            role="img"
            aria-label={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
          />
          {item.name}
        </h3>
        <div className="mt">{tags}</div>
        <p>{item.description}</p>
        {hint && <em className="hn">{hint}</em>}
        <div className="ft">
          <span className="pr">{formatINR(item.price)}</span>
          <button type="button" className="cz" onClick={open} aria-label={`Customise ${item.name}`}>
            Customise
          </button>
          <span className="ctl">
            {!item.isAvailable ? (
              <span className="so">Sold out today</span>
            ) : cartQuantity > 0 && onUpdateQuantity ? (
              <span className="step">
                <button
                  type="button"
                  aria-label={`Remove one ${item.name}`}
                  onClick={() => onUpdateQuantity(item.id, -1)}
                >
                  −
                </button>
                <b>{cartQuantity}</b>
                <button
                  type="button"
                  aria-label={`Add one more ${item.name}`}
                  onClick={e => onAddToCart(item, e.currentTarget)}
                >
                  +
                </button>
              </span>
            ) : (
              <button
                type="button"
                className="add"
                aria-label={`Add ${item.name}`}
                onClick={e => onAddToCart(item, e.currentTarget)}
              >
                + Add
              </button>
            )}
          </span>
        </div>
      </div>
    </article>
  );
};
