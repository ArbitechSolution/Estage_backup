import styled from "styled-components";

export default function Button({
  pill,
  border,
  alt,
  warn,
  type,
  func,
  styles,
  children,
}) {
  return (
    <StyledButton
      onClick={() => (func ? func() : null)}
      type={type ? type : "button"}
      style={styles}
      // pill={pill}  
      border={border}
      alt={alt}
      warn={warn}
    >
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  padding: ${(props) => (props.pill ? "0.8rem 1.5rem" : "0.8rem 1.2rem")};
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 700;
  color: ${(props) =>
    props.warn
      ? props.border
        ? "#F35F5F"
        : "#ffffff"
      : props.alt
      ? "#ffffff"
      : "#1E78FF"};
  border: ${(props) => (props.border ? "2px solid #ffffff" : "none")};
  border-color: ${(props) =>
    props.warn ? "#F35F5F" : props.alt ? "#ffffff" : "none"};
  border-radius: ${(props) => (props.pill ? "20rem" : "0.25rem")};
  background-color: ${(props) =>
    props.warn
      ? props.border
        ? "transparent"
        : "#F35F5F"
      : props.alt
      ? "#1E78FF"
      : "#ffffff"};
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${(props) =>
      props.warn ? (props.border ? "#F35F5F" : "#ffffff") : "#1E78FF"};
    color: ${(props) =>
      props.warn ? (props.border ? "#ffffff" : "#F35F5F") : "#ffffff"};
  }
`;

export function SmallButton({ func, alternate, children }) {
  return (
    <StyledSmallButton
    
      onClick={() => (func ? func() : null)}
      alternate={alternate}
    >
      {children}
    </StyledSmallButton>
  );
}

const StyledSmallButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  background-color: ${(props) => (props.alternate ? "#1b1b1b" : "#ffffff")};
  color: ${(props) => (props.alternate ? "#ffffff" : "#1b1b1b")};
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: #1e78ff;
    color: #ffffff;
  }
`;
