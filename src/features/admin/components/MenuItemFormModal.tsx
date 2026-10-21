import React, { useState, useEffect } from 'react';
import { MenuItem, DietaryType, SpiceLevel } from '../../../types';
import { useRestaurant } from '../../../context/RestaurantContext';
import { X, Sparkles, Image, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MenuItemFormModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: any) => void;
}

export const MenuItemFormModal: React.FC<MenuItemFormModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
}) => {
  const { categories } = useRestaurant();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('cat-mains');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(450);
  const [image, setImage] = useState('');
  const [dietary, setDietary] = useState<DietaryType>('veg');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('medium');
  const [isChefSpecial, setIsChefSpecial] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [prepTime, setPrepTime] = useState(15);
  const [calories, setCalories] = useState(420);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setDescription(item.description);
      setPrice(item.price);
      setImage(item.image);
      setDietary(item.dietary);
      setSpiceLevel(item.spiceLevel || 'medium');
      setIsChefSpecial(!!item.isChefSpecial);
      setIsAvailable(item.isAvailable);
      setPrepTime(item.preparationTimeMinutes || 15);
      setCalories(item.calories || 400);
    } else {
      setName('');
      setCategory(categories[1]?.id || 'cat-starters');
      setDescription('');
      setPrice(450);
      setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
      setDietary('veg');
      setSpiceLevel('medium');
      setIsChefSpecial(false);
      setIsAvailable(true);
      setPrepTime(15);
      setCalories(400);
    }
  }, [item, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      category,
      description: description.trim(),
      price: Number(price) || 0,
      image: image.trim(),
      dietary,
      spiceLevel,
      isChefSpecial,
      isAvailable,
      preparationTimeMinutes: Number(prepTime) || 15,
      calories: Number(calories) || undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl shadow-2xl flex flex-col z-10 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{item ? 'Edit Culinary Item' : 'Add New Menu Item'}</span>
            </h3>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {/* Name */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Item Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Awadhi Murgh Tikka"
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  {categories.filter(c => c.id !== 'cat-all').map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Price (₹ INR) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Dietary & Spice */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Dietary Classification</label>
                <select
                  value={dietary}
                  onChange={e => setDietary(e.target.value as DietaryType)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  <option value="veg">Vegetarian (Veg)</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="vegan">Pure Vegan</option>
                  <option value="egg">Contains Egg</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Spice Level</label>
                <select
                  value={spiceLevel}
                  onChange={e => setSpiceLevel(e.target.value as SpiceLevel)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  <option value="mild">Mild</option>
                  <option value="medium">Medium</option>
                  <option value="spicy">Spicy</option>
                  <option value="extra-spicy">Extra Fiery</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Culinary Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe flavors, cooking method, ingredients..."
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1">High-Res Image URL</label>
              <input
                type="url"
                value={image}
                onChange={e => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Prep Time & Calories */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Prep Time (mins)</label>
                <input
                  type="number"
                  value={prepTime}
                  onChange={e => setPrepTime(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  value={calories}
                  onChange={e => setCalories(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChefSpecial}
                  onChange={e => setIsChefSpecial(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-stone-900 border-stone-700"
                />
                <span className="text-stone-300 font-medium">Chef's Signature Dish</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={e => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-stone-900 border-stone-700"
                />
                <span className="text-stone-300 font-medium">Available (In Stock)</span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                {item ? 'Save Changes' : 'Create Menu Item'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
