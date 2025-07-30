"use client";
import { useEffect } from "react";
import { useExpenses, Expense, ExpensePayload } from "@/app/hooks/useExpenses";
import { useState } from "react";
import { ExpensesChart, ExpensesSummary, ExpensesTrend } from "./expensesChart";

interface ExpensesSectionProps {
  projectId: string;
}

export default function ExpensesSection({ projectId }: ExpensesSectionProps) {
  const {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses(projectId);
  const [form, setForm] = useState<Partial<ExpensePayload>>({});
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editId) {
      await updateExpense(editId, form);
      setEditId(null);
    } else {
      await addExpense({ ...form, project_id: projectId } as ExpensePayload);
    }
    setForm({});
  };

  const handleEdit = (exp: Expense) => {
    setEditId(exp.id);
    setForm({
      amount: exp.amount,
      description: exp.description,
      expense_date: exp.expense_date,
      category: exp.category,
      vendor: exp.vendor,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("ยืนยันการลบรายการนี้?")) {
      await deleteExpense(id);
    }
  };

  // ฟังก์ชันแปลงค่า category เป็นภาษาไทย
  const getCategoryDisplayName = (category: string | null | undefined) => {
    if (!category) return '-';
    switch (category) {
      case 'material': return 'วัสดุ';
      case 'service': return 'บริการ';
      case 'workers': return 'แรงงาน';
      case 'utility': return 'สาธารณูปโภค';
      default: return category;
    }
  };

  return (
    <div className="p-4 border rounded bg-white mt-6 text-black">
      <h2 className="text-lg font-bold mb-2">รายการต้นทุน</h2>
      
      {/* กราฟค่าใช้จ่าย */}
      <ExpensesChart projectId={projectId} />
      
      {/* สรุปค่าใช้จ่าย */}
      <ExpensesSummary projectId={projectId} />
      
      {/* แนวโน้มค่าใช้จ่าย */}
      <ExpensesTrend projectId={projectId} />
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-4 items-end">
        <input
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="รายละเอียด"
          className="border px-2 py-1 rounded"
          required
        />
        <input
          name="amount"
          type="number"
          value={form.amount || ""}
          onChange={handleChange}
          placeholder="จำนวนเงิน"
          className="border px-2 py-1 rounded"
          required
        />
        <input
          name="expense_date"
          type="date"
          value={form.expense_date || ""}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
          required
        />
        <select
          name="category"
          value={form.category || ""}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        >
          <option value="">เลือกหมวดหมู่</option>
          <option value="material">วัสดุ (Material)</option>
          <option value="service">บริการ (Service)</option>
          <option value="workers">แรงงาน (Workers)</option>
          <option value="utility">สาธารณูปโภค (Utility)</option>
        </select>
        <input
          name="vendor"
          value={form.vendor || ""}
          onChange={handleChange}
          placeholder="ร้านค้า/ผู้ขาย"
          className="border px-2 py-1 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
          {editId ? "บันทึกการแก้ไข" : "เพิ่มรายการ"}
        </button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setForm({}); }} className="ml-2 text-gray-500 underline">
            ยกเลิก
          </button>
        )}
      </form>
      {loading && <div>กำลังโหลด...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-black">รายละเอียด</th>
            <th className="border px-2 py-1 text-black">จำนวนเงิน</th>
            <th className="border px-2 py-1 text-black">วันที่</th>
            <th className="border px-2 py-1 text-black">หมวดหมู่</th>
            <th className="border px-2 py-1 text-black">ร้านค้า/ผู้ขาย</th>
            <th className="border px-2 py-1 text-black">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td className="border px-2 py-1 text-black">{exp.description}</td>
              <td className="border px-2 py-1 text-right text-black">{Number(exp.amount).toLocaleString()}</td>
              <td className="border px-2 py-1 text-black">{exp.expense_date}</td>
              <td className="border px-2 py-1 text-black">{getCategoryDisplayName(exp.category)}</td>
              <td className="border px-2 py-1 text-black">{exp.vendor}</td>
              <td className="border px-2 py-1">
                <button onClick={() => handleEdit(exp)} className="text-blue-600 underline mr-2">แก้ไข</button>
                <button onClick={() => handleDelete(exp.id)} className="text-red-600 underline">ลบ</button>
              </td>
            </tr>
          ))}
          {expenses.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-gray-400 py-2">ไม่มีข้อมูล</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 