import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface ChartData {
  name: string;
  students: number;
  color?: string;
}

interface TrainingChartProps {
  data: ChartData[];
  type?: "bar" | "pie";
}

const SBIE_COLORS = [
  "#B66D38", // brown
  "#21302B", // dark green
  "#4F5948", // olive green
  "#889073", // gray green
  "#DFC6AA", // beige
  "#B66D38", // brown (repeat)
];

export default function TrainingChart({ data, type = "bar" }: TrainingChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || SBIE_COLORS[index % SBIE_COLORS.length],
  }));

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-sbie-green-dark">
          Distribuição por Treinamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {type === "bar" ? (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#889073" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="#4F5948"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#4F5948" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#21302B",
                    border: "none",
                    borderRadius: "8px",
                    color: "#DFC6AA",
                  }}
                />
                <Bar 
                  dataKey="students" 
                  fill="#B66D38"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="students"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#21302B",
                    border: "none",
                    borderRadius: "8px",
                    color: "#DFC6AA",
                  }}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
