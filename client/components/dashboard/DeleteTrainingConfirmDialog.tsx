import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Training } from "./EditTrainingModal";

interface DeleteTrainingConfirmDialogProps {
  training: Training | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteTrainingConfirmDialog({
  training,
  open,
  onOpenChange,
  onConfirm,
}: DeleteTrainingConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sbie-green-dark">
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sbie-green-gray">
            Tem certeza que deseja excluir o treinamento{" "}
            <span className="font-semibold text-sbie-brown">
              {training?.name}
            </span>?
            {training?.students > 0 && (
              <span className="block mt-2 text-red-600 font-medium">
                Atenção: Este treinamento possui {training.students} aluno(s) matriculado(s).
              </span>
            )}
            <span className="block mt-2">
              Esta ação não pode ser desfeita.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-sbie-green-olive/30">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Excluir Treinamento
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
