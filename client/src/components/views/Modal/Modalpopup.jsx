import React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Outlet } from 'react-router-dom';

import './Modal.css';

const Modalpopup = (props) => {
  const navigate = useNavigate();
  const [modal, setModalOpen] = useState(true);

  const close = () => {
    setModalOpen(false);
    navigate(-1);
  };
  return createPortal(
    <div className={modal === true ? 'openModal modal' : 'modal'}>
      {modal === true ? (
        <section>
          <header>
            {props.header}
            <button className='close' onClick={close}>
              &times;
            </button>
          </header>
          <main>
            <Outlet></Outlet>
          </main>
          <footer>
            <button className='close' onClick={close}>
              Clsoe
            </button>
          </footer>
        </section>
      ) : null}
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modalpopup;
