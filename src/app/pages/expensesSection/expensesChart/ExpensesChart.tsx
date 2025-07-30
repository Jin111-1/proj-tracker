"use client";
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// ลงทะเบียน components ที่จำเป็น
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartData {
  chartData: Array<{
    date?: string;
    category?: string;
    total: number;
  }>;
  statistics: {
    totalAmount: number;
    averageAmount: number;
    maxAmount: number;
    minAmount: number;
    totalCount: number;
  };
  groupBy: string;
  projectId: string | null;
}

interface ExpensesChartProps {
  projectId: string;
}

export default function ExpensesChart({ projectId }: ExpensesChartProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'doughnut'>('line');
  const [groupBy, setGroupBy] = useState<'date' | 'category'>('date');

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/expenses/chart-data?project_id=${projectId}&group_by=${groupBy}`);
      
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลได้');
      }
      
      const data = await response.json();
      setChartData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [projectId, groupBy]);

  if (loading) {
    return (
      <div className="p-4 border rounded bg-white mt-6 text-black">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">กำลังโหลดข้อมูลกราฟ...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded bg-white mt-6 text-black">
        <div className="text-red-600 text-center">{error}</div>
        <button 
          onClick={fetchChartData}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  if (!chartData || !chartData.chartData.length) {
    return (
      <div className="p-4 border rounded bg-white mt-6 text-black">
        <div className="text-center text-gray-500">ไม่มีข้อมูลสำหรับแสดงกราฟ</div>
      </div>
    );
  }

  // เตรียมข้อมูลสำหรับกราฟ
  const labels = chartData.chartData.map(item => item.date || item.category || 'ไม่ระบุ');
  const data = chartData.chartData.map(item => item.total);

  const chartConfig = {
    labels,
    datasets: [
      {
        label: groupBy === 'date' ? 'ค่าใช้จ่ายรายวัน' : 'ค่าใช้จ่ายตามหมวดหมู่',
        data,
        backgroundColor: groupBy === 'date' 
          ? 'rgba(54, 162, 235, 0.2)'
          : [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
        borderColor: groupBy === 'date' 
          ? 'rgba(54, 162, 235, 1)'
          : [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
        borderWidth: 2,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: groupBy === 'date' ? 'กราฟค่าใช้จ่ายตามวันที่' : 'กราฟค่าใช้จ่ายตามหมวดหมู่',
      },
    },
    scales: {
      y: {
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

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartConfig} options={options} />;
      case 'bar':
        return <Bar data={chartConfig} options={options} />;
      case 'doughnut':
        return (
          <Doughnut 
            data={chartConfig} 
            options={{
              ...options,
              scales: undefined, // ไม่ใช้ scales สำหรับ doughnut chart
            }} 
          />
        );
      default:
        return <Line data={chartConfig} options={options} />;
    }
  };

  return (
    <div className="p-4 border rounded bg-white mt-6 text-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">กราฟค่าใช้จ่าย</h2>
        
        <div className="flex gap-2">
          {/* เลือกประเภทการจัดกลุ่ม */}
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as 'date' | 'category')}
            className="border px-3 py-1 rounded text-sm"
          >
            <option value="date">จัดกลุ่มตามวันที่</option>
            <option value="category">จัดกลุ่มตามหมวดหมู่</option>
          </select>

          {/* เลือกประเภทกราฟ */}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'doughnut')}
            className="border px-3 py-1 rounded text-sm"
          >
            <option value="line">กราฟเส้น</option>
            <option value="bar">กราฟแท่ง</option>
            <option value="doughnut">กราฟวงกลม</option>
          </select>

          <button
            onClick={fetchChartData}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            รีเฟรช
          </button>
        </div>
      </div>

      {/* สถิติสรุป */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded border">
          <div className="text-sm text-gray-600">ยอดรวม</div>
          <div className="text-lg font-bold text-blue-600">
            {new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
            }).format(chartData.statistics.totalAmount)}
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded border">
          <div className="text-sm text-gray-600">ค่าเฉลี่ย</div>
          <div className="text-lg font-bold text-green-600">
            {new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
            }).format(chartData.statistics.averageAmount)}
          </div>
        </div>
        <div className="bg-yellow-50 p-3 rounded border">
          <div className="text-sm text-gray-600">สูงสุด</div>
          <div className="text-lg font-bold text-yellow-600">
            {new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
            }).format(chartData.statistics.maxAmount)}
          </div>
        </div>
        <div className="bg-red-50 p-3 rounded border">
          <div className="text-sm text-gray-600">ต่ำสุด</div>
          <div className="text-lg font-bold text-red-600">
            {new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
            }).format(chartData.statistics.minAmount)}
          </div>
        </div>
        <div className="bg-purple-50 p-3 rounded border">
          <div className="text-sm text-gray-600">จำนวนรายการ</div>
          <div className="text-lg font-bold text-purple-600">
            {chartData.statistics.totalCount}
          </div>
        </div>
      </div>

      {/* กราฟ */}
      <div className="h-96">
        {renderChart()}
      </div>
    </div>
  );
} 