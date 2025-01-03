import { Platform, Linking } from 'react-native';

// import { AppError } from '@src/services';
// import { useFeatureFlags } from './remote-config';
// import { useShowMessages } from './use-show-messages';

/**
 * Custom Hook for sending WhatsApp messages.
 */
export const useWhatsApp = () => {
  //   const { showError } = useShowMessages();
  //   const { customerSupportNumber } = useFeatureFlags();

  /**
   * Generates the WhatsApp URL.
   * @param {string} phoneWithCountryCode - Phone number with country code.
   * @param {string} message - Message to send.
   * @returns {string} - WhatsApp deep link URL.
   */
  const generateWhatsAppLink = (phoneWithCountryCode: string, message: string) => {
    // const mobileNumber = phoneWithCountryCode || customerSupportNumber;
    const mobileNumber = phoneWithCountryCode;
    const formattedPhone = Platform.OS === 'ios' ? mobileNumber : `+${mobileNumber}`;
    return `whatsapp://send?text=${encodeURIComponent(message)}&phone=${formattedPhone}`;
  };

  /**
   * Sends a WhatsApp message.
   * @param {string} [phoneWithCountryCode] - Phone number with country code (optional).
   * @param {string} message - Message to send.
   */
  const sendWhatsApp = (message: string, phoneWithCountryCode?: string) => {
    /* Validate message */
    // if (!message) {
    //   const error = new AppError(`Please provide a message to send.`);
    //   showError(error);

    //   return;
    // }

    /* Validate customerSupportNumber when no phone number is provided */
    // if (!phoneWithCountryCode && !customerSupportNumber) {
    //   const error = new AppError(`Customer Support dont exist`);
    //   showError(error);

    //   return;
    // }

    const url = generateWhatsAppLink(phoneWithCountryCode!, message);

    // try {
    Linking.openURL(url);
    // } catch {
    //   const error = new AppError(
    //     `WhatsApp Not Installed',Please ensure WhatsApp is installed on your device`,
    //   );
    //   showError(error);
    // }
  };

  return { sendWhatsApp };
};

export default useWhatsApp;
