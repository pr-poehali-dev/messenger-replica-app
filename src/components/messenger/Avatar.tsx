interface AvatarProps {
  name: string;
  online?: boolean;
  size?: "sm" | "md" | "lg";
}

const colors = [
  "#2AABEE", "#E67E22", "#9B59B6", "#2ECC71",
  "#E74C3C", "#1ABC9C", "#F39C12", "#3498DB",
  "#E91E63", "#00BCD4",
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-14 h-14 text-base",
};

const dotSizes = {
  sm: "w-2 h-2 -right-0.5 -bottom-0.5",
  md: "w-3 h-3 right-0 bottom-0",
  lg: "w-3.5 h-3.5 right-0.5 bottom-0.5",
};

export default function Avatar({ name, online, size = "md" }: AvatarProps) {
  const isEmoji = /\p{Emoji}/u.test(name) && name.length <= 4;
  const color = getColor(name);

  return (
    <div className={`relative flex-shrink-0`}>
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white select-none`}
        style={{ background: isEmoji ? "hsl(222 18% 24%)" : color }}
      >
        {isEmoji ? <span className="text-xl">{name}</span> : name.slice(0, 2)}
      </div>
      {online && (
        <span
          className={`absolute ${dotSizes[size]} rounded-full status-online`}
        />
      )}
    </div>
  );
}
