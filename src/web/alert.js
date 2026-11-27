// Web stand-in for React Native's Alert so src/i18n/strings.js (biAlert) runs unchanged.
// Alert.alert(title, message, buttons): one button → window.alert, otherwise window.confirm
// (OK runs the last non-cancel button, Cancel runs the 'cancel' button). Swap for a real
// modal when the web UI needs one.
export const Alert = {
  alert(title, message, buttons = []) {
    const text = [title, message].filter(Boolean).join('\n\n');
    if (buttons.length <= 1) {
      window.alert(text);
      buttons[0]?.onPress?.();
      return;
    }
    const cancel = buttons.find((b) => b.style === 'cancel');
    const action = [...buttons].reverse().find((b) => b.style !== 'cancel');
    if (window.confirm(text)) action?.onPress?.();
    else cancel?.onPress?.();
  },
};
