import React, { useState } from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { 
  Settings, 
  Store, 
  Receipt, 
  Wifi, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  Save
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useRestaurant();

  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [gstNumber, setGstNumber] = useState(settings.gstNumber);
  const [fssaiNumber, setFssaiNumber] = useState(settings.fssaiNumber);
  const [gstPercentage, setGstPercentage] = useState(settings.gstPercentage);
  const [serviceChargePercentage, setServiceChargePercentage] = useState(settings.serviceChargePercentage);
  const [isServiceChargeEnabled, setIsServiceChargeEnabled] = useState(settings.isServiceChargeEnabled);
  const [estimatedPrepTimeMinutes, setEstimatedPrepTimeMinutes] = useState(settings.estimatedPrepTimeMinutes);
  const [openingTime, setOpeningTime] = useState(settings.openingTime);
  const [closingTime, setClosingTime] = useState(settings.closingTime);
  const [wifiName, setWifiName] = useState(settings.wifiName || '');
  const [wifiPassword, setWifiPassword] = useState(settings.wifiPassword || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name: name.trim(),
      tagline: tagline.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      gstNumber: gstNumber.trim(),
      fssaiNumber: fssaiNumber.trim(),
      gstPercentage: Number(gstPercentage) || 0,
      serviceChargePercentage: Number(serviceChargePercentage) || 0,
      isServiceChargeEnabled,
      estimatedPrepTimeMinutes: Number(estimatedPrepTimeMinutes) || 15,
      openingTime,
      closingTime,
      wifiName: wifiName.trim(),
      wifiPassword: wifiPassword.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Restaurant Branding & System Settings
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Configure brand name, GST taxes, service charges, dining hours, and guest Wi-Fi.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings Saved & Synced!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs text-stone-300">
        {/* Brand Identity */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Brand Identity & Nomenclature</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Restaurant Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-serif font-bold text-sm focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Cuisine / Subtitle Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Physical Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Host Desk Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Inquiries Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Taxes & Bill Surcharges */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-400" />
            <span>Taxes & Service Surcharges</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">GST Tax Percentage (%)</label>
              <input
                type="number"
                min={0}
                max={28}
                value={gstPercentage}
                onChange={e => setGstPercentage(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono focus:outline-hidden focus:border-emerald-500"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">Standard Indian Restaurant GST is 5%</span>
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Service Charge Percentage (%)</label>
              <input
                type="number"
                min={0}
                max={20}
                value={serviceChargePercentage}
                onChange={e => setServiceChargePercentage(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl bg-stone-950 border border-stone-800">
              <input
                type="checkbox"
                checked={isServiceChargeEnabled}
                onChange={e => setIsServiceChargeEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-stone-900 border-stone-700"
              />
              <span className="text-stone-200 font-semibold">Enable Optional Dining Room Service Charge</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">GSTIN Number</label>
              <input
                type="text"
                value={gstNumber}
                onChange={e => setGstNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono uppercase focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">FSSAI License Number</label>
              <input
                type="text"
                value={fssaiNumber}
                onChange={e => setFssaiNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Guest Amenities & Operations */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Wifi className="w-4 h-4 text-teal-400" />
            <span>Hours & Guest Wi-Fi Portal</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Opening Time</label>
              <input
                type="text"
                value={openingTime}
                onChange={e => setOpeningTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Closing Time</label>
              <input
                type="text"
                value={closingTime}
                onChange={e => setClosingTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Est. Kitchen Prep Speed (mins)</label>
              <input
                type="number"
                min={5}
                max={60}
                value={estimatedPrepTimeMinutes}
                onChange={e => setEstimatedPrepTimeMinutes(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Guest Wi-Fi SSID</label>
              <input
                type="text"
                value={wifiName}
                onChange={e => setWifiName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Guest Wi-Fi Password</label>
              <input
                type="text"
                value={wifiPassword}
                onChange={e => setWifiPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Apply & Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
