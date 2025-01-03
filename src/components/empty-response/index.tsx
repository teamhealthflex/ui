import React from 'react';
import { View, StyleProp, ViewStyle, TextStyle } from 'react-native';

import { Text } from '@teamhealthflex/ui';

export enum EmptyResponseType {
  VIEW = 'VIEW',
  LIST = 'LIST',
}

export interface EmptyResponseProps {
  /**
   * The message to display when there is no data.
   * Can be a plain string or a key for translation.
   */
  message?: string;

  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * An optional style override for the message text.
   */
  messageStyle?: StyleProp<TextStyle>;

  /**
   * Children components.
   */
  children?: React.ReactNode;

  /**
   * Type of the empty response, determines the preset style.
   */
  type: EmptyResponseType;
}

/**
 * A customizable empty response component that displays a message or children components
 * when there is no data to show.
 *
 * @param {EmptyResponseProps} props - The props for the `EmptyResponse` component.
 * @returns {JSX.Element} The rendered `EmptyResponse` component.
 *
 * @example
 * <EmptyResponse
 *   message="common.noData"
 *   style={styles.emptyResponse}
 *   messageStyle={styles.messageText}
 * />
 */
export function EmptyResponse(props: EmptyResponseProps) {
  const {
    children,
    message = 'no data',
    style: $styleOverride,
    messageStyle: $messageStyleOverride,
  } = props;

  return (
    <View style={[$viewContainer, $styleOverride]}>
      {children ? (
        children
      ) : (
        <Text
          size="md"
          preset="default"
          style={[$textMessage, $messageStyleOverride]}
          text={typeof message === 'string' ? message : undefined}
        />
      )}
    </View>
  );
}

const $viewContainer: ViewStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  marginVertical: 'auto',
  justifyContent: 'center',
  marginHorizontal: 'auto',
};

const $textMessage: TextStyle = {};

/**
 * The display name of the `EmptyResponse` component.
 * @type {string}
 */
EmptyResponse.displayName = 'EmptyResponse';

export default EmptyResponse;
