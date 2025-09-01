'use client';

interface AvatarDisplayProps {
  avatar?: string;
  userName: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export default function AvatarDisplay({ avatar, userName, size = 'md', onClick, className = '' }: AvatarDisplayProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-24 h-24 text-3xl'
  };

  const sizeClass = sizeClasses[size];
  const isClickable = !!onClick;

  return (
    <div
      className={`
        ${sizeClass} 
        rounded-full overflow-hidden 
        bg-gradient-to-br from-gray-200 to-gray-300 
        border-2 border-white shadow-lg
        ${isClickable ? 'cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105' : ''}
        ${className}
      `}
      onClick={onClick}
      title={isClickable ? 'Нажмите для изменения аватарки' : ''}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={`Аватар ${userName}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
          {userName && userName.length > 0 ? userName.charAt(0).toUpperCase() : '?'}
        </div>
      )}
    </div>
  );
}
