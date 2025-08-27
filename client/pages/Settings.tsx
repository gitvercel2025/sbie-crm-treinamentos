import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Save,
  Upload,
  Download,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { settingsService } from "@/services/dataService";

export default function Settings() {
  const [settings, setSettings] = useState(settingsService.get());

  // Load settings from localStorage on component mount
  useEffect(() => {
    setSettings(settingsService.get());
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    settingsService.save(settings);
  }, [settings]);

  const handleSave = () => {
    settingsService.save(settings);
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso",
    });
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sbie-settings.json";
    link.click();

    toast({
      title: "Configurações exportadas",
      description: "Arquivo de configurações baixado com sucesso",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sbie-green-dark">
              Configurações do Sistema
            </h1>
            <p className="mt-2 text-sbie-green-gray">
              Gerencie as configurações da plataforma SBIE
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Button
              variant="outline"
              onClick={handleExportSettings}
              className="border-sbie-green-olive text-sbie-green-olive hover:bg-sbie-green-olive hover:text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-sbie-brown hover:bg-sbie-brown/80"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Organization & User Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Organization Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-sbie-green-dark/10">
                    <User className="h-5 w-5 text-sbie-green-dark" />
                  </div>
                  <CardTitle className="ml-3 text-lg font-bold text-sbie-green-dark">
                    Configurações da Organização
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Nome da Organização</Label>
                    <Input
                      id="orgName"
                      value={settings.organizationName}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          organizationName: e.target.value,
                        }))
                      }
                      className="border-sbie-green-olive/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgEmail">Email Institucional</Label>
                    <Input
                      id="orgEmail"
                      type="email"
                      value={settings.organizationEmail}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          organizationEmail: e.target.value,
                        }))
                      }
                      className="border-sbie-green-olive/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgPhone">Telefone</Label>
                    <Input
                      id="orgPhone"
                      value={settings.organizationPhone}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          organizationPhone: e.target.value,
                        }))
                      }
                      className="border-sbie-green-olive/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgAddress">Endereço</Label>
                    <Input
                      id="orgAddress"
                      value={settings.organizationAddress}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          organizationAddress: e.target.value,
                        }))
                      }
                      className="border-sbie-green-olive/30"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-sbie-brown/10">
                    <SettingsIcon className="h-5 w-5 text-sbie-brown" />
                  </div>
                  <CardTitle className="ml-3 text-lg font-bold text-sbie-green-dark">
                    Configurações do Sistema
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, language: value }))
                      }
                    >
                      <SelectTrigger className="border-sbie-green-olive/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">
                          Português (Brasil)
                        </SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español (España)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, timezone: value }))
                      }
                    >
                      <SelectTrigger className="border-sbie-green-olive/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">
                          São Paulo (GMT-3)
                        </SelectItem>
                        <SelectItem value="America/New_York">
                          New York (GMT-5)
                        </SelectItem>
                        <SelectItem value="Europe/London">
                          London (GMT+0)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Formato de Data</Label>
                    <Select
                      value={settings.dateFormat}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, dateFormat: value }))
                      }
                    >
                      <SelectTrigger className="border-sbie-green-olive/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Moeda</Label>
                    <Select
                      value={settings.currency}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, currency: value }))
                      }
                    >
                      <SelectTrigger className="border-sbie-green-olive/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="USD">Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-red-100">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <CardTitle className="ml-3 text-lg font-bold text-sbie-green-dark">
                    Configurações de Segurança
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">
                      Autenticação de Dois Fatores
                    </Label>
                    <p className="text-sm text-sbie-green-gray">
                      Adicione uma camada extra de segurança
                    </p>
                  </div>
                  <Switch
                    id="twoFactor"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        twoFactorAuth: checked,
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">
                      Timeout de Sessão (minutos)
                    </Label>
                    <Input
                      id="sessionTimeout"
                      value={settings.sessionTimeout}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          sessionTimeout: e.target.value,
                        }))
                      }
                      className="border-sbie-green-olive/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">
                      Expiração de Senha (dias)
                    </Label>
                    <Input
                      id="passwordExpiry"
                      value={settings.passwordExpiry}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          passwordExpiry: e.target.value,
                        }))
                      }
                      className="border-sbie-green-olive/30"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Notifications & Appearance */}
          <div className="space-y-6">
            {/* Notification Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="ml-3 text-lg font-bold text-sbie-green-dark">
                    Notificações
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotif">Email</Label>
                    <p className="text-xs text-sbie-green-gray">
                      Receber por email
                    </p>
                  </div>
                  <Switch
                    id="emailNotif"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        emailNotifications: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotif">SMS</Label>
                    <p className="text-xs text-sbie-green-gray">
                      Receber por SMS
                    </p>
                  </div>
                  <Switch
                    id="smsNotif"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        smsNotifications: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reportNotif">Relatórios</Label>
                    <p className="text-xs text-sbie-green-gray">
                      Novos relatórios
                    </p>
                  </div>
                  <Switch
                    id="reportNotif"
                    checked={settings.reportNotifications}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        reportNotifications: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="studentNotif">Alunos</Label>
                    <p className="text-xs text-sbie-green-gray">Novos alunos</p>
                  </div>
                  <Switch
                    id="studentNotif"
                    checked={settings.studentNotifications}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        studentNotifications: checked,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Palette className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="ml-3 text-lg font-bold text-sbie-green-dark">
                    Aparência
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) =>
                      setSettings((prev) => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger className="border-sbie-green-olive/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact">Modo Compacto</Label>
                    <p className="text-xs text-sbie-green-gray">
                      Interface reduzida
                    </p>
                  </div>
                  <Switch
                    id="compact"
                    checked={settings.compactMode}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, compactMode: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sidebar">Sidebar Colapsada</Label>
                    <p className="text-xs text-sbie-green-gray">
                      Iniciar colapsada
                    </p>
                  </div>
                  <Switch
                    id="sidebar"
                    checked={settings.sidebarCollapsed}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        sidebarCollapsed: checked,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Database className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="ml-3 text-lg font-bold text-sbie-green-dark">
                    Dados
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-sbie-green-olive text-sbie-green-olive hover:bg-sbie-green-olive hover:text-white"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Backup dos Dados
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-sbie-brown text-sbie-brown hover:bg-sbie-brown hover:text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Dados
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-red-500 text-red-600 hover:bg-red-50"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Limpar Cache
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
