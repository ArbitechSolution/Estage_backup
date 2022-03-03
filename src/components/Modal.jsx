import styled from "styled-components";
import { MdClose } from "react-icons/md";

export default function Modal({ onClose, children }) {
  return (
    <StyledModal>
      <div className="backdrop" onClick={() => onClose()}></div>
      <div className="content">
        <button onClick={() => onClose()} className="close">
          <MdClose />
        </button>
        {children}
      </div>
    </StyledModal>
  );
}

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: -1;
  }
  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 768px;
    max-height: 80vh;
    overflow: auto;
    background-color: #1b1b1b;
    color: #ffffff;
    border: 2px solid #ffffff;
    border-radius: 0.25rem;
    padding: 1.5rem;
    z-index: 10;
    .close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background-color: transparent;
      border: none;
      color: #fff;
      font-size: 1.5rem;
      padding: 0;
      cursor: pointer;
      z-index: 11;
      transition: all 0.3s ease;
      svg {
        transition: all 0.3s ease;
      }
      &:hover {
        color: #f35f5f;
        svg {
          transform: rotateZ(90deg);
        }
      }
    }
  }
`;
