"use client";
import { useEffect, useState, useCallback } from 'react';
import { Line } from 'react-chartjs-2';

interface TrendData {
  date: string;
  total: number;
  cumulative: number;
}

interface ChartDataItem {
  date: string;
  total: number;
}

interface ExpensesTrendProps {
  projectId: string;
}

export default function ExpensesTrend({ projectId }: ExpensesTrendProps) {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCumulative, setShowCumulative] = useState(false);

  const fetchTrendData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/expenses/chart-data?project_id=${projectId}&group_by=date`);
      
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลได้');
      }
      
      const data = await response.json();
      
      // คำนวณค่า cumulative
      let cumulative = 0;
      const trend = data.chartData.map((item: ChartDataItem) => {
        cumulative += item.total;
        return {
          date: item.date,
          total: item.total,
          cumulative: cumulative
        };
      });
      
      setTrendData(trend);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTrendData();
  }, [projectId, fetchTrendData]);

  if (loading) {
    return (
      <div className="p-4 border rounded bg-white mt-6 text-black">
        <div className="flex items-center justify-center h-32">
          <div className="text-lg">กำลังโหลดข้อมูลแนวโน้ม...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded bg-white mt-6 text-black">
        <div className="text-red-600 text-center">{error}</div>
        <button 
          onClick={fetchTrendData}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  if (!trendData.length) {
    return (
      <div className="p-4 border rounded bg-white mt-6 text-black">
        <div className="text-center text-gray-500">ไม่มีข้อมูลสำหรับแสดงแนวโน้ม</div>
      </div>
    );
  }

  // เตรียมข้อมูลสำหรับกราฟ
  const labels = trendData.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('th-TH', { 
      month: 'short', 
      day: 'numeric' 
    });
  });

  const dailyData = trendData.map(item => item.total);
  const cumulativeData = trendData.map(item => item.cumulative);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'ค่าใช้จ่ายรายวัน',
        data: dailyData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        tension: 0.1,
        fill: false,
        yAxisID: 'y',
      },
      ...(showCumulative ? [{
        label: 'ค่าใช้จ่ายสะสม',
        data: cumulativeData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        tension: 0.1,
        fill: false,
        yAxisID: 'y1',
      }] : []),
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'แนวโน้มค่าใช้จ่ายตามเวลา',
      },
      tooltip: {
        callbacks: {
          label: function(context: { dataset: { label?: string }; parsed: { y: number } }) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
            }).format(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'วันที่',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'ค่าใช้จ่ายรายวัน (บาท)',
        },
        ticks: {
          callback: function(value: number | string) {
            return new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
              minimumFractionDigits: 0,
            }).format(Number(value));
          },
        },
      },
      y1: {
        type: 'linear' as const,
        display: showCumulative,
        position: 'right' as const,
        title: {
          display: true,
          text: 'ค่าใช้จ่ายสะสม (บาท)',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: number | string) {
            return new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
              minimumFractionDigits: 0,
            }).format(Number(value));
          },
        },
      },
    },
  };

  // คำนวณสถิติแนวโน้ม
  const totalExpenses = trendData.reduce((sum, item) => sum + item.total, 0);
  const averageDaily = totalExpenses / trendData.length;
  const maxDaily = Math.max(...dailyData);
  const minDaily = Math.min(...dailyData);
  const growthRate = trendData.length > 1 
    ? ((trendData[trendData.length - 1].total - trendData[0].total) / trendData[0].total) * 100 
    : 0;

  return (
    <div className="p-4 border rounded bg-white mt-6 text-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">แนวโน้มค่าใช้จ่าย</h2>
        
        <div className="flex gap-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showCumulative}
              onChange={(e) => setShowCumulative(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">แสดงค่าใช้จ่ายสะสม</span>
          </label>
          
          <button
            onClick={fetchTrendData}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            รีเฟรช
          </button>
        </div>
      </div>

      {/* สถิติแนวโน้ม */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded border">
          <div className="text-sm text-gray-600">ค่าใช้จ่ายรวม</div>
          <div className="text-lg font-bold text-blue-600">
            {new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
            }).format(totalExpenses)}
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded border">
          <div className="text-sm text-gray-600">ค่าเฉลี่ยรายวัน</div>
          <div className="text-lg font-bold text-green-600">
            {new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
            }).format(averageDaily)}
          </div>
        </div>
        <div className="bg-yellow-50 p-3 rounded border">
          <div className="text-sm text-gray-600">สูงสุดรายวัน</div>
          <div className="text-lg font-bold text-yellow-600">
            {new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
            }).format(maxDaily)}
          </div>
        </div>
        <div className="bg-red-50 p-3 rounded border">
          <div className="text-sm text-gray-600">ต่ำสุดรายวัน</div>
          <div className="text-lg font-bold text-red-600">
            {new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
            }).format(minDaily)}
          </div>
        </div>
        <div className="bg-purple-50 p-3 rounded border">
          <div className="text-sm text-gray-600">อัตราการเติบโต</div>
          <div className={`text-lg font-bold ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* กราฟแนวโน้ม */}
      <div className="h-96">
        <Line data={chartData} options={options} />
      </div>

      {/* ตารางข้อมูลรายวัน */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-3">ข้อมูลรายวัน</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">วันที่</th>
                <th className="border border-gray-300 px-3 py-2 text-right">ค่าใช้จ่ายรายวัน</th>
                <th className="border border-gray-300 px-3 py-2 text-right">ค่าใช้จ่ายสะสม</th>
              </tr>
            </thead>
            <tbody>
              {trendData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">
                    {new Date(item.date).toLocaleDateString('th-TH')}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {new Intl.NumberFormat('th-TH', {
                      style: 'currency',
                      currency: 'THB',
                    }).format(item.total)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {new Intl.NumberFormat('th-TH', {
                      style: 'currency',
                      currency: 'THB',
                    }).format(item.cumulative)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 