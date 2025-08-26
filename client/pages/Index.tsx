import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import TrainingChart from "@/components/dashboard/TrainingChart";
import StudentsTable, { Student } from "@/components/dashboard/StudentsTable";
import CSVImportModal from "@/components/dashboard/CSVImportModal";
import EditStudentModal from "@/components/dashboard/EditStudentModal";
import DeleteConfirmDialog from "@/components/dashboard/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Users, BookOpen, TrendingUp, Award, Upload, Download } from "lucide-react";

// Start with empty student list - real data will be imported from CSV files
const initialStudents: Student[] = [];

export default function Index() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<string>("all");

  // Filter students by selected training
  const filteredStudents = selectedTraining === "all"
    ? students
    : students.filter(s => s.treinamento === selectedTraining);

  // Calculate stats
  const totalStudents = students.length;
  const filteredCount = filteredStudents.length;
  const uniqueTrainings = new Set(students.map(s => s.treinamento)).size;
  
  // Chart data
  const trainingData = students.reduce((acc, student) => {
    const training = acc.find(t => t.name === student.treinamento);
    if (training) {
      training.students += 1;
    } else {
      acc.push({ 
        name: student.treinamento.length > 20 ? 
          student.treinamento.substring(0, 20) + "..." : 
          student.treinamento, 
        students: 1 
      });
    }
    return acc;
  }, [] as { name: string; students: number }[]);

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleSaveStudent = (updatedStudent: Student) => {
    setStudents(prev =>
      prev.map(s => s.id === updatedStudent.id ? updatedStudent : s)
    );
    toast({
      title: "Aluno atualizado",
      description: `${updatedStudent.nome} foi atualizado com sucesso`,
    });
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setEditModalOpen(true);
  };

  const handleCreateStudent = (newStudent: Student) => {
    const studentWithId = {
      ...newStudent,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setStudents(prev => [...prev, studentWithId]);
    toast({
      title: "Aluno adicionado",
      description: `${newStudent.nome} foi adicionado com sucesso`,
    });
  };

  const handleDeleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) {
      setStudentToDelete(student);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDeleteStudent = () => {
    if (studentToDelete) {
      setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
      toast({
        title: "Aluno excluído",
        description: `${studentToDelete.nome} foi removido do sistema`,
      });
      setStudentToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleWhatsAppStudent = (student: Student) => {
    console.log("WhatsApp student:", student);
  };

  const handleImportCSV = (newStudents: Student[], trainingName: string) => {
    setStudents(prev => [...prev, ...newStudents]);
    toast({
      title: "Importação concluída",
      description: `${newStudents.length} alunos importados para ${trainingName}`,
    });
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["Nome", "Celular", "Email", "Treinamento"].join(","),
      ...students.map(student => [
        `"${student.nome}"`,
        `"${student.celular}"`,
        `"${student.email}"`,
        `"${student.treinamento}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `sbie-alunos-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação concluída",
      description: `${students.length} alunos exportados para CSV`,
    });
  };

  return (
    <DashboardLayout
      selectedTraining={selectedTraining}
      onTrainingSelect={setSelectedTraining}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sbie-green-dark">
              Dashboard SBIE CRM
            </h1>
            <p className="mt-2 text-sbie-green-gray">
              Gerencie os alunos da Sociedade Brasileira de Inteligência Emocional
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <Button
              onClick={handleAddStudent}
              className="bg-sbie-green-dark hover:bg-sbie-green-dark/80"
            >
              <Users className="mr-2 h-4 w-4" />
              Novo Aluno
            </Button>
            <Button
              onClick={() => setImportModalOpen(true)}
              className="bg-sbie-brown hover:bg-sbie-brown/80"
            >
              <Upload className="mr-2 h-4 w-4" />
              Importar CSV
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="border-sbie-brown text-sbie-brown hover:bg-sbie-brown hover:text-white"
              disabled={students.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Alunos"
            value={totalStudents.toLocaleString()}
            change={{ value: "+12% este mês", trend: "up" }}
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Treinamentos Ativos"
            value={uniqueTrainings}
            change={{ value: "+2 novos", trend: "up" }}
            icon={BookOpen}
            color="brown"
          />
          <StatsCard
            title="Taxa de Conversão"
            value="87.5%"
            change={{ value: "+5.2%", trend: "up" }}
            icon={TrendingUp}
            color="olive"
          />
          <StatsCard
            title="Certificados Emitidos"
            value="1,247"
            change={{ value: "45 hoje", trend: "up" }}
            icon={Award}
            color="beige"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrainingChart data={trainingData} type="bar" />
          
          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-sbie-green-dark">
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-sbie-beige-light/30">
                  <div className="w-2 h-2 rounded-full bg-sbie-brown mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-sbie-green-dark">
                      Novo aluno cadastrado
                    </p>
                    <p className="text-xs text-sbie-green-gray">
                      Ana Silva se inscreveu em "Formação em IE" • há 2 horas
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-sbie-beige-light/30">
                  <div className="w-2 h-2 rounded-full bg-sbie-green-olive mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-sbie-green-dark">
                      Certificado emitido
                    </p>
                    <p className="text-xs text-sbie-green-gray">
                      Carlos Eduardo concluiu "Lotus IE" • há 4 horas
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-sbie-beige-light/30">
                  <div className="w-2 h-2 rounded-full bg-sbie-green-dark mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-sbie-green-dark">
                      CSV importado
                    </p>
                    <p className="text-xs text-sbie-green-gray">
                      125 novos alunos de "Workshop Mulheres" • há 6 horas
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <StudentsTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onWhatsApp={handleWhatsAppStudent}
        />

        {/* CSV Import Modal */}
        <CSVImportModal
          open={importModalOpen}
          onOpenChange={setImportModalOpen}
          onImport={handleImportCSV}
        />

        {/* Edit Student Modal */}
        <EditStudentModal
          student={selectedStudent}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSave={selectedStudent ? handleSaveStudent : handleCreateStudent}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          student={studentToDelete}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDeleteStudent}
        />
      </div>
    </DashboardLayout>
  );
}
