export function IconHoverEffect({
  children,
  red = false,
}: IconHoverEffectProps) {
  const colorClasses = red
    ? "outline-red-400 hover:bg-red-200 group-hover:bg-red-200 group-focus-visible:bg-red-200 focus-visible:bg-red-200 p-2"
    : "outline-gray-400 hover:bg-[#1b2730] group-hover:bg-[#1b2730] group-focus-visible:bg-[#1b2730] focus-visible:bg-[#1b2730] py-4 px-6";
  return (
    <div
      className={`rounded-full transition-colors duration-200 ${colorClasses}`}
    >
      {children}
    </div>
  );
}
