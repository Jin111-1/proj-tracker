"use client";
import { useEffect } from "react";
import { useExpenses } from "@/app/hooks/useExpenses";
import { useCategories } from "@/app/hooks/useCategories";
import { useState } from "react";

interface ExpensesSectionProps {
  projectId: string;
}

export default function ExpensesSection({ projectId }: ExpensesSectionProps) {
  const {
    expenses,
    total,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    fetchChartData,
  } = useExpenses(projectId);
  const { categories, fetchCategories } = useCategories();

  const [form, setForm] = useState<any>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartGroup, setChartGroup] = useState<'date' | 'category'>('date');

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [fetchExpenses, fetchCategories]);

  useEffect(() => {
    fetchChartData(chartGroup).then((res) => setChartData(res.chartData || []));
  }, [fetchChartData, chartGroup, expenses]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (editId) {
      await updateExpense(editId, form);
      setEditId(null);
    } else {
      await addExpense({ ...form, project_id: projectId });
    }
    setForm({});
  };

  const handleEdit = (exp: any) => {
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

  return (
    <div className="p-4 border rounded bg-white mt-6">
      <h2 className="text-lg font-bold mb-2">รายการต้นทุน</h2>
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
          {categories.map((cat: any) => (
            <option key={cat.value} value={cat.value}>{cat.name}</option>
          ))}
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
              <td className="border px-2 py-1 text-black">{exp.category}</td>
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
      <div className="mb-4 font-bold">ยอดรวมต้นทุน: <span className="text-blue-700">{total.toLocaleString()} บาท</span></div>
      <div className="mb-2 flex gap-2 items-center">
        <span>กราฟ:</span>
        <button
          className={`px-2 py-1 rounded ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setChartType('bar')}
        >Bar</button>
        <button
          className={`px-2 py-1 rounded ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setChartType('line')}
        >Line</button>
        <select
          value={chartGroup}
          onChange={e => setChartGroup(e.target.value as 'date' | 'category')}
          className="border px-2 py-1 rounded"
        >
          <option value="date">ตามวันที่</option>
          <option value="category">ตามหมวดหมู่</option>
        </select>
      </div>
      {/* กราฟ (placeholder) */}
      <div className="border rounded bg-gray-50 p-4 min-h-[200px]">
        <pre className="text-xs text-gray-600">{JSON.stringify(chartData, null, 2)}</pre>
        {/* TODO: นำ library กราฟ เช่น Recharts มาแสดงจริง */}
      </div>
    </div>
  );
} 