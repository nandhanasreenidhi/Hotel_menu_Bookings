import React, { useState } from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { RestaurantTable } from '../../../types';
import { formatINR } from '../../../lib/utils';
import { Info, X, Copy, Check, ShoppingBag } from 'lucide-react';
import { HERO_IMAGE } from '../utils/foodImageMap';
import { SplitWords } from './MenuSection';

interface MenuHeaderProps {
  table?: RestaurantTable;
  tableCode: string;
  onExploreClick?: () => void;
  onFavoritesClick?: () => void;
  cartCount?: number;
  cartTotal?: number;
  onCartClick?: () => void;
}

/** Sticky top bar (brand + table + info + cart) followed by the hero. */
export const MenuHeader: React.FC<MenuHeaderProps> = ({
  table,
  tableCode,
  onExploreClick,
  onFavoritesClick,
  cartCount = 0,
  cartTotal = 0,
  onCartClick,
}) => {
  const { settings } = useRestaurant();
  const [showInfo, setShowInfo] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  const brand = settings.name || 'Dakshin Kitchen';
  const tableLabel = `Table ${table?.tableNumber || tableCode}${table?.section ? ` · ${table.section}` : ''}`;

  const handleCopyWifi = () => {
    if (settings.wifiPassword) {
      navigator.clipboard?.writeText(settings.wifiPassword);
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    }
  };

  return (
    <>
      <header className="top">
        <div className="wrap bar">
          <div className="brand">
            <div className="logo">{brand}</div>
            <div className="tbl">{tableLabel}</div>
          </div>
          <div className="hact">
            <button
              type="button"
              className="infob"
              onClick={() => setShowInfo(v => !v)}
              aria-expanded={showInfo}
              aria-label="Restaurant information and Wi-Fi"
            >
              {showInfo ? <X size={18} /> : <Info size={18} />}
            </button>
            {onCartClick && (
              <button
                type="button"
                className="cartbtn"
                id="cb"
                onClick={onCartClick}
                aria-label={
                  cartCount
                    ? `Open order, ${cartCount} item${cartCount > 1 ? 's' : ''}, ${formatINR(cartTotal)}`
                    : 'Open order, empty'
                }
              >
                <ShoppingBag size={18} aria-hidden />
                <span className="cart-label">Your order</span>
                <span className={`cnt${cartCount ? ' bump' : ''}`} key={cartCount}>
                  {cartCount}
                </span>
                {cartCount > 0 && <span className="cs">{formatINR(cartTotal)}</span>}
              </button>
            )}
          </div>
        </div>

        {showInfo && (
          <div className="infop">
            <div className="wrap">
              <div>
                <h4>Service hours</h4>
                {settings.openingTime} – {settings.closingTime} daily
              </div>
              <div>
                <h4>Find us</h4>
                {settings.address}
              </div>
              {settings.wifiName && (
                <div>
                  <h4>Guest Wi-Fi</h4>
                  Network: <strong style={{ color: 'var(--cream)' }}>{settings.wifiName}</strong>
                  {settings.wifiPassword && (
                    <div>
                      <button type="button" className="wifi" onClick={handleCopyWifi} title="Copy Wi-Fi password">
                        {copiedWifi ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedWifi ? 'Copied' : settings.wifiPassword}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div>
                <h4>Contact</h4>
                {settings.phone}
              </div>
              <div className="fine2">
                FSSAI: {settings.fssaiNumber} • GST: {settings.gstNumber} • Contactless QR dine-in
              </div>
            </div>
          </div>
        )}
      </header>

      <section className="wrap hero" id="top">
        <div>
          <div className="eyebrow rv d1">Freshly prepared. Rooted in tradition.</div>
          <h1 className="rv d2">
            <SplitWords text="A Little Taste of the" />{' '}
            <em>
              <SplitWords text="South." startIndex={5} />
            </em>
          </h1>
          <p className="rv d3">
            Crisp ghee dosas, cloud-soft idlis, banana-leaf meals and filter coffee strong enough to fix Mondays.
            Old-school recipes, new-school energy.
          </p>
          <div className="ctas rv d4">
            <button type="button" className="btn p" onClick={onExploreClick}>
              Explore the Menu
            </button>
            {onFavoritesClick && (
              <button type="button" className="btn s" onClick={onFavoritesClick}>
                Order Your Favourites
              </button>
            )}
          </div>
        </div>
        <div className="plate zin float" id="hero">
          <img
            src={HERO_IMAGE}
            alt="Masala dosa on a banana leaf with sambar and chutneys"
            fetchPriority="high"
            width={1024}
            height={1024}
          />
        </div>
        <div className="stamp" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <defs>
              <path id="spth" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" />
            </defs>
            <circle cx="60" cy="60" r="58" fill="#21150F" stroke="#C9A25B" strokeWidth="1.5" />
            <text fontSize="9" letterSpacing="2" fill="#C9A25B" fontFamily="DM Sans,sans-serif" fontWeight="700">
              <textPath href="#spth">FRESH DAILY • MADE IN THE SOUTH • </textPath>
            </text>
            <circle cx="60" cy="60" r="27" fill="#B96E42" />
            <text x="60" y="66" textAnchor="middle" fontSize="19" fill="#F2E5CC" fontFamily="Fraunces,serif" fontStyle="italic">
              DK
            </text>
          </svg>
        </div>
      </section>
    </>
  );
};
