import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Popup from './Popup';
import { SocketService } from "../socket";

const socket = SocketService.getSocket();

const PopupHOC = (WrappedComponent) => {
  const EnhancedComponent = () => {
    const [popupData, setPopupData] = useState([]);
    
    useEffect(() => {
      socket.on('event', (data) => {
        console.log(data);
        setPopupData(prevData => [...prevData, data]);
      });

      // Clean up the socket event listener on component unmount
      return () => {
        socket.off('event');
      };
    }, []);

    const closePopup = (index) => {
      setPopupData(prevData => {
        const updatedData = [...prevData];
        updatedData.splice(index, 1);
        return updatedData;
      });
    };

    return (
      <div>
        {popupData.map((data, index) => (
          <Popup key={index} data={data} onClose={() => closePopup(index)} />
        ))}
        <WrappedComponent />
      </div>
    );
  };

  return EnhancedComponent;
};

export default PopupHOC;
