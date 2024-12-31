import React, { useRef, useEffect } from 'react';

import { X } from 'lucide-react';

const CustomDrawer = ({ isOpen, onClose, children, anchor = 'right' }: any) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerWidth = "30%";

  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    
return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getPositionClasses = () => {
    return anchor === 'left' ? 'left-0 ' : 'right-0';
  };

  const getTransformClasses = () => {
    const translateClass = anchor === 'left' ? '-translate-x-full' : 'translate-x-full';

    
return isOpen ? 'translate-x-0 shadow-lg' : translateClass;
  };

  return (
    <div
      ref={drawerRef}
      className={`absolute top-0 ${getPositionClasses()} h-full w-60 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out ${getTransformClasses()}`}
      style={{ width: drawerWidth }}
    >
      <div className="p-6">
        <div
          onClick={onClose}
          className={`absolute top-2 ${anchor === 'left' ? 'left-2' : 'right-2'} text-gray-500 hover:text-gray-700`}
          style={{ cursor: 'pointer' }}
        >
          <X size={24} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default CustomDrawer;