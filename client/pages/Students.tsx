import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentsTable, { Student } from "@/components/dashboard/StudentsTable";
import EditStudentModal from "@/components/dashboard/EditStudentModal";
import DeleteConfirmDialog from "@/components/dashboard/DeleteConfirmDialog";
import CSVImportModal from "@/components/dashboard/CSVImportModal";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Users, Upload, Download, Plus } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleSaveStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)),
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
    setStudents((prev) => [...prev, studentWithId]);
    toast({
      title: "Aluno adicionado",
      description: `${newStudent.nome} foi adicionado com sucesso`,
    });
  };

  const handleDeleteStudent = (id: string) => {
    const student = students.find((s) => s.id === id);
    if (student) {
      setStudentToDelete(student);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDeleteStudent = () => {
    if (studentToDelete) {
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
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
    setStudents((prev) => [...prev, ...newStudents]);
    toast({
      title: "Importação concluída",
      description: `${newStudents.length} alunos importados para ${trainingName}`,
    });
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["Nome", "Celular", "Email", "Treinamento"].join(","),
      ...students.map((student) =>
        [
          `"${student.nome}"`,
          `"${student.celular}"`,
          `"${student.email}"`,
          `"${student.treinamento}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `sbie-alunos-${new Date().toISOString().split("T")[0]}.csv`,
    );
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
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sbie-green-dark">
              Gestão de Alunos
            </h1>
            <p className="mt-2 text-sbie-green-gray">
              Gerencie todos os alunos da SBIE
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <Button
              onClick={handleAddStudent}
              className="bg-sbie-green-dark hover:bg-sbie-green-dark/80"
            >
              <Plus className="mr-2 h-4 w-4" />
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

        {/* Students Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-sbie-green-olive/20">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-sbie-green-dark/10">
                <Users className="h-6 w-6 text-sbie-green-dark" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-sbie-green-gray">
                  Total de Alunos
                </p>
                <p className="text-2xl font-bold text-sbie-green-dark">
                  {students.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border border-sbie-green-olive/20">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-sbie-brown/10">
                <Users className="h-6 w-6 text-sbie-brown" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-sbie-green-gray">
                  Treinamentos
                </p>
                <p className="text-2xl font-bold text-sbie-green-dark">
                  {new Set(students.map((s) => s.treinamento)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border border-sbie-green-olive/20">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-sbie-green-olive/10">
                <Users className="h-6 w-6 text-sbie-green-olive" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-sbie-green-gray">
                  Média/Treinamento
                </p>
                <p className="text-2xl font-bold text-sbie-green-dark">
                  {students.length > 0
                    ? Math.round(
                        students.length /
                          Math.max(
                            1,
                            new Set(students.map((s) => s.treinamento)).size,
                          ),
                      )
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <StudentsTable
          students={students}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onWhatsApp={handleWhatsAppStudent}
        />

        {/* Modals */}
        <CSVImportModal
          open={importModalOpen}
          onOpenChange={setImportModalOpen}
          onImport={handleImportCSV}
        />

        <EditStudentModal
          student={selectedStudent}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSave={selectedStudent ? handleSaveStudent : handleCreateStudent}
        />

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
