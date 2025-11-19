import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

// Component hiển thị một câu hỏi
export default function QuestionResult({ questionStat, COLORS }: any) {
  // Lọc bỏ null, undefined, chuỗi rỗng
  const cleanedAnswers = questionStat.rawAnswers.filter(
    (a: any) => a !== null && a !== "" && a !== undefined
  );

  // Nếu không còn câu trả lời hợp lệ → không render
  if (cleanedAnswers.length === 0) return null;

  // Đếm lượt trả lời
  const answerCounts = cleanedAnswers.reduce(
    (acc: Record<string, number>, answer: string) => {
      acc[answer] = (acc[answer] || 0) + 1;
      return acc;
    },
    {}
  );

  // Filter out data points with counts less than 1
  const filteredData = Object.entries(answerCounts)
    .filter(([_, count]) => typeof count === "number" && count >= 1) // Ensure count is a number and >= 1
    .map(([label, count]) => ({
      x: label, // Y-axis: Câu trả lời
      y: count as number, // Explicitly cast count to number
    }));

  const data = {
    series: [
      {
        data: filteredData,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          barHeight: "35%",
          barPadding: 0,
          barGap: "-10%",
        },
        grid: {
          show: false,
        },
      },
      colors: COLORS,
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toString();
        },
      },
      xaxis: {
        tickAmount: Math.max(...filteredData.map((item) => item.y)), // Ensure whole numbers
        labels: {
          formatter: function (val: number) {
            return Math.floor(val).toString(); // Display whole numbers only
          },
        },
      },
      yaxis: {},
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val.toString();
          },
        },
      },
    } as ApexOptions, // Explicitly cast to ApexOptions
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {questionStat.questionText}
      </h3>

      <Chart
        options={data.options}
        series={data.series}
        type="bar"
        height={350}
      />
    </div>
  );
}
