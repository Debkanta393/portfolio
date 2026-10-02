'use client';

import React, { useEffect, useState } from 'react';
import { Save, Settings, Layers, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { api } from '../../../lib/api';
import { WebsiteSetting, Statistic } from '../../../types';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<WebsiteSetting[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    Promise.allSettled([api.getSettings(), api.getStatistics()]).then(([setRes, statRes]) => {
      if (setRes.status === 'fulfilled') setSettings(setRes.value);
      if (statRes.status === 'fulfilled') setStatistics(statRes.value);
      setLoading(false);
    });
  }, []);

  const handleSettingChange = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await Promise.all(
        settings.map((s) => api.updateSetting(s.key, s.value, s.description || undefined))
      );
      toast.success('Website configuration saved successfully');
    } catch (err: any) {
      toast.error('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpdateStat = async (stat: Statistic) => {
    try {
      await api.updateStatistic(stat.id, stat);
      toast.success(`Statistic '${stat.label}' updated`);
    } catch {
      toast.error('Failed to update statistic');
    }
  };

  const handleDeleteStat = async (id: string) => {
    try {
      await api.deleteStatistic(id);
      setStatistics(statistics.filter((s) => s.id !== id));
      toast.success('Statistic removed');
    } catch {
      toast.error('Failed to delete statistic');
    }
  };

  const handleAddStat = async () => {
    try {
      const created = await api.createStatistic({
        label: 'New Statistic',
        value: '10+',
        icon: 'Code',
        displayOrder: statistics.length + 1,
      });
      setStatistics([...statistics, created]);
      toast.success('New statistic added');
    } catch {
      toast.error('Failed to add statistic');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 w-full lg:w-[80%] lg:max-w-none">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Website Configuration & SEO</h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage site branding, SEO metadata, colors, and dynamic professional statistics.
        </p>
      </div>

      {/* Website General Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan" />
          General Site Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {settings.map((setting) => (
            <div key={setting.key}>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 capitalize">
                {setting.key.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                value={setting.value || ''}
                onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white text-sm focus:outline-none focus:border-cyan"
              />
              {setting.description && (
                <span className="block text-[11px] text-slate-400 mt-1">
                  {setting.description}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-navy-800 flex justify-end">
          <Button type="submit" variant="primary" size="md" isLoading={savingSettings}>
            <Save className="w-4 h-4 mr-2" />
            <span>Save Settings</span>
          </Button>
        </div>
      </form>

      {/* Professional Statistics Management */}
      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan" />
              Dynamic Statistics Counters
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              These values populate the professional statistics counter on the homepage.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleAddStat}>
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add Stat</span>
          </Button>
        </div>

        <div className="space-y-3">
          {statistics.map((stat) => (
            <div
              key={stat.id}
              className="bg-navy-950 p-4 rounded-2xl border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="grid grid-cols-2 gap-3 w-full sm:w-2/3">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => {
                    stat.value = e.target.value;
                    setStatistics([...statistics]);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-800 text-cyan font-mono font-bold text-sm focus:outline-none"
                  placeholder="e.g. 7+"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => {
                    stat.label = e.target.value;
                    setStatistics([...statistics]);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-800 text-white text-xs focus:outline-none"
                  placeholder="Label"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button variant="primary" size="sm" onClick={() => handleUpdateStat(stat)}>
                  <Save className="w-3.5 h-3.5" />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteStat(stat.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
