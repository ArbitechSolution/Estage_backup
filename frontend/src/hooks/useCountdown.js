import { useEffect, useState } from "react";

//Input Format: "Mar 3, 2022 00:00:00 GMT+0600"
const useCountdown = (target) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // setInterval(() => {
    //   let targetDate = new Date(target).getTime();
    //   let nowDate = new Date().getTime();
    //   let dateDifference = targetDate - nowDate;

    //   let days = Math.floor(dateDifference / (1000 * 60 * 60 * 24));
    //   let hours = Math.floor(
    //     (dateDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    //   );
    //   let minutes = Math.floor(
    //     (dateDifference % (1000 * 60 * 60)) / (1000 * 60)
    //   );
    //   let seconds = Math.floor((dateDifference % (1000 * 60)) / 1000);

    //   setTimeLeft({
    //     days,
    //     hours,
    //     minutes,
    //     seconds,
    //   });
    // }, 1000);
  }, [target]);

  return timeLeft;
};

export default useCountdown;
