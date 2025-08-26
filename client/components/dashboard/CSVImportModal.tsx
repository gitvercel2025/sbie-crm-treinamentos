import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { Student } from "./StudentsTable";

interface CSVImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (students: Student[], trainingName: string) => void;
}

interface CSVPreview {
  headers: string[];
  rows: string[][];
  rowCount: number;
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

export default function CSVImportModal({ open, onOpenChange, onImport }: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<CSVPreview | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<string>("");
  const [customTraining, setCustomTraining] = useState<string>("");
  const [fieldMapping, setFieldMapping] = useState<{
    nome: string;
    celular: string;
    email: string;
  }>({
    nome: "",
    celular: "",
    email: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
      setErrors(["Por favor, selecione um arquivo CSV válido."]);
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    parseCSV(selectedFile);
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;

      // Better CSV parsing - handle different separators and quoted fields
      const lines = text.split('\n').filter(line => line.trim() !== '');

      if (lines.length < 2) {
        setErrors(["O arquivo CSV deve conter pelo menos um cabeçalho e uma linha de dados."]);
        return;
      }

      // Parse CSV with better handling of quoted fields and different separators
      const parseCSVLine = (line: string) => {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];

          if (char === '"') {
            inQuotes = !inQuotes;
          } else if ((char === ',' || char === ';') && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, ''));
      const rows = lines.slice(1, Math.min(6, lines.length)).map(line =>
        parseCSVLine(line).map(cell => cell.replace(/"/g, ''))
      );

      setCsvPreview({
        headers,
        rows,
        rowCount: lines.length - 1,
      });

      // Improved auto-detect field mappings
      const lowerHeaders = headers.map(h => h.toLowerCase().normalize());

      const findBestMatch = (patterns: string[]) => {
        for (const pattern of patterns) {
          const index = lowerHeaders.findIndex(h => h.includes(pattern));
          if (index !== -1) return headers[index];
        }
        return "";
      };

      setFieldMapping({
        nome: findBestMatch(['nome', 'name', 'aluno', 'estudante', 'participante']),
        celular: findBestMatch(['celular', 'telefone', 'phone', 'tel', 'whatsapp', 'contato']),
        email: findBestMatch(['email', 'e-mail', 'mail', 'correio']),
      });
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleImport = async () => {
    if (!file || !csvPreview || !selectedTraining) return;

    const requiredFields = ['nome', 'celular', 'email'];
    const missingMappings = requiredFields.filter(field => !fieldMapping[field as keyof typeof fieldMapping]);
    
    if (missingMappings.length > 0) {
      setErrors([`Por favor, mapeie os campos obrigatórios: ${missingMappings.join(', ')}`]);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setErrors([]);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const students: Student[] = [];
        const importErrors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map(cell => cell.trim().replace(/"/g, ''));
          
          try {
            const nomeIndex = headers.indexOf(fieldMapping.nome);
            const celularIndex = headers.indexOf(fieldMapping.celular);
            const emailIndex = headers.indexOf(fieldMapping.email);

            const nome = row[nomeIndex]?.trim();
            const celular = row[celularIndex]?.trim();
            const email = row[emailIndex]?.trim();

            if (!nome || !celular || !email) {
              importErrors.push(`Linha ${i + 1}: dados incompletos`);
              continue;
            }

            students.push({
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              nome,
              celular,
              email,
              treinamento: selectedTraining === "custom" ? customTraining : selectedTraining,
            });

            // Simulate progress
            setUploadProgress((i / (lines.length - 1)) * 100);
          } catch (error) {
            importErrors.push(`Linha ${i + 1}: erro ao processar dados`);
          }
        }

        setTimeout(() => {
          if (importErrors.length > 0) {
            setErrors(importErrors.slice(0, 5)); // Show only first 5 errors
          }

          if (students.length > 0) {
            onImport(students, selectedTraining === "custom" ? customTraining : selectedTraining);
            onOpenChange(false);
            resetForm();
          }

          setUploading(false);
          setUploadProgress(0);
        }, 1000);
      };
      reader.readAsText(file);
    } catch (error) {
      setErrors(["Erro ao processar o arquivo CSV."]);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFile(null);
    setCsvPreview(null);
    setSelectedTraining("");
    setCustomTraining("");
    setFieldMapping({ nome: "", celular: "", email: "" });
    setErrors([]);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-sbie-green-dark">
            Importar Alunos via CSV
          </DialogTitle>
          <DialogDescription className="text-sbie-green-gray">
            Faça upload de um arquivo CSV com os dados dos alunos para importar em lote.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium text-sbie-green-dark">
              Arquivo CSV
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="border-sbie-green-olive/30"
              />
              {file && (
                <Badge variant="secondary" className="bg-sbie-beige-light text-sbie-green-dark">
                  <FileText className="mr-1 h-3 w-3" />
                  {file.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Training Selection */}
          {csvPreview && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-sbie-green-dark">
                Treinamento
              </Label>
              <Select value={selectedTraining} onValueChange={setSelectedTraining}>
                <SelectTrigger className="border-sbie-green-olive/30">
                  <SelectValue placeholder="Selecione o treinamento" />
                </SelectTrigger>
                <SelectContent>
                  {TRAINING_OPTIONS.map((training) => (
                    <SelectItem key={training} value={training}>
                      {training}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Outro (personalizado)</SelectItem>
                </SelectContent>
              </Select>
              
              {selectedTraining === "custom" && (
                <Input
                  placeholder="Digite o nome do treinamento"
                  value={customTraining}
                  onChange={(e) => setCustomTraining(e.target.value)}
                  className="border-sbie-green-olive/30"
                />
              )}
            </div>
          )}

          {/* CSV Preview and Field Mapping */}
          {csvPreview && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-sbie-green-dark">
                  Mapeamento de Campos
                </Label>
                <p className="text-xs text-sbie-green-gray mt-1">
                  Associe as colunas do seu CSV aos campos obrigatórios
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(fieldMapping).map(([field, value]) => (
                  <div key={field} className="space-y-1">
                    <Label className="text-xs text-sbie-green-dark capitalize">
                      {field} *
                    </Label>
                    <Select value={value} onValueChange={(val) => 
                      setFieldMapping(prev => ({ ...prev, [field]: val }))
                    }>
                      <SelectTrigger className="border-sbie-green-olive/30">
                        <SelectValue placeholder="Selecionar coluna" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvPreview.headers.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              {/* Preview Table */}
              <div>
                <Label className="text-sm font-medium text-sbie-green-dark">
                  Prévia ({csvPreview.rowCount} registros)
                </Label>
                <div className="mt-2 border border-sbie-green-olive/20 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-sbie-beige-light/50">
                        <tr>
                          {csvPreview.headers.map((header, index) => (
                            <th key={index} className="px-3 py-2 text-left text-sbie-green-dark font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreview.rows.map((row, index) => (
                          <tr key={index} className="border-t border-sbie-green-olive/10">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-2 text-sbie-green-olive">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-sbie-green-dark">
                  Importando...
                </Label>
                <span className="text-xs text-sbie-green-gray">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                <div className="font-medium mb-1">Erros encontrados:</div>
                <ul className="text-xs space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleImport}
            disabled={!csvPreview || !selectedTraining || uploading || 
              (selectedTraining === "custom" && !customTraining.trim())}
            className="bg-sbie-brown hover:bg-sbie-brown/80"
          >
            {uploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Importar {csvPreview?.rowCount || 0} Alunos
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
