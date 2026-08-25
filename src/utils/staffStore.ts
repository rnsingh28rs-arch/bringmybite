import { isSupabaseConfigured, supabaseDelete, supabaseSelect, supabaseUpsert } from '../cms/supabaseRest';

export interface StaffSalaryRecord {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'chef' | 'chef-helper' | 'other';
  phone: string;
  monthlySalary: number;
  paymentDay: number;
  status: 'Active' | 'Inactive';
  notes: string;
  updatedAt: string;
}

const KEY = 'bmb_staff_salaries_v1';
function readLocal(): StaffSalaryRecord[] { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
function writeLocal(rows: StaffSalaryRecord[]) { localStorage.setItem(KEY, JSON.stringify(rows)); window.dispatchEvent(new Event('bmb-staff-salary-change')); }
function toDb(x: StaffSalaryRecord) { return { id:x.id, name:x.name, role:x.role, phone:x.phone, monthly_salary:x.monthlySalary, payment_day:x.paymentDay, status:x.status, notes:x.notes, updated_at:x.updatedAt }; }
function fromDb(x:any): StaffSalaryRecord { return { id:x.id, name:x.name||'', role:x.role||'other', phone:x.phone||'', monthlySalary:Number(x.monthly_salary ?? x.monthlySalary ?? 0), paymentDay:Number(x.payment_day ?? x.paymentDay ?? 1), status:x.status||'Active', notes:x.notes||'', updatedAt:x.updated_at ?? x.updatedAt ?? new Date().toISOString() }; }

export async function listStaffSalaries() {
  if (isSupabaseConfigured) {
    try { const rows = await supabaseSelect<any>('bmb_staff_salaries','select=*&order=name.asc'); if (rows.length) return rows.map(fromDb); }
    catch (e) { console.warn('Salary fetch failed; using local copy.', e); }
  }
  return readLocal();
}
export async function saveStaffSalary(record: StaffSalaryRecord) {
  const next = [record, ...readLocal().filter(x=>x.id!==record.id)]; writeLocal(next);
  if (isSupabaseConfigured) { try { await supabaseUpsert('bmb_staff_salaries', toDb(record)); } catch (e) { console.warn('Salary central save unavailable for this session; local copy kept.', e); } }
}
export async function deleteStaffSalary(id:string) {
  writeLocal(readLocal().filter(x=>x.id!==id));
  if (isSupabaseConfigured) { try { await supabaseDelete('bmb_staff_salaries', `id=eq.${encodeURIComponent(id)}`); } catch (e) { console.warn('Salary central delete unavailable for this session; local copy kept.', e); } }
}
