import React, { useMemo, useState } from 'react';
import { useCms, PanelConfig, RoleConfig, PermissionConfig } from '../../cms/CmsContext';
import { BannerConfig, RegistrationFieldConfig } from '../../cms/cmsDefaults';
import { PackageType } from '../../types';
import { isSupabaseConfigured, restoreSession, signIn, signOut, supabaseSelect } from '../../cms/supabaseRest';
import { Save, Plus, Trash2, ShieldCheck, LayoutDashboard, Image, Utensils, IndianRupee, FileText, CreditCard, Settings, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

const input = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500';
const card = 'bg-white rounded-2xl border border-gray-200 shadow-sm p-5';

export const DAdminDesigner: React.FC = () => {
  const cms = useCms();
  const [authorized, setAuthorized] = useState(!isSupabaseConfigured);
  const [loginChecked, setLoginChecked] = useState(!isSupabaseConfigured);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('ceo-director');
  const [newPanel, setNewPanel] = useState<PanelConfig>({ id: '', name: '', sort_order: 99, active: true });
  const [newRole, setNewRole] = useState<RoleConfig>({ id: '', name: '', active: true });

  React.useEffect(() => {
    if (!isSupabaseConfigured) return;
    const check = async () => {
      restoreSession();
      try {
        const users = await supabaseSelect<{ user_id: string; email: string; role_id: string; active: boolean }>('bmb_admin_users', 'select=user_id,email,role_id,active&limit=1');
        const ok = Boolean(users[0]?.active && users[0]?.role_id === 'ceo-director');
        setAuthorized(ok);
        if (ok) await cms.initializeDefaults();
      } catch { setAuthorized(false); }
      finally { setLoginChecked(true); }
    };
    check();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginError('');
    try {
      const user = await signIn(email.trim(), password);
      const rows = await supabaseSelect<{ user_id: string; email: string; role_id: string; active: boolean }>('bmb_admin_users', `select=user_id,email,role_id,active&user_id=eq.${encodeURIComponent(user.id)}&limit=1`);
      if (!rows[0]?.active || rows[0].role_id !== 'ceo-director') { signOut(); throw new Error('This account is not registered as CEO Cum Director / D-Admin.'); }
      setAuthorized(true);
      await cms.initializeDefaults();
    } catch (err) { setAuthorized(false); setLoginError(err instanceof Error ? err.message : 'Login failed'); }
  };

  const flash = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(''), 2500); };

  const tabs = [
    ['overview','Overview',LayoutDashboard], ['branding','Brand & Business',Settings], ['banners','Banners',Image], ['menu','Menu',Utensils],
    ['pricing','Pricing',IndianRupee], ['registration','Registration Form',FileText], ['payments','Payments & UPI',CreditCard], ['access','Roles & Permissions',ShieldCheck]
  ] as const;

  if (isSupabaseConfigured && !loginChecked) return <div className="min-h-screen flex items-center justify-center bg-[#F6F3EC]"><div className="text-sm font-bold text-[#124E33]">Checking D-Admin access…</div></div>;

  if (isSupabaseConfigured && !authorized) {
    return <div className="min-h-screen bg-[#F6F3EC] flex items-center justify-center p-5"><form onSubmit={handleLogin} className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-7 space-y-4"><div className="text-[10px] uppercase tracking-[0.22em] text-amber-600 font-black">D-ADMIN DESIGNER</div><h1 className="text-2xl font-black text-[#124E33]">CEO Cum Director Login</h1><p className="text-sm text-gray-500">Sign in with the Supabase Auth account registered for D-Admin.</p><input className={input} type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input className={input} type="password" required placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>{loginError&&<div className="text-sm text-rose-700 bg-rose-50 p-3 rounded-xl">{loginError}</div>}<button className="w-full py-3 rounded-xl bg-[#124E33] text-white font-black">Sign in to D-Admin</button></form></div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F6F3EC] p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1500px] mx-auto space-y-5">
        <header className="rounded-2xl bg-[#0C3822] text-white p-5 sm:p-6 shadow-lg border-b-4 border-[#C88A24] flex flex-wrap gap-4 justify-between items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-amber-300 font-black">D-ADMIN DESIGNER</div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">CEO Cum Director Control Centre</h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">One central source for website, Android and iOS content.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-2 rounded-xl text-xs font-bold ${cms.connected ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200'}`}>
              {cms.connected ? '● Supabase connected' : '● Local preview mode'}
            </span>
            <button onClick={() => cms.refresh()} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20" title="Refresh central data"><RefreshCw className="w-4 h-4" /></button>{isSupabaseConfigured && <button onClick={() => { signOut(); setAuthorized(false); }} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold">Logout</button>}
          </div>
        </header>

        {message && <div className="fixed right-5 top-5 z-[100] bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="w-4 h-4" />{message}</div>}
        {cms.error && <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-sm"><AlertTriangle className="inline w-4 h-4 mr-1" />{cms.error}</div>}

        <div className="bg-[#124E33] rounded-2xl p-2 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map(([id, label, Icon]) => <button key={id} onClick={() => setTab(id)} className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${tab===id ? 'bg-white text-[#124E33]' : 'text-emerald-100 hover:bg-white/10'}`}><Icon className="w-4 h-4" />{label}</button>)}
          </div>
        </div>

        {tab === 'overview' && <Overview cms={cms} />}
        {tab === 'branding' && <Branding cms={cms} flash={flash} />}
        {tab === 'banners' && <Banners cms={cms} flash={flash} />}
        {tab === 'menu' && <Menus cms={cms} flash={flash} />}
        {tab === 'pricing' && <Pricing cms={cms} flash={flash} />}
        {tab === 'registration' && <Registration cms={cms} flash={flash} />}
        {tab === 'payments' && <Payments cms={cms} flash={flash} />}
        {tab === 'access' && <Access cms={cms} selectedRole={selectedRole} setSelectedRole={setSelectedRole} newPanel={newPanel} setNewPanel={setNewPanel} newRole={newRole} setNewRole={setNewRole} flash={flash} />}
      </div>
    </div>
  );
};

function Overview({ cms }: { cms: ReturnType<typeof useCms> }) {
  const cards = [
    ['Banners', cms.banners.filter(x=>x.active).length, 'Change image, text, button and order'],
    ['Menu schedules', Object.keys(cms.menus).length, 'Central weekly menus'],
    ['Registration fields', cms.registrationFields.filter(x=>x.active).length, 'Add/remove/reorder fields'],
    ['Roles', cms.roles.filter(x=>x.active).length, 'Role-based access'],
    ['Panels', cms.panels.filter(x=>x.active).length, 'Designer-created workspaces'],
    ['Pricing records', Object.keys(cms.pricing).length, 'Used everywhere in the app']
  ];
  return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{cards.map(([title,value,desc]) => <div className={card} key={title}><div className="text-xs uppercase tracking-wider text-gray-500 font-black">{title}</div><div className="text-3xl font-black text-[#124E33] mt-2">{value}</div><div className="text-xs text-gray-500 mt-1">{desc}</div></div>)}</div>;
}

function Branding({ cms, flash }: any) {
  const [form, setForm] = useState(cms.siteSettings);
  const save = async () => { for (const [key,value] of Object.entries(form)) await cms.updateSetting(key, String(value)); flash('Business and branding settings saved'); };
  return <div className={card}><h2 className="text-xl font-black text-[#124E33] mb-4">Brand & Business Information</h2><div className="grid md:grid-cols-2 gap-4">{[['business_name','Business Name'],['legal_name','Legal / Company Name'],['tagline','Tagline'],['phone','Phone'],['whatsapp','WhatsApp'],['email','Email'],['address','Address'],['google_maps_url','Google Maps URL'],['logo_url','Logo Image URL']].map(([key,label])=><label className="text-sm font-bold text-gray-700" key={key}>{label}<input className={input} value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}</div><button onClick={save} className="mt-5 px-4 py-2.5 rounded-xl bg-[#124E33] text-white font-bold flex gap-2 items-center"><Save className="w-4 h-4"/>Save</button></div>;
}

function Banners({ cms, flash }: any) {
  const blank: BannerConfig = { ...cms.banners[0], id: `banner-${Date.now()}`, title:'New Banner', tag:'NEW', highlight_price:'', period:'', thali_rate:'', description:'', features:[], sort_order:cms.banners.length+1, active:true, image_url:'', image_alt:'', dish_highlights:[] };
  const [draft, setDraft] = useState<BannerConfig>(cms.banners[0] || blank);
  const [editing, setEditing] = useState<string>(cms.banners[0]?.id || '');
  const select = (id:string) => { const b=cms.banners.find((x:any)=>x.id===id); if(b){setEditing(id);setDraft(b);} };
  const save = async () => { await cms.saveBanner(draft); flash('Banner saved. It will sync to every connected client.'); };
  const remove = async () => { if(confirm('Delete this banner?')) { await cms.deleteBanner(editing); const next=cms.banners.find((x:any)=>x.id!==editing); if(next){setEditing(next.id);setDraft(next);} flash('Banner deleted'); } };
  const field=(label:string,key:keyof BannerConfig)=><label className="text-sm font-bold text-gray-700">{label}<input className={input} value={String((draft as any)[key]??'')} onChange={e=>setDraft({...draft,[key]:e.target.value} as any)}/></label>;
  return <div className="space-y-4"><div className={card}><div className="flex flex-wrap gap-2 items-center justify-between"><h2 className="text-xl font-black text-[#124E33]">Slider Banner Manager</h2><button onClick={()=>{const b={...blank,id:`banner-${Date.now()}`};setDraft(b);setEditing(b.id)}} className="px-3 py-2 rounded-xl bg-amber-500 font-bold text-sm flex gap-2"><Plus className="w-4 h-4"/>New Banner</button></div><div className="flex gap-2 overflow-x-auto mt-4">{cms.banners.map((b:any)=><button key={b.id} onClick={()=>select(b.id)} className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${editing===b.id?'bg-[#124E33] text-white':'bg-gray-100'}`}>{b.sort_order}. {b.title}</button>)}</div></div><div className={card}><div className="grid md:grid-cols-2 gap-4">{field('Tag','tag')}{field('Title','title')}{field('Price / Highlight','highlight_price')}{field('Period','period')}{field('Thali Rate','thali_rate')}{field('Image URL','image_url')}{field('Image Alt','image_alt')}<label className="text-sm font-bold text-gray-700">Description<textarea className={input+' min-h-24'} value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})}/></label><label className="text-sm font-bold text-gray-700">Features (one per line)<textarea className={input+' min-h-24'} value={draft.features.join('\n')} onChange={e=>setDraft({...draft,features:e.target.value.split('\n').filter(Boolean)})}/></label><label className="text-sm font-bold text-gray-700">Dish highlights (one per line)<textarea className={input+' min-h-24'} value={draft.dish_highlights.join('\n')} onChange={e=>setDraft({...draft,dish_highlights:e.target.value.split('\n').filter(Boolean)})}/></label><label className="text-sm font-bold text-gray-700">Order<input type="number" className={input} value={draft.sort_order} onChange={e=>setDraft({...draft,sort_order:Number(e.target.value)})}/></label></div><div className="flex gap-2 mt-5"><button onClick={save} className="px-4 py-2.5 rounded-xl bg-[#124E33] text-white font-bold flex gap-2"><Save className="w-4 h-4"/>Save Banner</button><button onClick={()=>setDraft({...draft,active:!draft.active})} className={`px-4 py-2.5 rounded-xl font-bold ${draft.active?'bg-emerald-100 text-emerald-800':'bg-gray-200 text-gray-600'}`}>{draft.active?'Active':'Hidden'}</button>{editing && <button onClick={remove} className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold flex gap-2"><Trash2 className="w-4 h-4"/>Delete</button>}</div></div></div>;
}

function Menus({ cms, flash }: any) {
  const [pkg,setPkg]=useState<PackageType>('VEG CLASSIC'); const [day,setDay]=useState('Monday'); const [meal,setMeal]=useState<'lunch'|'dinner'>('lunch');
  const schedule=cms.menus[pkg]?.find((x:any)=>x.day===day); const item=schedule?(meal==='lunch'?schedule.lunch:schedule.dinner):null;
  const [draft,setDraft]=useState<any>(item||{});
  React.useEffect(()=>setDraft(item||{}),[pkg,day,meal,cms.menus]);
  const save=async()=>{const next=cms.menus[pkg].map((d:any)=>d.day!==day?d:{...d,[meal]:d[meal]?draft:d[meal]});await cms.saveMenu(pkg,next);flash('Menu saved centrally. Every client will use the new dish names.');};
  return <div className={card}><h2 className="text-xl font-black text-[#124E33] mb-4">Central Menu Editor</h2><div className="grid md:grid-cols-3 gap-3 mb-4"><select className={input} value={pkg} onChange={e=>setPkg(e.target.value as PackageType)}><option>VEG CLASSIC</option><option>EGG DELIGHT</option><option>NON-VEG CLUB</option></select><select className={input} value={day} onChange={e=>setDay(e.target.value)}>{['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d=><option key={d}>{d}</option>)}</select><select className={input} value={meal} onChange={e=>setMeal(e.target.value as any)}><option value="lunch">Lunch</option><option value="dinner">Dinner</option></select></div><div className="grid md:grid-cols-2 gap-4">{['dal','dryVeg','gravyOrNonVeg','rice','foilPacked','extras'].map(k=><label className="text-sm font-bold text-gray-700" key={k}>{k}<input className={input} value={draft[k]||''} onChange={e=>setDraft({...draft,[k]:e.target.value})}/></label>)}</div><button onClick={save} className="mt-5 px-4 py-2.5 rounded-xl bg-[#124E33] text-white font-bold flex gap-2"><Save className="w-4 h-4"/>Save Menu</button></div>;
}

function Pricing({ cms, flash }: any) { const [p,setP]=useState(cms.pricing); React.useEffect(()=>setP(cms.pricing),[cms.pricing]); const save=async()=>{await cms.updatePricing(p);flash('Pricing updated everywhere');}; return <div className={card}><h2 className="text-xl font-black text-[#124E33] mb-4">Pricing & Packages</h2><div className="grid md:grid-cols-3 gap-4">{Object.entries(p).map(([k,v])=><label key={k} className="text-sm font-bold text-gray-700">{k}<input type="number" className={input} value={v as number} onChange={e=>setP({...p,[k]:Number(e.target.value)})}/></label>)}</div><button onClick={save} className="mt-5 px-4 py-2.5 rounded-xl bg-[#124E33] text-white font-bold flex gap-2"><Save className="w-4 h-4"/>Save Pricing</button></div>; }

function Registration({ cms, flash }: any) { const [fields,setFields]=useState(cms.registrationFields); const [newField,setNewField]=useState<RegistrationFieldConfig>({id:'',label:'New Field',field_key:'new_field',field_type:'text',required:false,active:true,sort_order:fields.length+1,placeholder:'',options:[]}); React.useEffect(()=>setFields(cms.registrationFields),[cms.registrationFields]); const save=async(f:RegistrationFieldConfig)=>{await cms.saveRegistrationField(f);flash('Registration form updated');}; return <div className="space-y-4"><div className={card}><h2 className="text-xl font-black text-[#124E33]">Registration Form Designer</h2><p className="text-sm text-gray-500 mt-1">Add, rename, reorder, make required/optional, or disable fields without rebuilding the app.</p><div className="space-y-3 mt-4">{fields.map(f=><div key={f.id} className="grid md:grid-cols-[1fr_1fr_140px_90px_90px] gap-2 items-center p-3 rounded-xl bg-gray-50"><input className={input} value={f.label} onChange={e=>setFields(fields.map(x=>x.id===f.id?{...x,label:e.target.value}:x))}/><input className={input} value={f.placeholder} onChange={e=>setFields(fields.map(x=>x.id===f.id?{...x,placeholder:e.target.value}:x))}/><select className={input} value={f.field_type} onChange={e=>setFields(fields.map(x=>x.id===f.id?{...x,field_type:e.target.value as any}:x))}><option>text</option><option>tel</option><option>email</option><option>date</option><option>select</option><option>textarea</option><option>number</option><option>checkbox</option></select><button onClick={()=>save({...f,active:!f.active})} className={`rounded-xl px-2 py-2 text-xs font-bold ${f.active?'bg-emerald-100 text-emerald-800':'bg-gray-200 text-gray-600'}`}>{f.active?'Active':'Hidden'}</button><button onClick={async()=>{await cms.deleteRegistrationField(f.id);flash('Field deleted')}} className="rounded-xl bg-rose-50 text-rose-700 p-2"><Trash2 className="w-4 h-4 mx-auto"/></button><button onClick={()=>save(f)} className="md:col-span-5 justify-self-start px-3 py-2 rounded-lg bg-[#124E33] text-white text-xs font-bold">Save Field</button></div>)}</div></div><div className={card}><h3 className="font-black">Add a field</h3><div className="grid md:grid-cols-3 gap-3 mt-3"><input className={input} placeholder="Label" value={newField.label} onChange={e=>setNewField({...newField,label:e.target.value,id:e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'_'),field_key:e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'_')})}/><select className={input} value={newField.field_type} onChange={e=>setNewField({...newField,field_type:e.target.value as any})}><option>text</option><option>tel</option><option>email</option><option>select</option><option>textarea</option><option>number</option><option>checkbox</option></select><input className={input} placeholder="Placeholder" value={newField.placeholder} onChange={e=>setNewField({...newField,placeholder:e.target.value})}/></div><button onClick={async()=>{await save({...newField,sort_order:fields.length+1});setNewField({...newField,id:`field-${Date.now()}`,field_key:`field_${Date.now()}`,label:'New Field'});}} className="mt-3 px-4 py-2.5 rounded-xl bg-amber-500 font-bold flex gap-2"><Plus className="w-4 h-4"/>Add Field</button></div></div>; }

function Payments({ cms, flash }: any) { const [p,setP]=useState(cms.payment); React.useEffect(()=>setP(cms.payment),[cms.payment]); const save=async()=>{await cms.savePayment(p);flash('Payment and UPI settings saved everywhere');}; return <div className={card}><h2 className="text-xl font-black text-[#124E33] mb-4">Payment / UPI / QR Manager</h2><div className="grid md:grid-cols-2 gap-4">{Object.entries(p).map(([k,v])=><label key={k} className="text-sm font-bold text-gray-700">{k}<input className={input} value={String(v||'')} onChange={e=>setP({...p,[k]:e.target.value})}/></label>)}</div><button onClick={save} className="mt-5 px-4 py-2.5 rounded-xl bg-[#124E33] text-white font-bold flex gap-2"><Save className="w-4 h-4"/>Save Payment Settings</button></div>; }

function Access({ cms, selectedRole, setSelectedRole, newPanel, setNewPanel, newRole, setNewRole, flash }: any) {
  const savePerm = async (role: string, panel: string, action: string, value: boolean) => {
    const existing = cms.permissions.find((p: PermissionConfig) => p.role_id === role && p.panel_id === panel) || { role_id: role, panel_id: panel, can_read: false, can_write: false, can_add: false, can_delete: false };
    const key = { read: 'can_read', write: 'can_write', add: 'can_add', delete: 'can_delete' }[action] as keyof PermissionConfig;
    await cms.savePermission({ ...existing, [key]: value });
  };

  return <div className="space-y-4">
    <div className={card}>
      <h2 className="text-xl font-black text-[#124E33]">Roles, Panels & Permissions</h2>
      <p className="text-sm text-gray-500">D-Admin can create panels and decide Read / Write / Add / Delete for every role.</p>
      <div className="grid lg:grid-cols-2 gap-6 mt-5">
        <div>
          <h3 className="font-black mb-2">Roles</h3>
          <div className="space-y-2">{cms.roles.map((r: RoleConfig) => <div key={r.id} className={`flex gap-2 items-center p-2 rounded-xl ${selectedRole === r.id ? 'bg-emerald-50' : 'bg-gray-50'}`}>
            <button onClick={() => setSelectedRole(r.id)} className="flex-1 text-left text-sm font-bold">{r.name}</button>
            <button onClick={async () => { await cms.saveRole({ ...r, active: !r.active }); flash('Role updated'); }} className="text-xs px-2 py-1 rounded-lg bg-white">{r.active ? 'Active' : 'Off'}</button>
            {r.id !== 'ceo-director' && <button onClick={async () => { if (confirm('Delete role?')) { await cms.deleteRole(r.id); flash('Role deleted'); } }} className="text-rose-600"><Trash2 className="w-4 h-4" /></button>}
          </div>)}</div>
          <div className="flex gap-2 mt-3">
            <input className={input} placeholder="New role" value={newRole.name} onChange={e => setNewRole({ ...newRole, name: e.target.value, id: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} />
            <button onClick={async () => { if (!newRole.name) return; await cms.saveRole(newRole); setNewRole({ id: '', name: '', active: true }); flash('Role added'); }} className="px-3 rounded-xl bg-amber-500"><Plus className="w-4 h-4" /></button>
          </div>
        </div>
        <div>
          <h3 className="font-black mb-2">Panels</h3>
          <div className="space-y-2 max-h-80 overflow-auto">{cms.panels.map((p: PanelConfig) => <div key={p.id} className="flex gap-2 items-center p-2 rounded-xl bg-gray-50">
            <span className="flex-1 text-sm font-bold">{p.name}</span>
            <button onClick={async () => { await cms.savePanel({ ...p, active: !p.active }); flash('Panel visibility changed'); }} className="text-xs px-2 py-1 rounded-lg bg-white">{p.active ? 'Active' : 'Off'}</button>
            {p.id !== 'dashboard' && <button onClick={async () => { if (confirm('Delete panel?')) { await cms.deletePanel(p.id); flash('Panel deleted'); } }} className="text-rose-600"><Trash2 className="w-4 h-4" /></button>}
          </div>)}</div>
          <div className="flex gap-2 mt-3">
            <input className={input} placeholder="Panel name" value={newPanel.name} onChange={e => setNewPanel({ ...newPanel, name: e.target.value, id: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} />
            <button onClick={async () => { if (!newPanel.name) return; await cms.savePanel(newPanel); setNewPanel({ id: '', name: '', sort_order: 99, active: true }); flash('Panel added'); }} className="px-3 rounded-xl bg-amber-500"><Plus className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>

    <div className={card}>
      <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-black">Permission Matrix — {cms.roles.find((r: RoleConfig) => r.id === selectedRole)?.name}</h3><span className="text-xs text-gray-500">CEO Cum Director is always full access.</span></div>
      <div className="overflow-x-auto mt-4"><table className="w-full text-xs"><thead><tr className="border-b"><th className="text-left py-2">Panel</th>{['read', 'write', 'add', 'delete'].map(x => <th key={x}>{x}</th>)}</tr></thead><tbody>{cms.panels.map((panel: PanelConfig) => { const perm = cms.permissions.find((p: PermissionConfig) => p.role_id === selectedRole && p.panel_id === panel.id); return <tr key={panel.id} className="border-b border-gray-100"><td className="py-2 font-bold">{panel.name}</td>{(['read', 'write', 'add', 'delete'] as const).map(action => { const key = { read: 'can_read', write: 'can_write', add: 'can_add', delete: 'can_delete' }[action] as keyof PermissionConfig; const checked = selectedRole === 'ceo-director' || Boolean(perm && perm[key]); return <td key={action} className="text-center"><input type="checkbox" checked={checked} disabled={selectedRole === 'ceo-director'} onChange={e => savePerm(selectedRole, panel.id, action, e.target.checked)} /></td>; })}</tr>; })}</tbody></table></div>
    </div>

    <div className={card}>
      <h3 className="font-black text-[#124E33]">Admin Accounts & Role Assignment</h3>
      <p className="text-xs text-gray-500 mt-1">Create the user in Supabase Authentication first, then enter that user's UUID and assign a role here.</p>
      <div className="grid md:grid-cols-3 gap-2 mt-4">
        <input id="admin-user-id" className={input} placeholder="Supabase Auth User UUID" />
        <input id="admin-user-email" className={input} placeholder="Email" type="email" />
        <div className="flex gap-2"><select id="admin-user-role" className={input}>{cms.roles.map((r: RoleConfig) => <option key={r.id} value={r.id}>{r.name}</option>)}</select><button onClick={async () => { const userId = (document.getElementById('admin-user-id') as HTMLInputElement).value.trim(); const email = (document.getElementById('admin-user-email') as HTMLInputElement).value.trim(); const roleId = (document.getElementById('admin-user-role') as HTMLSelectElement).value; if (!userId || !email) return alert('Enter the Auth User UUID and email.'); await cms.saveAdminUser({ user_id: userId, email, role_id: roleId, active: true }); flash('Admin account assigned'); }} className="px-3 rounded-xl bg-amber-500 font-bold"><Plus className="w-4 h-4" /></button></div>
      </div>
      <div className="space-y-2 mt-4">{cms.adminUsers.map((u: any) => <div key={u.user_id} className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-gray-50 text-sm"><span className="flex-1 font-bold">{u.email}</span><span className="px-2 py-1 rounded-lg bg-white text-xs">{cms.roles.find((r: RoleConfig) => r.id === u.role_id)?.name || u.role_id}</span><button onClick={async () => { await cms.deleteAdminUser(u.user_id); flash('Admin account removed'); }} className="text-rose-600"><Trash2 className="w-4 h-4" /></button></div>)}</div>
    </div>
  </div>;
}
