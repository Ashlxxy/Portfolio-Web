import { useEffect, useState } from "react";

type useMouseType = {
  allowPage?: boolean;
  allowAngle?: boolean;
  allowAcc?: boolean;
};

export const useMouse = ({
  allowPage,
  allowAngle,
  allowAcc,
}: useMouseType = {}) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [angle, setAngle] = useState(0);
  const [acceleration, setAcceleration] = useState(0);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      setX(allowPage ? e.pageX : e.clientX);
      setY(allowPage ? e.pageY : e.clientY);

      if (allowAcc) {
        const acc = Math.abs(e.movementX) + Math.abs(e.movementY);
        setAcceleration(acc);
      }
      if (allowAngle) {
        setAngle(Math.atan2(e.movementY, e.movementX));
      }
    };
    if (typeof window !== "undefined")
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  });
  return { x, y, angle, acceleration };
};
