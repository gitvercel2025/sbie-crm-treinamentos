import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MessageCircle, Edit, Trash2, Filter } from "lucide-react";

export interface Student {
  id: string;
  nome: string;
  celular: string;
  email: string;
  treinamento: string;
}

interface StudentsTableProps {
  students: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (id: string) => void;
  onWhatsApp?: (student: Student) => void;
}

export default function StudentsTable({ 
  students, 
  onEdit, 
  onDelete, 
  onWhatsApp 
}: StudentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTraining, setFilterTraining] = useState<string>("all");

  // Get unique trainings for filter
  const uniqueTrainings = Array.from(new Set(students.map(s => s.treinamento)));

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.celular.includes(searchTerm);
    
    const matchesTraining = filterTraining === "all" || student.treinamento === filterTraining;
    
    return matchesSearch && matchesTraining;
  });

  const handleWhatsApp = (student: Student) => {
    const phone = student.celular.replace(/\D/g, '');
    const message = `Olá ${student.nome}, tudo bem?`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onWhatsApp?.(student);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-bold text-sbie-green-dark">
            Lista de Alunos
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sbie-green-gray" />
              <Input
                placeholder="Buscar alunos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 border-sbie-green-olive/30"
              />
            </div>
            
            <Select value={filterTraining} onValueChange={setFilterTraining}>
              <SelectTrigger className="w-full sm:w-48 border-sbie-green-olive/30">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por treinamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os treinamentos</SelectItem>
                {uniqueTrainings.map((training) => (
                  <SelectItem key={training} value={training}>
                    {training}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-lg border border-sbie-green-olive/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-sbie-beige-light/50">
                <TableHead className="text-sbie-green-dark font-semibold">Nome</TableHead>
                <TableHead className="text-sbie-green-dark font-semibold">Celular</TableHead>
                <TableHead className="text-sbie-green-dark font-semibold">Email</TableHead>
                <TableHead className="text-sbie-green-dark font-semibold">Treinamento</TableHead>
                <TableHead className="text-sbie-green-dark font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-sbie-green-gray">
                    Nenhum aluno encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-sbie-beige-light/20">
                    <TableCell className="font-medium text-sbie-green-dark">
                      {student.nome}
                    </TableCell>
                    <TableCell className="text-sbie-green-olive">
                      {student.celular}
                    </TableCell>
                    <TableCell className="text-sbie-green-olive">
                      {student.email}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className="bg-sbie-brown/10 text-sbie-brown border-sbie-brown/20"
                      >
                        {student.treinamento}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWhatsApp(student)}
                          className="border-green-500 text-green-600 hover:bg-green-50"
                        >
                          <MessageCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit?.(student)}
                          className="border-sbie-brown text-sbie-brown hover:bg-sbie-brown/10"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete?.(student.id)}
                          className="border-red-500 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {filteredStudents.length > 0 && (
          <div className="mt-4 text-sm text-sbie-green-gray">
            Mostrando {filteredStudents.length} de {students.length} alunos
          </div>
        )}
      </CardContent>
    </Card>
  );
}
