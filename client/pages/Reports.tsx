import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  PieChart, 
  Download, 
  Calendar,
  TrendingUp,
  Users,
  BookOpen,
  FileText,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedTraining, setSelectedTraining] = useState("all");

  const reportCards = [
    {
      title: "Relatório de Alunos",
      description: "Lista completa de todos os alunos por treinamento",
      icon: Users,
      color: "bg-sbie-green-dark",
      action: "Gerar Relatório"
    },
    {
      title: "Relatório de Treinamentos",
      description: "Estatísticas detalhadas de cada treinamento",
      icon: BookOpen,
      color: "bg-sbie-brown",
      action: "Gerar Relatório"
    },
    {
      title: "Relatório de Performance",
      description: "Análise de performance e conclusão dos cursos",
      icon: TrendingUp,
      color: "bg-sbie-green-olive",
      action: "Gerar Relatório"
    },
    {
      title: "Relatório Financeiro",
      description: "Receitas e investimentos por treinamento",
      icon: BarChart,
      color: "bg-sbie-green-gray",
      action: "Gerar Relatório"
    }
  ];

  const quickStats = [
    {
      label: "Total de Relatórios Gerados",
      value: "47",
      change: "+12%",
      period: "este mês"
    },
    {
      label: "Última Atualização",
      value: "Hoje",
      change: "16:30",
      period: "horário"
    },
    {
      label: "Relatórios Agendados",
      value: "3",
      change: "pendentes",
      period: "esta semana"
    },
    {
      label: "Exportações",
      value: "128",
      change: "+8%",
      period: "este mês"
    }
  ];

  const recentReports = [
    {
      name: "Relatório Mensal de Alunos",
      type: "PDF",
      date: "Hoje, 14:30",
      size: "2.3 MB",
      status: "Concluído"
    },
    {
      name: "Análise de Performance Q4",
      type: "Excel",
      date: "Ontem, 16:45", 
      size: "1.8 MB",
      status: "Concluído"
    },
    {
      name: "Relatório de Certificações",
      type: "PDF",
      date: "2 dias atrás",
      size: "945 KB",
      status: "Concluído"
    },
    {
      name: "Dashboard Executivo",
      type: "PDF",
      date: "3 dias atrás",
      size: "3.2 MB",
      status: "Concluído"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sbie-green-dark">
              Relatórios e Análises
            </h1>
            <p className="mt-2 text-sbie-green-gray">
              Gere relatórios detalhados e analise o desempenho da SBIE
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 border-sbie-green-olive/30">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="quarter">Este Trimestre</SelectItem>
                <SelectItem value="year">Este Ano</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="bg-sbie-brown hover:bg-sbie-brown/80">
              <Filter className="mr-2 h-4 w-4" />
              Filtros Avançados
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-sbie-green-gray">{stat.label}</p>
                  <p className="text-2xl font-bold text-sbie-green-dark mt-2">{stat.value}</p>
                  <p className="text-xs text-sbie-green-olive mt-1">
                    {stat.change} {stat.period}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Types */}
        <div>
          <h2 className="text-xl font-bold text-sbie-green-dark mb-6">
            Tipos de Relatórios Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportCards.map((report, index) => {
              const Icon = report.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className={`p-3 rounded-lg ${report.color}/10`}>
                          <Icon className={`h-6 w-6 text-white`} style={{ color: report.color.replace('bg-', '#') }} />
                        </div>
                        <div className="ml-4">
                          <CardTitle className="text-lg font-bold text-sbie-green-dark">
                            {report.title}
                          </CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-sbie-green-gray mb-4">
                      {report.description}
                    </p>
                    
                    <div className="flex gap-2">
                      <Button 
                        className={`flex-1 ${report.color} hover:${report.color}/80 text-white`}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {report.action}
                      </Button>
                      <Button variant="outline" size="sm" className="border-sbie-green-olive/30">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Reports */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-sbie-green-dark">
                Relatórios Recentes
              </CardTitle>
              <Button variant="outline" size="sm" className="border-sbie-brown text-sbie-brown hover:bg-sbie-brown hover:text-white">
                Ver Todos
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-sbie-beige-light/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-sbie-green-dark/10">
                      <FileText className="h-5 w-5 text-sbie-green-dark" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-sbie-green-dark">{report.name}</p>
                      <p className="text-sm text-sbie-green-gray">
                        {report.type} • {report.size} • {report.date}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {report.status}
                    </span>
                    <Button variant="ghost" size="sm" className="text-sbie-brown hover:bg-sbie-brown/10">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-sbie-green-dark">
                Alunos por Treinamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-sbie-beige-light/20 rounded-lg">
                <div className="text-center">
                  <BarChart className="h-12 w-12 text-sbie-green-gray mx-auto mb-2" />
                  <p className="text-sm text-sbie-green-gray">
                    Gráfico será exibido quando houver dados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-sbie-green-dark">
                Distribuição de Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-sbie-beige-light/20 rounded-lg">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-sbie-green-gray mx-auto mb-2" />
                  <p className="text-sm text-sbie-green-gray">
                    Gráfico será exibido quando houver dados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
