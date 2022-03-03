import styled from "styled-components";

export default function Form({ submit, children }) {
  return (
    <StyledForm
      onSubmit={(e) => {
        e.preventDefault();
        if (submit) {
          submit();
        }
      }}
    >
      {children}
    </StyledForm>
  );
}

const StyledForm = styled.form`
  width: 100%;
  label {
    display: block;
    font-weight: 600;
    span {
      color: #f35f5f;
      margin-left: 0.25rem;
    }
  }
  input,
  textarea {
    margin-top: 0.25rem;
    display: block;
    width: 100%;
    padding: 0.8rem 1.2rem;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-weight: 700;
    background-color: transparent;
    border: 2px solid #ffffff;
    font-weight: 600;
    color: #ffffff;
    transition: all 0.3s ease;
    &::placeholder {
      color: #adadad;
      font-weight: 300;
    }
    &:focus {
      outline: none;
      border: 2px solid #1e78ff;
    }
  }
  textarea {
    height: 10rem;
    resize: none;
  }
`;
