import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Student } from "./StudentsTable";
import { Save, X } from "lucide-react";

interface EditStudentModalProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (student: Student) => void;
}

const TRAINING_OPTIONS = [
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

export default function EditStudentModal({ 
  student, 
  open, 
  onOpenChange, 
  onSave 
}: EditStudentModalProps) {
  const [formData, setFormData] = useState<Student>({
    id: "",
    nome: "",
    celular: "",
    email: "",
    treinamento: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        id: "",
        nome: "",
        celular: "",
        email: "",
        treinamento: "",
      });
    }
    setErrors({});
  }, [student, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.celular.trim()) {
      newErrors.celular = "Celular é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Email deve ter formato válido";
    }

    if (!formData.treinamento) {
      newErrors.treinamento = "Treinamento é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    // Clean and format phone number
    const cleanPhone = formData.celular.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55') ? 
      `+${cleanPhone}` : 
      cleanPhone.length === 11 ? `+55${cleanPhone}` : formData.celular;

    const updatedStudent: Student = {
      ...formData,
      nome: formData.nome.trim(),
      celular: formattedPhone,
      email: formData.email.trim().toLowerCase(),
    };

    onSave(updatedStudent);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      id: "",
      nome: "",
      celular: "",
      email: "",
      treinamento: "",
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-sbie-green-dark">
            {student ? "Editar Aluno" : "Novo Aluno"}
          </DialogTitle>
          <DialogDescription className="text-sbie-green-gray">
            {student ? "Edite as informações do aluno" : "Adicione um novo aluno ao sistema"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium text-sbie-green-dark">
              Nome Completo *
            </Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Digite o nome completo"
              className={`border-sbie-green-olive/30 ${errors.nome ? 'border-red-500' : ''}`}
            />
            {errors.nome && (
              <p className="text-xs text-red-600">{errors.nome}</p>
            )}
          </div>

          {/* Celular */}
          <div className="space-y-2">
            <Label htmlFor="celular" className="text-sm font-medium text-sbie-green-dark">
              Celular/WhatsApp *
            </Label>
            <Input
              id="celular"
              value={formData.celular}
              onChange={(e) => setFormData(prev => ({ ...prev, celular: e.target.value }))}
              placeholder="(11) 99999-9999"
              className={`border-sbie-green-olive/30 ${errors.celular ? 'border-red-500' : ''}`}
            />
            {errors.celular && (
              <p className="text-xs text-red-600">{errors.celular}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-sbie-green-dark">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="nome@email.com"
              className={`border-sbie-green-olive/30 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Treinamento */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-sbie-green-dark">
              Treinamento *
            </Label>
            <Select 
              value={formData.treinamento} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, treinamento: value }))}
            >
              <SelectTrigger className={`border-sbie-green-olive/30 ${errors.treinamento ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Selecione o treinamento" />
              </SelectTrigger>
              <SelectContent>
                {TRAINING_OPTIONS.map((training) => (
                  <SelectItem key={training} value={training}>
                    {training}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.treinamento && (
              <p className="text-xs text-red-600">{errors.treinamento}</p>
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
            {student ? "Salvar Alterações" : "Adicionar Aluno"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
