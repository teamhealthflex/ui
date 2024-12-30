import React from 'react';
import {
  View,
  Platform,
  StyleProp,
  ViewProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { useTheme } from '@contexts';
import { radius, spacing } from '@theme';
import { Text, TextProps } from '../text';

export interface CardProps extends TouchableOpacityProps {
  /**
   * One of the different types of text presets.
   */
  preset?: CardPresets;

  /**
   * Whether the card is active. If true, the card will be highlighted.
   */
  active?: boolean;

  /**
   * How the content should be aligned vertically. This is especially (but not exclusively) useful
   * when the card is a fixed height but the content is dynamic.
   *
   * `top` (default) - aligns all content to the top.
   * `center` - aligns all content to the center.
   * `space-between` - spreads out the content evenly.
   * `force-footer-bottom` - aligns all content to the top, but forces the footer to the bottom.
   */
  verticalAlignment?: 'top' | 'center' | 'space-between' | 'force-footer-bottom';

  /**
   * Custom component added to the left of the card body.
   */
  LeftComponent?: React.ReactElement;

  /**
   * Custom component added to the right of the card body.
   */
  RightComponent?: React.ReactElement;

  /**
   * The heading text to display.
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
   * Custom heading component.
   * Overrides all other `heading*` props.
   */
  HeadingComponent?: React.ReactElement;

  /**
   * The content text to display.
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
   * Custom content component.
   * Overrides all other `content*` props.
   */
  ContentComponent?: React.ReactElement;

  /**
   * The footer text to display.
   */
  footer?: TextProps['text'];

  /**
   * Style overrides for footer text.
   */
  footerStyle?: StyleProp<TextStyle>;

  /**
   * Pass any additional props directly to the footer Text component.
   */
  FooterTextProps?: TextProps;

  /**
   * Custom footer component.
   * Overrides all other `footer*` props.
   */
  FooterComponent?: React.ReactElement;

  /**
   * Whether to apply elevation and shadow styles to the card.
   */
  raised?: boolean;

  /**
   * Style overrides for the main container.
   */
  mainContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Style for the pressed state.
   */
  pressedStyle?: StyleProp<ViewStyle>;

  /**
   * Style for the default state.
   */
  defaultStyle?: StyleProp<ViewStyle>;

  /**
   * Style overrides for the container.
   */
  headingContainerStyleExternalReceived?: StyleProp<ViewStyle>;
}

export type CardPresets = 'default' | 'reversed';

/**
 * Cards are useful for displaying related information in a contained way.
 * If a ListItem displays content horizontally, a Card can be used to display content vertically.
 * @param {CardProps} props - The props for the `Card` component.
 * @returns {JSX.Element} The rendered `Card` component.
 */
export function Card(props: CardProps) {
  const {
    footer,
    content,
    heading,
    pressedStyle,
    defaultStyle,
    LeftComponent,
    RightComponent,
    raised = false,
    FooterComponent,
    FooterTextProps,
    ContentTextProps,
    HeadingTextProps,
    ContentComponent,
    HeadingComponent,
    mainContainerStyle,
    verticalAlignment = 'top',
    style: $containerStyleOverride,
    footerStyle: $footerStyleOverride,
    headingStyle: $headingStyleOverride,
    contentStyle: $contentStyleOverride,
    headingContainerStyleExternalReceived,
    ...WrapperProps
  } = props;

  const { colors } = useTheme();

  const [pressed, setPressed] = React.useState(false);

  const preset: CardPresets = props.preset ?? 'default';

  const isPressable = !!WrapperProps.onPress;
  const isHeadingPresent = !!(HeadingComponent || heading);
  const isContentPresent = !!(ContentComponent || content);
  const isFooterPresent = !!(FooterComponent || footer);

  const Wrapper = (isPressable ? TouchableOpacity : View) as React.ComponentType<
    TouchableOpacityProps | ViewProps
  >;

  const handlePressIn = React.useCallback(() => setPressed(true), []);
  const handlePressOut = React.useCallback(() => setPressed(false), []);

  const $containerBase: ViewStyle = {
    minHeight: 64,
    borderWidth: 1,
    padding: spacing.xs,
    flexDirection: 'row',
    borderRadius: radius.lg,
  };

  const $containerRaised: ViewStyle = {
    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowOpacity: 0.25,
        shadowColor: colors.grey300,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 4,
        shadowOpacity: 0.3,
        shadowColor: colors.grey300,
        shadowOffset: { width: 0, height: 2 },
      },
    }),
  };

  const $alignmentWrapper: ViewStyle = {
    flex: 1,
    alignSelf: 'stretch',
  };

  const $alignmentWrapperFlexOptions = {
    'center': 'center',
    'top': 'flex-start',
    'space-between': 'space-between',
    'force-footer-bottom': 'space-between',
  } as const;

  const $headingPresets: Record<CardPresets, TextStyle> = {
    default: {},
    reversed: { color: colors.white100 },
  };

  const $contentPresets: Record<CardPresets, TextStyle> = {
    default: {},
    reversed: { color: colors.white100 },
  };

  const $footerPresets: Record<CardPresets, TextStyle> = {
    default: {},
    reversed: { color: colors.white200 },
  };

  const $containerPresets = {
    default: [
      $containerBase,
      {
        borderColor: colors.white300,
        backgroundColor: colors.white100,
      },
    ] as StyleProp<ViewStyle>,

    reversed: [
      $containerBase,
      { backgroundColor: colors.grey500, borderColor: colors.grey300 },
    ] as StyleProp<ViewStyle>,
  };

  const $containerStyle: StyleProp<ViewStyle> = [
    mainContainerStyle,
    $containerStyleOverride,
    $containerPresets[preset],
    raised && $containerRaised,
    pressed ? pressedStyle : defaultStyle,
  ];

  const $headingStyle = [
    $headingStyleOverride,
    $headingPresets[preset],
    HeadingTextProps?.style,
    (isFooterPresent || isContentPresent) && { marginBottom: spacing.xxxs },
  ];

  const $contentStyle = [
    $contentStyleOverride,
    $contentPresets[preset],
    ContentTextProps?.style,
    isHeadingPresent && { marginTop: spacing.xxxs },
    isFooterPresent && { marginBottom: spacing.xxxs },
  ];

  const $footerStyle = [
    $footerStyleOverride,
    $footerPresets[preset],
    FooterTextProps?.style,
    (isHeadingPresent || isContentPresent) && { marginTop: spacing.xxxs },
  ];

  const $alignmentWrapperStyle = [
    $alignmentWrapper,
    headingContainerStyleExternalReceived,
    RightComponent && { marginEnd: spacing.md },
    LeftComponent && { marginStart: spacing.md },
    { justifyContent: $alignmentWrapperFlexOptions[verticalAlignment] },
  ];

  const RenderHeading =
    HeadingComponent ||
    (isHeadingPresent && (
      <Text weight="bold" text={heading} {...HeadingTextProps} style={$headingStyle} />
    ));

  const RenderContent =
    ContentComponent ||
    (isContentPresent && (
      <Text weight="normal" text={content} {...ContentTextProps} style={$contentStyle} />
    ));

  const RenderFooter =
    FooterComponent ||
    (isFooterPresent && (
      <Text weight="normal" size="xs" text={footer} {...FooterTextProps} style={$footerStyle} />
    ));

  return (
    <Wrapper
      delayPressOut={50}
      activeOpacity={0.75}
      style={[$containerStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole={isPressable ? 'button' : undefined}
      {...WrapperProps}
    >
      {LeftComponent}
      <View style={$alignmentWrapperStyle}>
        {RenderHeading}
        {RenderContent}
        {RenderFooter}
      </View>
      {RightComponent}
    </Wrapper>
  );
}

/**
 * The display name of the `Card` component.
 * @type {string}
 */
Card.displayName = 'Card';

export default Card;
