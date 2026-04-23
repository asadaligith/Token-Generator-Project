// Local Notification Service
// This provides a fallback notification system when FCM is not available

export const scheduleNotification = (title, options = {}, delayMs = 0) => {
  setTimeout(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/logo.png',
        ...options,
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, {
            icon: '/logo.png',
            ...options,
          });
        }
      });
    }
  }, delayMs);
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return Notification.permission === 'granted';
};

// Calculate time until notification (10 minutes before token turn)
export const calculateNotificationTime = (tokenNumber, currentToken, timePerToken) => {
  const minutesUntilTurn = (tokenNumber - currentToken) * timePerToken;
  const minutesForNotification = minutesUntilTurn - 10;
  
  if (minutesForNotification > 0) {
    return minutesForNotification * 60 * 1000; // Convert to milliseconds
  }
  return 0;
};

// Send token update notification
export const notifyTokenUpdate = (companyName, tokenNumber, waitTimeMinutes) => {
  scheduleNotification(`${companyName} - Token Update`, {
    body: `Your token #${tokenNumber} is ready. Wait time: ${waitTimeMinutes} minutes`,
    tag: `token-${tokenNumber}`,
  });
};

// Send turn notification
export const notifyYourTurn = (companyName, tokenNumber) => {
  scheduleNotification(`${companyName} - Your Turn!`, {
    body: `Your token #${tokenNumber} - It's your turn now!`,
    tag: `turn-${tokenNumber}`,
    badge: '/badge.png',
  });
};

// Send booking confirmation
export const notifyBookingConfirmed = (companyName, tokenNumber) => {
  scheduleNotification('Booking Confirmed', {
    body: `Your token #${tokenNumber} at ${companyName} has been booked`,
    tag: `booking-${tokenNumber}`,
  });
};
