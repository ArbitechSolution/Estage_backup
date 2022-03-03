import styled from "styled-components";
import useCountdown from "../../hooks/useCountdown";
export default function Timer() {
  const timer = useCountdown("Mar 3, 2022 00:00:00 GMT+0600");
  return (
    <StyledTimer>
      {timer?.days} days {timer?.hours} hours {timer?.minutes} minutes
    </StyledTimer>
  );
}

const StyledTimer = styled.p`
  color: #ffffff !important;
`;
