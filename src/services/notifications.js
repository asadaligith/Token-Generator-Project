/**
 * Service to handle browser notifications
 */

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notification");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendNotification = (title, body, icon = '/favicon.svg') => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon,
      badge: icon,
    });
  }
};

/**
 * Check if a notification should be sent based on wait time
 * @param {Object} booking User booking
 * @param {Object} todayTokens Token status
 */
export const checkAndNotify = (booking, todayTokens) => {
  if (!booking || !todayTokens || booking.status !== 'waiting') return;

  const timePerToken = todayTokens.estimatedTimePerToken || 10;
  const currentToken = todayTokens.currentToken || 0;
  const positionInQueue = booking.tokenNumber - currentToken;

  const estimatedWaitTime = positionInQueue * timePerToken;

  // Notify if wait time is 10 minutes or less and not already notified
  if (estimatedWaitTime <= 10 && estimatedWaitTime > 0) {
    const notificationKey = `notified_${booking.id}_10min`;
    if (!localStorage.getItem(notificationKey)) {
      sendNotification(
        "Your turn is approaching!",
        `Estimated wait time: ${estimatedWaitTime} minutes for Token #${booking.tokenNumber}.`
      );
      localStorage.setItem(notificationKey, "true");
    }
  }
};
