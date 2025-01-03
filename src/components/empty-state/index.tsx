import { FasterImageProps } from '@candlefinance/faster-image';
import { ImageStyle, StyleProp, TextStyle, View, ViewStyle } from 'react-native';

import { spacing } from '@theme';
import { Button, ButtonProps, Image, Text, TextProps } from '@teamhealthflex/ui';

interface EmptyStateProps {
  /**
   * An optional prop that specifies the text/image set to use for the empty state.
   */
  preset?: keyof typeof EmptyStatePresets;

  /**
   * Style override for the container.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * An Image source to be displayed above the heading.
   */
  imageSource?: FasterImageProps['source'];

  /**
   * Style overrides for image.
   */
  imageStyle?: ImageStyle;

  /**
   * Pass any additional props directly to the Image component.
   */
  imageProps?: Omit<FasterImageProps, 'source'>;

  /**
   * The heading text to display if not using `headingTx`.
   */
  heading?: TextProps['text'];

  /**
   * Style overrides for heading text.
   */
  headingStyle?: StyleProp<TextStyle>;

  /**
   * Pass any additional props directly to the heading Text component.
   */
  HeadingTextProps?: TextProps;

  /**
   * The content text to display if not using `contentTx`.
   */
  content?: TextProps['text'];

  /**
   * Style overrides for content text.
   */
  contentStyle?: StyleProp<TextStyle>;

  /**
   * Pass any additional props directly to the content Text component.
   */
  ContentTextProps?: TextProps;

  /**
   * The button text to display if not using `buttonTx`.
   */
  button?: TextProps['text'];

  /**
   * Style overrides for button.
   */
  buttonStyle?: ButtonProps['style'];

  /**
   * Style overrides for button text.
   */
  buttonTextStyle?: ButtonProps['textStyle'];

  /**
   * Called when the button is pressed.
   */
  buttonOnPress?: ButtonProps['onPress'];

  /**
   * Pass any additional props directly to the Button component.
   */
  buttonProps?: ButtonProps;

  /**
   * this prop can toggle default button to be shown or not
   * TODO:- Need to refactor this prop since it should automatically derive from button receiving logic
   */
  buttonRequired?: boolean;
}

interface EmptyStatePresetItem {
  button: TextProps['text'];
  heading: TextProps['text'];
  content: TextProps['text'];
  imageSource: FasterImageProps['source'];
}

const EmptyStatePresets = {
  generic: {
    heading: '__EMPTY_STATE_HEADING__',
    content: '__EMPTY_STATE_CONTENT__',
    button: '__EMPTY_STATE_BUTTON__',
  } as EmptyStatePresetItem,
} as const;

/**
 * A component to use when there is no data to display. It can be utilized to direct the user what to do next.
 * @param {EmptyStateProps} props - The props for the `EmptyState` component.
 * @returns {JSX.Element} The rendered `EmptyState` component.
 */
export function EmptyState(props: EmptyStateProps) {
  const preset = EmptyStatePresets[props.preset ?? 'generic'];

  const {
    buttonRequired = true,
    button = preset.button,
    buttonOnPress,
    content = preset.content,
    heading = preset.heading,
    style: $containerStyleOverride,
    buttonStyle: $buttonStyleOverride,
    buttonTextStyle: $buttonTextStyleOverride,
    contentStyle: $contentStyleOverride,
    headingStyle: $headingStyleOverride,
    imageStyle: $imageStyleOverride,
    imageSource = preset.imageSource,
    buttonProps,
    ContentTextProps,
    HeadingTextProps,
    imageProps,
  } = props;

  const isImagePresent = !!imageSource;
  const isHeadingPresent = !!heading;
  const isContentPresent = !!content;
  const isButtonPresent = !!button && buttonRequired;

  const $containerStyles = [$containerStyleOverride];
  const $imageStyles = [
    $image,
    isHeadingPresent || isContentPresent || isButtonPresent ? { marginBottom: spacing.xxxs } : {},
    $imageStyleOverride || {},
    ...(Array.isArray(imageProps?.style)
      ? imageProps.style
      : imageProps?.style
        ? [imageProps.style]
        : []),
  ];

  const $headingStyles = [
    $heading,
    isImagePresent && { marginTop: spacing.xxxs },
    (isContentPresent || isButtonPresent) && { marginBottom: spacing.xxxs },
    $headingStyleOverride,
    HeadingTextProps?.style,
  ];
  const $contentStyles = [
    $content,
    (isImagePresent || isHeadingPresent) && { marginTop: spacing.xxxs },
    isButtonPresent && { marginBottom: spacing.xxxs },
    $contentStyleOverride,
    ContentTextProps?.style,
  ];
  const $buttonStyles = [
    (isImagePresent || isHeadingPresent || isContentPresent) && { marginTop: spacing.xl },
    $buttonStyleOverride,
    buttonProps?.style,
  ];

  return (
    <View style={$containerStyles}>
      {isImagePresent && <Image source={imageSource} {...imageProps} style={$imageStyles} />}

      {isHeadingPresent && (
        <Text text={heading} preset="subHeading" {...HeadingTextProps} style={$headingStyles} />
      )}

      {isContentPresent && <Text text={content} {...ContentTextProps} style={$contentStyles} />}

      {isButtonPresent && (
        <Button
          text={button}
          onPress={buttonOnPress}
          textStyle={$buttonTextStyleOverride}
          {...buttonProps}
          style={$buttonStyles}
        />
      )}
    </View>
  );
}

const $image: ImageStyle = { alignSelf: 'center' };
const $heading: TextStyle = { textAlign: 'center', paddingHorizontal: spacing.lg };
const $content: TextStyle = { textAlign: 'center', paddingHorizontal: spacing.lg };

/**
 * The display name of the `EmptyState` component.
 * @type {string}
 */
EmptyState.displayName = 'EmptyState';

export default EmptyState;
