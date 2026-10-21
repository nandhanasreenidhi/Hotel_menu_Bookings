import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { MenuItem } from '../../../types';
import { formatINR } from '../../../lib/utils';
import { DietaryBadge } from '../../../components/common/DietaryBadge';
import { MenuItemFormModal } from '../components/MenuItemFormModal';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Flame, 
  FolderPlus, 
  Layers, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';

export const AdminMenuPage: React.FC = () => {
  const {
    menuItems,
    categories,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    addCategory,
    deleteCategory,
  } = useRestaurant();

  const [activeCategory, setActiveCategory] = useState<string>('cat-all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  // Filtered menu
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      if (activeCategory !== 'cat-all' && item.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [menuItems, activeCategory, searchQuery]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (itemData: any) => {
    if (editingItem) {
      updateMenuItem(editingItem.id, itemData);
    } else {
      addMenuItem(itemData);
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setNewCatName('');
    setShowAddCat(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Menu Catalog Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Configure dishes, prices, categories, and instantly toggle Sold Out availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddCat(!showAddCat)}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Dish</span>
          </button>
        </div>
      </div>

      {/* Add Category Form Dropdown */}
      {showAddCat && (
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
            Restaurant Menu Categories
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(c => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 text-xs text-stone-200 border border-stone-700"
              >
                <span>{c.name}</span>
                {c.id !== 'cat-all' && (
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="text-stone-400 hover:text-rose-400 ml-1"
                    title="Delete category"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          <form onSubmit={handleCreateCategory} className="flex items-center gap-2 max-w-sm pt-2">
            <input
              type="text"
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              placeholder="e.g. Clay Oven Pizzas, Desserts..."
              className="flex-1 p-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-hidden focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-amber-600 text-stone-950 font-bold text-xs hover:bg-amber-500 transition-colors"
            >
              Add Category
            </button>
          </form>
        </div>
      )}

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-900 text-stone-400 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search menu catalog..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Notice on Real-time sync */}
      <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-stone-400 text-xs flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Toggling an item to <strong>"Sold Out"</strong> immediately updates customer QR menus and disables adding to cart across all live diners.
        </span>
      </div>

      {/* Menu Items Table / Grid */}
      <div className="rounded-2xl bg-stone-900/90 border border-stone-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-stone-400 bg-stone-950/80 border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Dietary & Spice</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-center">In Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-stone-800/30 transition-colors">
                  {/* Dish Name & Thumbnail */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-800"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">{item.name}</span>
                          {item.isChefSpecial && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              Chef
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 line-clamp-1 max-w-sm mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-stone-300 font-medium">
                    {categories.find(c => c.id === item.category)?.name || item.category}
                  </td>

                  {/* Dietary & Spice */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <DietaryBadge type={item.dietary} showLabel />
                      {item.spiceLevel && (
                        <span className="text-[11px] text-amber-400 capitalize">
                          • {item.spiceLevel}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-serif font-bold text-white text-sm">
                    {formatINR(item.price)}
                  </td>

                  {/* Availability Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        item.isAvailable
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900'
                          : 'bg-rose-950 text-rose-300 border border-rose-700 hover:bg-rose-900'
                      }`}
                      title="Click to toggle availability"
                    >
                      {item.isAvailable ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Available</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5 text-rose-400" />
                          <span>Sold Out</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                        title="Edit Dish"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${item.name}" from menu?`)) {
                            deleteMenuItem(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 transition-colors"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Menu Item Form Modal */}
      <MenuItemFormModal
        item={editingItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  );
};
