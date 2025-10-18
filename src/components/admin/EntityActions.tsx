'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Eye, Edit, Trash2, Check, X } from 'lucide-react';

export interface EntityActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showApprove?: boolean;
  showReject?: boolean;
  showActivate?: boolean;
  showDeactivate?: boolean;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  approveLabel?: string;
  rejectLabel?: string;
  activateLabel?: string;
  deactivateLabel?: string;
  deleteTitle?: string;
  deleteDescription?: string;
  className?: string;
}

export function EntityActions({
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onActivate,
  onDeactivate,
  showView = true,
  showEdit = true,
  showDelete = true,
  showApprove = false,
  showReject = false,
  showActivate = false,
  showDeactivate = false,
  viewLabel = 'Ver',
  editLabel = 'Editar',
  deleteLabel = 'Eliminar',
  approveLabel = 'Aprobar',
  rejectLabel = 'Rechazar',
  activateLabel = 'Activar',
  deactivateLabel = 'Desactivar',
  deleteTitle = '¿Estás seguro?',
  deleteDescription = 'Esta acción no se puede deshacer.',
  className,
}: EntityActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete?.();
  };

  const hasActions = showView || showEdit || showDelete || showApprove || showReject || showActivate || showDeactivate;

  if (!hasActions) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={className}>
          {showView && onView && (
            <DropdownMenuItem onClick={onView}>
              <Eye className="mr-2 h-4 w-4" />
              {viewLabel}
            </DropdownMenuItem>
          )}
          {showEdit && onEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              {editLabel}
            </DropdownMenuItem>
          )}
          {showApprove && onApprove && (
            <DropdownMenuItem onClick={onApprove}>
              <Check className="mr-2 h-4 w-4" />
              {approveLabel}
            </DropdownMenuItem>
          )}
          {showReject && onReject && (
            <DropdownMenuItem onClick={onReject}>
              <X className="mr-2 h-4 w-4" />
              {rejectLabel}
            </DropdownMenuItem>
          )}
          {showActivate && onActivate && (
            <DropdownMenuItem onClick={onActivate}>
              <Check className="mr-2 h-4 w-4" />
              {activateLabel}
            </DropdownMenuItem>
          )}
          {showDeactivate && onDeactivate && (
            <DropdownMenuItem onClick={onDeactivate}>
              <X className="mr-2 h-4 w-4" />
              {deactivateLabel}
            </DropdownMenuItem>
          )}
          {showDelete && onDelete && (
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteLabel}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
