import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Menu, MenuItem, ListItemText } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { SocketService } from "../../socket";

const socket = SocketService.getSocket();

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // Simulating WebSocket message received
  const simulateWebSocketMessage = (data) => {
    const newNotification = data;
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
  };

  useEffect(() => {
    socket.on('event', (data) => {
      console.log(data);
      simulateWebSocketMessage(data)
    });

    return () => {
      socket.off('event');
    };
  }, []);

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton color="black" onClick={handleIconClick}>
        <Badge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {notifications.map((notification) => (
          <MenuItem key={notification.event.id} onClick={handleCloseMenu}>
            <ListItemText primary={`${notification.event.resource.resourceType} created`} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default NotificationComponent;
