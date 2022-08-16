import React from "react";
import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import { useToast } from "../../hooks/toast";
import api from "../../services/api";
import Button from "../Button";
import { ButtonsContainer, Container } from "./styles";

const customStyles = {
  content: {
    background: '#312e38',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

interface DeleteDialogProps {
  dialogIsOpen: boolean;
  setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  appointmentId: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ dialogIsOpen, setDialogIsOpen, appointmentId }) => {
  const { addToast } = useToast();
  const { push } = useHistory();

  const handleDelete = () => {
    try {
      api.delete(`appointments/${appointmentId}`);

      addToast({
        type: 'success',
        title: 'Success',
        description: 'Appointment successfuly deleted!',
      });

      push('/');
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'An error occurred while schedulling, check your details',
      });
    }
  }

  return (
    <Modal isOpen={dialogIsOpen} onRequestClose={() => setDialogIsOpen(false)} style={customStyles}>
      <Container>
        <h2>Are you sure you want to delete this appointment?</h2>
        <ButtonsContainer>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={() => setDialogIsOpen(false)}>No</Button>
        </ButtonsContainer>
      </Container>
    </Modal>
  )
}

export default DeleteDialog;
