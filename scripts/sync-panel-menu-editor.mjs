import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('src/components/panels/DAdminDesigner.tsx');
let source = fs.readFileSync(file, 'utf8');

const importLine = "import { CURRENT_EGG_DELIGHT_MENU, CURRENT_NON_VEG_CLUB_MENU, CURRENT_VEG_CLASSIC_MENU } from '../../data/currentPackageMenus';";
if (!source.includes(importLine)) {
  source = source.replace(
    "import { PackageType } from '../../types';",
    `import { PackageType } from '../../types';\n${importLine}`
  );
}

const start = source.indexOf('function Menus({ cms, flash }: any) {');
const end = source.indexOf('function Registration({ cms, flash }: any)', start);
if (start < 0 || end < 0) throw new Error('Panel menu editor markers were not found');

const replacement = `function Menus({ cms, flash }: any) {
  const [pkg,setPkg]=useState<PackageType>('VEG CLASSIC');
  const [day,setDay]=useState('Monday');
  const [meal,setMeal]=useState<'lunch'|'dinner'>('lunch');
  const dinnerOnly = pkg === 'EGG DELIGHT' || pkg === 'NON-VEG CLUB';
  const selectedMeal = dinnerOnly ? 'dinner' : meal;
  const schedule=cms.menus[pkg]?.find((x:any)=>x.day===day);
  const item=schedule?(selectedMeal==='lunch'?schedule.lunch:schedule.dinner):null;
  const [draft,setDraft]=useState<any>(item||{});
  React.useEffect(()=>{
    if(dinnerOnly && meal!=='dinner') setMeal('dinner');
    setDraft(item||{});
  },[pkg,day,selectedMeal,cms.menus]);
  const save=async()=>{
    const current=cms.menus[pkg]||[];
    const next=current.map((d:any)=>d.day!==day?d:{...d,[selectedMeal]:draft});
    await cms.saveMenu(pkg,next);
    flash('Menu saved centrally. Every client will use the updated menu.');
  };
  return <div className={card}>
    <h2 className="text-xl font-black text-[#124E33] mb-2">Central Menu Editor</h2>
    <p className="text-sm text-gray-500 mb-4">Edit the live weekly menu here. Changes are saved to the central CMS and remain editable.</p>
    <div className="grid md:grid-cols-3 gap-3 mb-4">
      <select className={input} value={pkg} onChange={e=>setPkg(e.target.value as PackageType)}>
        <option>VEG CLASSIC</option><option>EGG DELIGHT</option><option>NON-VEG CLUB</option>
      </select>
      <select className={input} value={day} onChange={e=>setDay(e.target.value)}>
        {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d=><option key={d}>{d}</option>)}
      </select>
      <select className={input} value={selectedMeal} onChange={e=>setMeal(e.target.value as any)} disabled={dinnerOnly}>
        {!dinnerOnly && <option value="lunch">Lunch</option>}
        <option value="dinner">Dinner</option>
      </select>
    </div>
    {item ? <>
      <div className="grid md:grid-cols-2 gap-4">
        {[['dal','Dal'],['dryVeg','Bhujia / Sabzi'],['gravyOrNonVeg','Main Dish'],['rice','Rice'],['foilPacked','Roti'],['extras','Sides']].map(([key,label])=><label className="text-sm font-bold text-gray-700" key={key}>{label}<input className={input} value={draft[key]||''} onChange={e=>setDraft({...draft,[key]:e.target.value})}/></label>)}
      </div>
      <button onClick={save} className="mt-5 px-4 py-2.5 rounded-xl bg-[#124E33] text-white font-bold flex gap-2"><Save className="w-4 h-4"/>Save Menu</button>
    </> : <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 p-4 text-sm font-semibold">This meal is closed/unavailable for the selected package and cannot be edited.</div>}
  </div>;
}

`;

source = source.slice(0, start) + replacement + source.slice(end);
fs.writeFileSync(file, source);
console.log('panel menu editor sync: centralized, editable menu editor applied');
