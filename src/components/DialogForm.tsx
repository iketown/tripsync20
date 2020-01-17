import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle
} from "@material-ui/core";

interface DialogFormProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  content?: any;
  title?: any;
}
const DialogForm = ({
  dialogOpen,
  setDialogOpen,
  content,
  title
}: DialogFormProps) => {
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      {content}
    </Dialog>
  );
};

export default DialogForm;
