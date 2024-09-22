const Modal = ({ closeModal, children }) => {
  return (
    <section className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-40">
      {children}
    </section>
  );
};

export default Modal;
