import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FaChevronRight } from "react-icons/fa";

export default function Accordion({ title, rank, children }) {
  const contentRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(1000);

  useEffect(() => {
    setContentHeight(contentRef.current.offsetHeight);
  }, [isOpen]);

  return (
    <StyledAccordion isOpen={isOpen}>
      <div className="title" onClick={() => setIsOpen(!isOpen)}>
        <h3>
          {rank && <b className="rank">#{rank}</b>}
          {title}
        </h3>
        <span>
          <FaChevronRight
            style={{
              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </span>
      </div>
      <div
        className="content"
        style={{
          maxHeight: isOpen ? `${contentHeight}px` : "0px",
        }}
      >
        <div ref={contentRef} className="content-container">
          {children}
        </div>
      </div>
    </StyledAccordion>
  );
}

const StyledAccordion = styled.div`
  width: 100%;
  border: 2px solid #ffffff;
  border-radius: 0.5rem;
  background-color: ${(props) => (props.isOpen ? "#ffffff" : "transparent")};
  color: ${(props) => (props.isOpen ? "#1b1b1b" : "#ffffff")};
  transition: all 0.3s ease;
  &:hover {
    background-color: #ffffff;
    color: #1b1b1b;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    cursor: pointer;
    h3 {
      font-size: 1.2rem;
    }
    .rank {
      margin-right: 1rem;
    }
    span {
      font-size: 1rem;
      line-height: 1;
      svg {
        transition: all 0.3s ease;
      }
    }
  }
  .content {
    max-height: 0px;
    overflow: hidden;
    transition: all 0.3s ease;
    &-container {
      padding: 0 1rem 1rem;
      line-height: 1.5;
    }
  }
`;
