type FlowerPlacement = {
  src: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width: string;
  rotate: number;
  delay: string;
  z: number;
};

/* Posições inspiradas no layout de referência: espalhadas em zigue-zague vertical */
const FLOWERS: FlowerPlacement[] = [
  {
    src: "/hero/13.webp",
    top: "0%",
    right: "0%",
    width: "40%",
    rotate: 14,
    delay: "0.5s",
    z: 2,
  },
  {
    src: "/hero/8.webp",
    top: "30%",
    left: "20%",
    width: "56%",
    rotate: -7,
    delay: "0s",
    z: 4,
  },
  {
    src: "/hero/1.webp",
    top: "10%",
    left: "6%",
    width: "34%",
    rotate: -11,
    delay: "0.3s",
    z: 1,
  },
  {
    src: "/hero/12.webp",
    bottom: "20%",
    left: "-2%",
    width: "36%",
    rotate: 8,
    delay: "0.75s",
    z: 2,
  },
  {
    src: "/hero/6.webp",
    bottom: "0%",
    right: "-6%",
    width: "50%",
    rotate: -4,
    delay: "1s",
    z: 3,
  },
];

export function HeroVisual() {
  return (
    <div className="relative w-full max-w-[400px] min-h-[520px] mx-auto">
      {FLOWERS.map((flower, i) => (
        <div
          key={flower.src}
          className="absolute"
          style={{
            top: flower.top,
            bottom: flower.bottom,
            left: flower.left,
            right: flower.right,
            width: flower.width,
            zIndex: flower.z,
            animation: `floatA 6s ease-in-out infinite ${flower.delay}`,
          }}
        >
          <div style={{ transform: `rotate(${flower.rotate}deg)` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={flower.src}
              alt=""
              className="w-full h-auto drop-shadow-[0_16px_32px_rgba(196,66,106,0.18)]"
              draggable={false}
              loading={i === 1 ? "eager" : "lazy"}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
