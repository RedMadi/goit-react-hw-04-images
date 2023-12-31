import React, { useEffect } from 'react';
import { StyledModal } from './Modal.styled';

const Modal = ({ currentImg, currentAlt, closeModal }) => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal]);
  const handleImageClick = e => {
    e.stopPropagation();
  };
  return (
    <StyledModal onClick={closeModal}>
      <div className="modal">
        <img src={currentImg} alt={currentAlt} onClick={handleImageClick} />
      </div>
    </StyledModal>
  );
};
export default Modal;
