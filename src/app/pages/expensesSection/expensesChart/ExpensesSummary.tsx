"use client";
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

interface ExpenseSummary {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

interface ExpensesSummaryProps {
  projectId: string;
}

export default function ExpensesSummary({ projectId }: ExpensesSummaryProps) {
  const [summaryData, setSummaryData] = useState<ExpenseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummaryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/expenses/chart-data?project_id=${projectId}&group_by=category`);
      
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลได้');
      }
      
      const data = await response.json();
      
      // คำนวณเปอร์เซ็นต์
      const totalAmount = data.statistics.totalAmount;
      const summary = data.chartData.map((item: any) => ({
        category: item.category || 'ไม่ระบุ',
        total: item.total,
        count: 0, // จะต้องดึงจาก API เพิ่มเติม
        percentage: totalAmount > 0 ? (item.total / totalAmount) * 100 : 0
      }));
      
      setSummaryData(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="p-4 border rounded bg-white mt-6 text-black">
        <div className="flex items-center justify-center h-32">
          <div className="text-lg">กำลังโหลดข้อมูลสรุป...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded bg-white mt-6 text-black">
        <div className="text-red-600 text-center">{error}</div>
        <button 
          onClick={fetchSummaryData}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  if (!summaryData.length) {
    return (
      <div className="p-4 border rounded bg-white mt-6 text-black">
        <div className="text-center text-gray-500">ไม่มีข้อมูลสำหรับแสดงสรุป</div>
      </div>
    );
  }

  // เตรียมข้อมูลสำหรับกราฟแท่งแนวนอน
  const chartData = {
    labels: summaryData.map(item => item.category),
    datasets: [
      {
        label: 'ค่าใช้จ่ายตามหมวดหมู่',
        data: summaryData.map(item => item.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const, // แสดงเป็นกราฟแท่งแนวนอน
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'สรุปค่าใช้จ่ายตามหมวดหมู่',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
              minimumFractionDigits: 0,
            }).format(value);
          },
        },
      },
    },
  };

  return (
    <div className="p-4 border rounded bg-white mt-6 text-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">สรุปค่าใช้จ่าย</h2>
        <button
          onClick={fetchSummaryData}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          รีเฟรช
        </button>
      </div>

      {/* ตารางสรุป */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3">รายละเอียดตามหมวดหมู่</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">หมวดหมู่</th>
                <th className="border border-gray-300 px-3 py-2 text-right">จำนวนเงิน</th>
                <th className="border border-gray-300 px-3 py-2 text-right">เปอร์เซ็นต์</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">{item.category}</td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {new Intl.NumberFormat('th-TH', {
                      style: 'currency',
                      currency: 'THB',
                    }).format(item.total)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {item.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* กราฟแท่งแนวนอน */}
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>

      {/* แถบแสดงเปอร์เซ็นต์ */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-3">สัดส่วนค่าใช้จ่าย</h3>
        <div className="space-y-2">
          {summaryData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm">{item.category}</div>
              <div className="flex-1 mx-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: [
                        '#ff6384',
                        '#36a2eb',
                        '#ffce56',
                        '#4bc0c0',
                        '#9966ff',
                        '#ff9f40',
                      ][index % 6],
                    }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm text-right">{item.percentage.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 