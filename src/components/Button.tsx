export function Button({ small, gray, className = "", ...props }: ButtonProps) {
  const sizeClasses = small ? "px-3 py-1" : "px-4 py-2 font-bold";
  const colorClasses = gray
    ? "bg-gray-600 hover:bg-gray-700 focus-visible:bg-gray-700"
    : "bg-[#03a9f4] hover:bg-[#028ccb] focus-visible:bg-[#028ccb]";
  return (
    <button
      className={`rounded-full text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses} ${colorClasses} ${className}`}
      {...props}
    ></button>
  );
}
