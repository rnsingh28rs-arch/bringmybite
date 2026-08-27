import { isSupabaseConfigured, supabaseDelete, supabaseSelect, supabaseUpsert } from '../cms/supabaseRest';

export interface StaffSalaryRecord {
  id: string; name: string; role: 'admin' | 'manager' | 'chef' | 'chef-helper' | 'other'; phone: string; monthlySalary: number; paymentDay: number; status: 'Active' | 'Inactive'; notes: string; updatedAt: string;
}
const KEY = 'bmb_staff_salaries_v1';
function readLocal(): StaffSalaryRecord[] { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
function writeLocal(rows: StaffSalaryRecord[]) { localStorage.setItem(KEY, JSON.stringify(rows)); window.dispatchEvent(new Event('bmb-staff-salary-change')); }
function toDb(x: StaffSalaryRecord) { return { id:x.id, name:x.name, role:x.role, phone:x.phone, monthly_salary:x.monthlySalary, payment_day:x.paymentDay, status:x.status, notes:x.notes, updated_at:x.updatedAt }; }
function fromDb(x:any): StaffSalaryRecord { return { id:x.id, name:x.name||'', role:x.role||'other', phone:x.phone||'', monthlySalary:Number(x.monthly_salary ?? x.monthlySalary ?? 0), paymentDay:Number(x.payment_day ?? x.paymentDay ?? 1), status:x.status||'Active', notes:x.notes||'', updatedAt:x.updated_at ?? x.updatedAt ?? new Date().toISOString() }; }
export async function listStaffSalaries() { if (isSupabaseConfigured) { const rows = await supabaseSelect<any>('bmb_staff_salaries','select=*&order=name.asc'); return rows.map(fromDb); } return readLocal(); }
export async function saveStaffSalary(record: StaffSalaryRecord) { if (isSupabaseConfigured) await supabaseUpsert('bmb_staff_salaries', toDb(record)); writeLocal([record, ...readLocal().filter(x=>x.id!==record.id)]); }
export async function deleteStaffSalary(id:string) { if (isSupabaseConfigured) await supabaseDelete('bmb_staff_salaries', `id=eq.${encodeURIComponent(id)}`); writeLocal(readLocal().filter(x=>x.id!==id)); }
