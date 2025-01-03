import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';

import { Button, Icon, Text } from '@teamhealthflex/ui';

export interface PlayInstructionVideoProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function PlayInstructionVideo(props: PlayInstructionVideoProps) {
  const { onPress, ...rest } = props;

  return (
    <Button size="small" preset="reversed" onPress={onPress} {...rest}>
      <View style={$mainContainer}>
        <Icon icon="youtube-play" />
        <Text style={$textStyle}>Play Instruction Video</Text>
      </View>
    </Button>
  );
}

const $textStyle: TextStyle = {
  textAlign: 'center',
};

const $mainContainer: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
};

/**
 * The display name of the `PlayInstructionVideo` component.
 * @type {string}
 */
PlayInstructionVideo.displayName = 'PlayInstructionVideo';

export default PlayInstructionVideo;
