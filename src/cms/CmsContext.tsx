import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DayMenuSchedule, PackageType } from '../types';
import {
  DEFAULT_BANNERS, DEFAULT_MENUS, DEFAULT_PANELS, DEFAULT_PAYMENT, DEFAULT_PRICING,
  DEFAULT_REGISTRATION_FIELDS, DEFAULT_ROLES, DEFAULT_SITE_SETTINGS, PricingConfig,
  BannerConfig, RegistrationFieldConfig
} from './cmsDefaults';
import { isSupabaseConfigured, supabaseDelete, supabasePatch, supabaseSelect, supabaseUpsert } from './supabaseRest';

export interface PanelConfig { id: string; name: string; sort_order: number; active: boolean; }
export interface RoleConfig { id: string; name: string; active: boolean; }
export interface PermissionConfig { role_id: string; panel_id: string; can_read: boolean; can_write: boolean; can_add: boolean; can_delete: boolean; }
export interface AdminUserConfig { user_id: string; email: string; role_id: string; active: boolean; }
export interface PaymentConfig { bankName: string; accountHolder: string; accountNumber: string; ifscCode: string; accountType: string; authorizedSignatory: string; upiId: string; phone: string; qrUrl?: string; }

interface CmsContextType {
  connected: boolean;
  loading: boolean;
  error: string;
  siteSettings: Record<string, string>;
  pricing: PricingConfig;
  banners: BannerConfig[];
  payment: PaymentConfig;
  registrationFields: RegistrationFieldConfig[];
  menus: Record<PackageType, DayMenuSchedule[]>;
  panels: PanelConfig[];
  roles: RoleConfig[];
  permissions: PermissionConfig[];
  adminUsers: AdminUserConfig[];
  refresh: () => Promise<void>;
  initializeDefaults: () => Promise<void>;
  updateSetting: (key: string, value: string) => Promise<void>;
  updatePricing: (values: Partial<PricingConfig>) => Promise<void>;
  saveBanner: (banner: BannerConfig) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  savePayment: (payment: PaymentConfig) => Promise<void>;
  saveRegistrationField: (field: RegistrationFieldConfig) => Promise<void>;
  deleteRegistrationField: (id: string) => Promise<void>;
  saveMenu: (packageType: PackageType, menu: DayMenuSchedule[]) => Promise<void>;
  savePanel: (panel: PanelConfig) => Promise<void>;
  deletePanel: (id: string) => Promise<void>;
  saveRole: (role: RoleConfig) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  savePermission: (permission: PermissionConfig) => Promise<void>;
  saveAdminUser: (user: AdminUserConfig) => Promise<void>;
  deleteAdminUser: (userId: string) => Promise<void>;
  hasPermission: (roleId: string, panelId: string, action: 'read' | 'write' | 'add' | 'delete') => boolean;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

function asRecord(rows: Array<{ key: string; value: unknown }>) {
  return rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = typeof row.value === 'string' ? row.value : JSON.stringify(row.value);
    return acc;
  }, {});
}

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [pricing, setPricing] = useState(DEFAULT_PRICING);
  const [banners, setBanners] = useState(DEFAULT_BANNERS);
  const [payment, setPayment] = useState<PaymentConfig>(DEFAULT_PAYMENT);
  const [registrationFields, setRegistrationFields] = useState(DEFAULT_REGISTRATION_FIELDS);
  const [menus, setMenus] = useState(DEFAULT_MENUS);
  const [panels, setPanels] = useState<PanelConfig[]>(DEFAULT_PANELS);
  const [roles, setRoles] = useState<RoleConfig[]>(DEFAULT_ROLES);
  const [permissions, setPermissions] = useState<PermissionConfig[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUserConfig[]>([]);

  const seedIfEmpty = async () => {
    const [settingsRows, pricingRows, bannerRows, paymentRows, fieldRows, menuRows, panelRows, roleRows] = await Promise.all([
      supabaseSelect<{ key: string; value: string }>('bmb_settings', 'select=key,value'),
      supabaseSelect<{ key: string; value: number }>('bmb_pricing', 'select=key,value'),
      supabaseSelect<BannerConfig>('bmb_banners', 'select=*',),
      supabaseSelect<any>('bmb_payment_settings', 'select=*'),
      supabaseSelect<RegistrationFieldConfig>('bmb_registration_fields', 'select=*&order=sort_order.asc'),
      supabaseSelect<{ package_type: PackageType; menu: DayMenuSchedule[] }>('bmb_menus', 'select=*'),
      supabaseSelect<PanelConfig>('bmb_panels', 'select=*&order=sort_order.asc'),
      supabaseSelect<RoleConfig>('bmb_roles', 'select=*')
    ]);

    if (!settingsRows.length) await supabaseUpsert('bmb_settings', Object.entries(DEFAULT_SITE_SETTINGS).map(([key, value]) => ({ key, value })));
    if (!pricingRows.length) await supabaseUpsert('bmb_pricing', Object.entries(DEFAULT_PRICING).map(([key, value]) => ({ key, value })));
    if (!bannerRows.length) await supabaseUpsert('bmb_banners', DEFAULT_BANNERS);
    if (!paymentRows.length) await supabaseUpsert('bmb_payment_settings', [{ id: 'default', bank_name: DEFAULT_PAYMENT.bankName, account_holder: DEFAULT_PAYMENT.accountHolder, account_number: DEFAULT_PAYMENT.accountNumber, ifsc_code: DEFAULT_PAYMENT.ifscCode, account_type: DEFAULT_PAYMENT.accountType, authorized_signatory: DEFAULT_PAYMENT.authorizedSignatory, upi_id: DEFAULT_PAYMENT.upiId, phone: DEFAULT_PAYMENT.phone, qr_url: DEFAULT_PAYMENT.qrUrl || '' }]);
    if (!fieldRows.length) await supabaseUpsert('bmb_registration_fields', DEFAULT_REGISTRATION_FIELDS);
    if (!menuRows.length) await supabaseUpsert('bmb_menus', Object.entries(DEFAULT_MENUS).map(([package_type, menu]) => ({ package_type, menu })));
    if (!panelRows.length) await supabaseUpsert('bmb_panels', DEFAULT_PANELS);
    if (!roleRows.length) await supabaseUpsert('bmb_roles', DEFAULT_ROLES);
    const permissionRows = await supabaseSelect<PermissionConfig>('bmb_permissions', 'select=*');
    if (!permissionRows.length) {
      const rows: PermissionConfig[] = [];
      for (const role of DEFAULT_ROLES) for (const panel of DEFAULT_PANELS) rows.push({
        role_id: role.id, panel_id: panel.id,
        can_read: role.id === 'ceo-director' || ['dashboard','banners','menu','pricing','registration','payments','business','media','customers','orders','inventory','staff'].includes(panel.id),
        can_write: role.id === 'ceo-director', can_add: role.id === 'ceo-director', can_delete: role.id === 'ceo-director'
      });
      await supabaseUpsert('bmb_permissions', rows);
    }
  };

  const initializeDefaults = async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true); setError('');
    try { await seedIfEmpty(); await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to initialize CMS'); }
    finally { setLoading(false); }
  };

  const refresh = async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true); setError('');
    try {
      const [settingsRows, pricingRows, bannerRows, paymentRows, fieldRows, menuRows, panelRows, roleRows, permissionRows, adminUserRows] = await Promise.all([
        supabaseSelect<{ key: string; value: string }>('bmb_settings', 'select=key,value'),
        supabaseSelect<{ key: string; value: number }>('bmb_pricing', 'select=key,value'),
        supabaseSelect<BannerConfig>('bmb_banners', 'select=*&order=sort_order.asc'),
        supabaseSelect<any>('bmb_payment_settings', 'select=*&limit=1'),
        supabaseSelect<RegistrationFieldConfig>('bmb_registration_fields', 'select=*&order=sort_order.asc'),
        supabaseSelect<{ package_type: PackageType; menu: DayMenuSchedule[] }>('bmb_menus', 'select=*'),
        supabaseSelect<PanelConfig>('bmb_panels', 'select=*&order=sort_order.asc'),
        supabaseSelect<RoleConfig>('bmb_roles', 'select=*'),
        supabaseSelect<PermissionConfig>('bmb_permissions', 'select=*'),
        supabaseSelect<AdminUserConfig>('bmb_admin_users', 'select=user_id,email,role_id,active')
      ]);
      setSiteSettings({ ...DEFAULT_SITE_SETTINGS, ...asRecord(settingsRows) });
      setPricing({ ...DEFAULT_PRICING, ...Object.fromEntries(pricingRows.map(r => [r.key, Number(r.value)])) });
      if (bannerRows.length) setBanners(bannerRows);
      if (paymentRows[0]) setPayment({ bankName: paymentRows[0].bank_name, accountHolder: paymentRows[0].account_holder, accountNumber: paymentRows[0].account_number, ifscCode: paymentRows[0].ifsc_code, accountType: paymentRows[0].account_type, authorizedSignatory: paymentRows[0].authorized_signatory, upiId: paymentRows[0].upi_id, phone: paymentRows[0].phone, qrUrl: paymentRows[0].qr_url });
      if (fieldRows.length) setRegistrationFields(fieldRows);
      if (menuRows.length) setMenus(prev => ({ ...prev, ...Object.fromEntries(menuRows.map(r => [r.package_type, r.menu])) }));
      if (panelRows.length) setPanels(panelRows);
      if (roleRows.length) setRoles(roleRows);
      setPermissions(permissionRows);
      setAdminUsers(adminUserRows);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load central settings');
    } finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const id = window.setInterval(() => { refresh(); }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const updateSetting = async (key: string, value: string) => {
    setSiteSettings(prev => ({ ...prev, [key]: value }));
    if (isSupabaseConfigured) await supabaseUpsert('bmb_settings', { key, value });
  };
  const updatePricing = async (values: Partial<PricingConfig>) => {
    const next = { ...pricing, ...values };
    setPricing(next);
    // Keep package banner price text synchronized with the single pricing source of truth.
    setBanners(prev => prev.map(b => {
      if (b.id === 'veg') return { ...b, highlight_price: `₹${next.vegMonthly}`, thali_rate: `₹${next.vegThaliInstant} Instant Single Thali` };
      if (b.id === 'egg') return { ...b, highlight_price: `₹${next.eggMonthly}`, thali_rate: `₹${next.eggThaliInstant} Instant Single Thali` };
      if (b.id === 'non-veg') return { ...b, highlight_price: `₹${next.nonVegMonthly}`, thali_rate: `₹${next.nonVegThaliInstant} Instant Single Thali` };
      if (b.id === 'instant') return { ...b, highlight_price: `From ₹${next.vegThaliInstant}`, thali_rate: `Veg: ₹${next.vegThaliInstant} | Egg: ₹${next.eggThaliInstant} | Non-Veg: ₹${next.nonVegThaliInstant}` };
      return b;
    }));
    if (isSupabaseConfigured) {
      await supabaseUpsert('bmb_pricing', Object.entries(values).map(([key, value]) => ({ key, value })));
      const updatedBanners = banners.map(b => {
        if (b.id === 'veg') return { ...b, highlight_price: `₹${next.vegMonthly}`, thali_rate: `₹${next.vegThaliInstant} Instant Single Thali` };
        if (b.id === 'egg') return { ...b, highlight_price: `₹${next.eggMonthly}`, thali_rate: `₹${next.eggThaliInstant} Instant Single Thali` };
        if (b.id === 'non-veg') return { ...b, highlight_price: `₹${next.nonVegMonthly}`, thali_rate: `₹${next.nonVegThaliInstant} Instant Single Thali` };
        if (b.id === 'instant') return { ...b, highlight_price: `From ₹${next.vegThaliInstant}`, thali_rate: `Veg: ₹${next.vegThaliInstant} | Egg: ₹${next.eggThaliInstant} | Non-Veg: ₹${next.nonVegThaliInstant}` };
        return b;
      });
      for (const banner of updatedBanners.filter(b => ['veg','egg','non-veg','instant'].includes(b.id))) await supabaseUpsert('bmb_banners', banner);
    }
  };
  const saveBanner = async (banner: BannerConfig) => {
    setBanners(prev => [...prev.filter(b => b.id !== banner.id), banner].sort((a,b) => a.sort_order-b.sort_order));
    if (isSupabaseConfigured) await supabaseUpsert('bmb_banners', banner);
  };
  const deleteBanner = async (id: string) => { setBanners(prev => prev.filter(b => b.id !== id)); if (isSupabaseConfigured) await supabaseDelete('bmb_banners', `id=eq.${encodeURIComponent(id)}`); };
  const savePayment = async (value: PaymentConfig) => { setPayment(value); if (isSupabaseConfigured) await supabaseUpsert('bmb_payment_settings', { id: 'default', bank_name: value.bankName, account_holder: value.accountHolder, account_number: value.accountNumber, ifsc_code: value.ifscCode, account_type: value.accountType, authorized_signatory: value.authorizedSignatory, upi_id: value.upiId, phone: value.phone, qr_url: value.qrUrl || '' }); };
  const saveRegistrationField = async (field: RegistrationFieldConfig) => { setRegistrationFields(prev => [...prev.filter(f => f.id !== field.id), field].sort((a,b) => a.sort_order-b.sort_order)); if (isSupabaseConfigured) await supabaseUpsert('bmb_registration_fields', field); };
  const deleteRegistrationField = async (id: string) => { setRegistrationFields(prev => prev.filter(f => f.id !== id)); if (isSupabaseConfigured) await supabaseDelete('bmb_registration_fields', `id=eq.${encodeURIComponent(id)}`); };
  const saveMenu = async (packageType: PackageType, menu: DayMenuSchedule[]) => { setMenus(prev => ({ ...prev, [packageType]: menu })); if (isSupabaseConfigured) await supabaseUpsert('bmb_menus', { package_type: packageType, menu }); };
  const savePanel = async (panel: PanelConfig) => { setPanels(prev => [...prev.filter(p => p.id !== panel.id), panel].sort((a,b) => a.sort_order-b.sort_order)); if (isSupabaseConfigured) await supabaseUpsert('bmb_panels', panel); };
  const deletePanel = async (id: string) => { setPanels(prev => prev.filter(p => p.id !== id)); if (isSupabaseConfigured) await supabaseDelete('bmb_panels', `id=eq.${encodeURIComponent(id)}`); };
  const saveRole = async (role: RoleConfig) => { setRoles(prev => [...prev.filter(r => r.id !== role.id), role]); if (isSupabaseConfigured) await supabaseUpsert('bmb_roles', role); };
  const deleteRole = async (id: string) => { setRoles(prev => prev.filter(r => r.id !== id)); if (isSupabaseConfigured) await supabaseDelete('bmb_roles', `id=eq.${encodeURIComponent(id)}`); };
  const savePermission = async (permission: PermissionConfig) => { setPermissions(prev => [...prev.filter(p => !(p.role_id === permission.role_id && p.panel_id === permission.panel_id)), permission]); if (isSupabaseConfigured) await supabaseUpsert('bmb_permissions', permission); };
  const saveAdminUser = async (user: AdminUserConfig) => { setAdminUsers(prev => [...prev.filter(u => u.user_id !== user.user_id), user]); if (isSupabaseConfigured) await supabaseUpsert('bmb_admin_users', user); };
  const deleteAdminUser = async (userId: string) => { setAdminUsers(prev => prev.filter(u => u.user_id !== userId)); if (isSupabaseConfigured) await supabaseDelete('bmb_admin_users', `user_id=eq.${encodeURIComponent(userId)}`); };
  const hasPermission = (roleId: string, panelId: string, action: 'read'|'write'|'add'|'delete') => {
    if (roleId === 'ceo-director') return true;
    const p = permissions.find(x => x.role_id === roleId && x.panel_id === panelId);
    return Boolean(p && ({ read: p.can_read, write: p.can_write, add: p.can_add, delete: p.can_delete }[action]));
  };

  const value = useMemo(() => ({ connected: isSupabaseConfigured, loading, error, siteSettings, pricing, banners, payment, registrationFields, menus, panels, roles, permissions, adminUsers, refresh, initializeDefaults, updateSetting, updatePricing, saveBanner, deleteBanner, savePayment, saveRegistrationField, deleteRegistrationField, saveMenu, savePanel, deletePanel, saveRole, deleteRole, savePermission, saveAdminUser, deleteAdminUser, hasPermission }), [loading, error, siteSettings, pricing, banners, payment, registrationFields, menus, panels, roles, permissions, adminUsers]);
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) throw new Error('useCms must be used within a CmsProvider');
  return context;
};
