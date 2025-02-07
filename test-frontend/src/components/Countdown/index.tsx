import { useEffect, useRef, useState } from "react";

export default function Countdown({ expiresAt }: { expiresAt: number }): JSX.Element {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = expiresAt - now;

    if (difference <= 0) {
      return { expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      expired: false,
    };
  }

  const updateCountdown = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current!;

      // Only update state every second to avoid excessive re-renders
      if (deltaTime >= 1000) {
        setTimeLeft(calculateTimeLeft());
        previousTimeRef.current = time;
      }
    } else {
      previousTimeRef.current = time;
    }

    requestRef.current = requestAnimationFrame(updateCountdown);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateCountdown);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [expiresAt]);

  if (timeLeft.expired) {
    return <div>Expired!</div>;
  }

  return (
    <div>
      {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};