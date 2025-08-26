import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditTrainingModal, {
  Training,
} from "@/components/dashboard/EditTrainingModal";
import DeleteTrainingConfirmDialog from "@/components/dashboard/DeleteTrainingConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

const TRAINING_LIST = [
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

// Helper functions for localStorage
const getTrainingsFromStorage = (): Training[] => {
  try {
    const stored = localStorage.getItem("sbie-trainings");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading trainings from localStorage:", error);
  }

  // Return default trainings if no stored data
  return TRAINING_LIST.map((name, index) => ({
    id: `training-${index}`,
    name,
    description: `Curso focado em desenvolvimento de inteligência emocional através de ${name.toLowerCase()}`,
    students: Math.floor(Math.random() * 50) + 10,
    status: ["active", "inactive", "planned"][
      Math.floor(Math.random() * 3)
    ] as Training["status"],
    startDate: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    )
      .toISOString()
      .split("T")[0],
    duration: ["4 semanas", "6 semanas", "8 semanas", "12 semanas"][
      Math.floor(Math.random() * 4)
    ],
    instructor: ["Ana Silva", "Carlos Santos", "Maria Oliveira", "João Costa"][
      Math.floor(Math.random() * 4)
    ],
  }));
};

const saveTrainingsToStorage = (trainings: Training[]) => {
  try {
    localStorage.setItem("sbie-trainings", JSON.stringify(trainings));
  } catch (error) {
    console.error("Error saving trainings to localStorage:", error);
  }
};

export default function Trainings() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingTraining, setDeletingTraining] = useState<Training | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load trainings from localStorage on component mount
  useEffect(() => {
    setTrainings(getTrainingsFromStorage());
  }, []);

  // Save trainings to localStorage whenever trainings change
  useEffect(() => {
    if (trainings.length > 0) {
      saveTrainingsToStorage(trainings);
    }
  }, [trainings]);

  const getStatusColor = (status: Training["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "planned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: Training["status"]) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "planned":
        return "Planejado";
      default:
        return "Desconhecido";
    }
  };

  const activeTrainings = trainings.filter((t) => t.status === "active").length;
  const totalStudents = trainings.reduce((sum, t) => sum + t.students, 0);

  // Handler functions
  const handleEditTraining = (training: Training) => {
    setEditingTraining(training);
    setIsEditModalOpen(true);
  };

  const handleDeleteTraining = (training: Training) => {
    setDeletingTraining(training);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveTraining = (training: Training) => {
    setTrainings((prev) => {
      const existingIndex = prev.findIndex((t) => t.id === training.id);
      if (existingIndex >= 0) {
        // Update existing training
        const updated = [...prev];
        updated[existingIndex] = training;
        toast({
          title: "Treinamento atualizado",
          description: `${training.name} foi atualizado com sucesso.`,
        });
        return updated;
      } else {
        // Add new training
        toast({
          title: "Treinamento criado",
          description: `${training.name} foi criado com sucesso.`,
        });
        return [...prev, training];
      }
    });
  };

  const confirmDeleteTraining = () => {
    if (deletingTraining) {
      setTrainings((prev) => prev.filter((t) => t.id !== deletingTraining.id));
      toast({
        title: "Treinamento excluído",
        description: `${deletingTraining.name} foi excluído com sucesso.`,
        variant: "destructive",
      });
      setDeletingTraining(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleNewTraining = () => {
    setEditingTraining(null);
    setIsEditModalOpen(true);
  };

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sbie-green-dark">
              Gestão de Treinamentos
            </h1>
            <p className="mt-2 text-sbie-green-gray">
              Gerencie todos os treinamentos da SBIE
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              onClick={handleNewTraining}
              className="bg-sbie-brown hover:bg-sbie-brown/80"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Treinamento
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-sbie-green-dark/10">
                  <BookOpen className="h-6 w-6 text-sbie-green-dark" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-sbie-green-gray">
                    Total de Treinamentos
                  </p>
                  <p className="text-2xl font-bold text-sbie-green-dark">
                    {trainings.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-sbie-green-gray">
                    Treinamentos Ativos
                  </p>
                  <p className="text-2xl font-bold text-sbie-green-dark">
                    {activeTrainings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-sbie-brown/10">
                  <Users className="h-6 w-6 text-sbie-brown" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-sbie-green-gray">
                    Total de Alunos
                  </p>
                  <p className="text-2xl font-bold text-sbie-green-dark">
                    {totalStudents}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-sbie-green-olive/10">
                  <Calendar className="h-6 w-6 text-sbie-green-olive" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-sbie-green-gray">
                    Média de Alunos
                  </p>
                  <p className="text-2xl font-bold text-sbie-green-dark">
                    {Math.round(totalStudents / trainings.length)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trainings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((training) => (
            <Card
              key={training.id}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-sbie-green-dark mb-2">
                      {training.name}
                    </CardTitle>
                    <Badge
                      className={`${getStatusColor(training.status)} text-xs`}
                    >
                      {getStatusText(training.status)}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTraining(training)}
                      className="text-sbie-brown hover:bg-sbie-brown/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTraining(training)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-sbie-green-gray mb-4 line-clamp-2">
                  {training.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-sbie-green-olive">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{training.students} alunos</span>
                  </div>

                  <div className="flex items-center text-sm text-sbie-green-olive">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Início: {formatDisplayDate(training.startDate)}</span>
                  </div>

                  <div className="flex items-center text-sm text-sbie-green-olive">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Duração: {training.duration}</span>
                  </div>

                  <div className="flex items-center text-sm text-sbie-green-olive">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Instrutor: {training.instructor}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-sbie-green-olive/20">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-sbie-brown text-sbie-brown hover:bg-sbie-brown hover:text-white"
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modals */}
        <EditTrainingModal
          training={editingTraining}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSave={handleSaveTraining}
        />

        <DeleteTrainingConfirmDialog
          training={deletingTraining}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={confirmDeleteTraining}
        />
      </div>
    </DashboardLayout>
  );
}
