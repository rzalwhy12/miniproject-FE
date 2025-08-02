'use client';

const IconSideNav = ({
  icon,
  label,
  active,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition-all duration-300 relative overflow-hidden
          ${
            active
              ? 'bg-gradient-to-r from-white/20 to-white/10 text-white border border-white/30 shadow-lg backdrop-blur-sm'
              : 'hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:border hover:border-white/20 hover:shadow-md hover:backdrop-blur-sm text-purple-100 hover:text-white'
          }`}
      onClick={onClick}
    >
      {/* Background glow effect for active state */}
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl"></div>
      )}
      
      {/* Icon container */}
      <div className={`relative z-10 p-1.5 rounded-lg transition-all duration-300 ${
        active 
          ? 'bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg' 
          : 'group-hover:bg-gradient-to-r group-hover:from-pink-500/50 group-hover:to-purple-500/50'
      }`}>
        {icon}
      </div>
      
      {/* Label */}
      <span className="relative z-10 font-medium tracking-wide">
        {label}
      </span>
      
      {/* Active indicator */}
      {active && (
        <div className="absolute right-2 w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse"></div>
      )}
      
      {/* Hover effect line */}
      <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-300 ${
        active ? 'w-full' : 'w-0 group-hover:w-full'
      }`}></div>
    </div>
  );
};

export default IconSideNav;
