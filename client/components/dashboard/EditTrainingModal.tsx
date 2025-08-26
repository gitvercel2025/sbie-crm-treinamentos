import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X } from "lucide-react";

export interface Training {
  id: string;
  name: string;
  description: string;
  students: number;
  status: "active" | "inactive" | "planned";
  startDate: string;
  duration: string;
  instructor: string;
}

interface EditTrainingModalProps {
  training: Training | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (training: Training) => void;
}

const INSTRUCTOR_OPTIONS = [
  "Ana Silva",
  "Carlos Santos",
  "Maria Oliveira",
  "João Costa",
  "Patricia Lima",
  "Roberto Ferreira",
];

const DURATION_OPTIONS = [
  "4 semanas",
  "6 semanas",
  "8 semanas",
  "12 semanas",
  "16 semanas",
];

export default function EditTrainingModal({
  training,
  open,
  onOpenChange,
  onSave,
}: EditTrainingModalProps) {
  const [formData, setFormData] = useState<Training>({
    id: "",
    name: "",
    description: "",
    students: 0,
    status: "planned",
    startDate: "",
    duration: "",
    instructor: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (training) {
      setFormData(training);
    } else {
      setFormData({
        id: crypto.randomUUID(),
        name: "",
        description: "",
        students: 0,
        status: "planned",
        startDate: "",
        duration: "",
        instructor: "",
      });
    }
    setErrors({});
  }, [training, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Data de início é obrigatória";
    }

    if (!formData.duration) {
      newErrors.duration = "Duração é obrigatória";
    }

    if (!formData.instructor) {
      newErrors.instructor = "Instrutor é obrigatório";
    }

    if (formData.students < 0) {
      newErrors.students = "Número de alunos deve ser positivo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updatedTraining: Training = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    onSave(updatedTraining);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      students: 0,
      status: "planned",
      startDate: "",
      duration: "",
      instructor: "",
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-sbie-green-dark">
            {training ? "Editar Treinamento" : "Novo Treinamento"}
          </DialogTitle>
          <DialogDescription className="text-sbie-green-gray">
            {training
              ? "Edite as informações do treinamento"
              : "Adicione um novo treinamento ao sistema"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-sbie-green-dark"
            >
              Nome do Treinamento *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Digite o nome do treinamento"
              className={`border-sbie-green-olive/30 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-sbie-green-dark"
            >
              Descrição *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Descreva o treinamento..."
              className={`border-sbie-green-olive/30 min-h-[80px] ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && (
              <p className="text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-sbie-green-dark">
                Status *
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive" | "planned") =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="border-sbie-green-olive/30">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planejado</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Número de Alunos */}
            <div className="space-y-2">
              <Label
                htmlFor="students"
                className="text-sm font-medium text-sbie-green-dark"
              >
                Número de Alunos
              </Label>
              <Input
                id="students"
                type="number"
                min="0"
                value={formData.students}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    students: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="0"
                className={`border-sbie-green-olive/30 ${errors.students ? "border-red-500" : ""}`}
              />
              {errors.students && (
                <p className="text-xs text-red-600">{errors.students}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Data de Início */}
            <div className="space-y-2">
              <Label
                htmlFor="startDate"
                className="text-sm font-medium text-sbie-green-dark"
              >
                Data de Início *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className={`border-sbie-green-olive/30 ${errors.startDate ? "border-red-500" : ""}`}
              />
              {errors.startDate && (
                <p className="text-xs text-red-600">{errors.startDate}</p>
              )}
            </div>

            {/* Duração */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-sbie-green-dark">
                Duração *
              </Label>
              <Select
                value={formData.duration}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, duration: value }))
                }
              >
                <SelectTrigger
                  className={`border-sbie-green-olive/30 ${errors.duration ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.duration && (
                <p className="text-xs text-red-600">{errors.duration}</p>
              )}
            </div>
          </div>

          {/* Instrutor */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-sbie-green-dark">
              Instrutor *
            </Label>
            <Select
              value={formData.instructor}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, instructor: value }))
              }
            >
              <SelectTrigger
                className={`border-sbie-green-olive/30 ${errors.instructor ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Selecione o instrutor" />
              </SelectTrigger>
              <SelectContent>
                {INSTRUCTOR_OPTIONS.map((instructor) => (
                  <SelectItem key={instructor} value={instructor}>
                    {instructor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.instructor && (
              <p className="text-xs text-red-600">{errors.instructor}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-sbie-brown hover:bg-sbie-brown/80"
          >
            <Save className="mr-2 h-4 w-4" />
            {training ? "Salvar Alterações" : "Adicionar Treinamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
