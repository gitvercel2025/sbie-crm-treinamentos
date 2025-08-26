import { useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  Search,
  Users,
  BarChart3,
  Upload,
  Download,
  Settings,
  Home,
  BookOpen,
  GraduationCap,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  selectedTraining?: string;
  onTrainingSelect?: (training: string) => void;
}

interface NavigationItem {
  name: string;
  icon: any;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Alunos", icon: Users, href: "/students" },
  { name: "Treinamentos", icon: BookOpen, href: "/trainings" },
  { name: "Relatórios", icon: BarChart3, href: "/reports" },
  { name: "Configurações", icon: Settings, href: "/settings" },
];

const trainingItems = [
  "ASBIE",
  "Comunidade Portal",
  "Conexão 2020",
  "Desperte o seu talento",
  "Embaixadores do Bem",
  "Formação em Inteligência Emocional",
  "Formação Master em Inteligência Emocional",
  "Imersão Inside",
  "Inteligência Emocional Online",
  "Liberdade Financeira",
  "Lotus Inteligência Emocional",
  "Lotus Legado",
  "Origens Inteligência Emocional",
  "Reencontro IE para Casais",
  "SBIE Care",
  "Sócio SBIE",
  "Superação Emocional",
  "Workshop Mulheres",
];

export default function DashboardLayout({
  children,
  selectedTraining = "all",
  onTrainingSelect
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-sbie-beige-light/20">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col bg-sbie-green-dark text-white">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 bg-sbie-green-dark/90">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-sbie-beige-light" />
              <span className="text-xl font-bold text-sbie-beige-light">SBIE CRM</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-sbie-green-olive"
              onClick={() => setSidebarOpen(false)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sbie-green-gray" />
              <Input
                placeholder="Buscar alunos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-sbie-green-olive/50 border-sbie-green-olive text-white placeholder:text-sbie-green-gray focus:border-sbie-beige-light"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 pb-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => navigate(item.href)}
                    className={cn(
                      "w-full justify-start text-left font-medium",
                      isActive
                        ? "bg-sbie-brown text-white hover:bg-sbie-brown/80"
                        : "text-sbie-beige-light hover:bg-sbie-green-olive hover:text-white"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Button>
                );
              })}
            </div>

            {/* Trainings Section */}
            <div className="mt-8">
              <h3 className="px-3 text-sm font-semibold text-sbie-green-gray uppercase tracking-wider mb-4">
                Treinamentos
              </h3>
              <div className="space-y-1 max-h-72 overflow-y-auto scrollbar-thin scrollbar-track-sbie-green-dark scrollbar-thumb-sbie-green-olive hover:scrollbar-thumb-sbie-brown">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTrainingSelect?.("all")}
                  className={`w-full justify-start text-left text-sm p-3 rounded-lg transition-all duration-200 group ${
                    selectedTraining === "all"
                      ? "bg-sbie-brown text-white"
                      : "text-sbie-beige-light/90 hover:bg-sbie-green-olive hover:text-white"
                  }`}
                >
                  <BookOpen className="mr-3 h-4 w-4 flex-shrink-0 group-hover:text-sbie-beige-light" />
                  <span className="truncate font-medium">Todos os Treinamentos</span>
                </Button>
                {trainingItems.map((training) => (
                  <Button
                    key={training}
                    variant="ghost"
                    size="sm"
                    onClick={() => onTrainingSelect?.(training)}
                    className={`w-full justify-start text-left text-sm p-3 rounded-lg transition-all duration-200 group ${
                      selectedTraining === training
                        ? "bg-sbie-brown text-white"
                        : "text-sbie-beige-light/90 hover:bg-sbie-green-olive hover:text-white"
                    }`}
                  >
                    <BookOpen className="mr-3 h-4 w-4 flex-shrink-0 group-hover:text-sbie-beige-light" />
                    <span className="truncate font-medium">{training}</span>
                  </Button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Header bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-sbie-green-olive/20 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sbie-green-gray" />
              <Input
                placeholder="Buscar em todos os dados..."
                className="pl-10 w-full max-w-lg border-sbie-green-olive/30 focus:border-sbie-brown"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button size="sm" className="bg-sbie-brown hover:bg-sbie-brown/80">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button size="sm" variant="outline" className="border-sbie-brown text-sbie-brown hover:bg-sbie-brown hover:text-white">
                <Upload className="mr-2 h-4 w-4" />
                Importar
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
