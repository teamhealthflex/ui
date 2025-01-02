import { Platform, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@src/theme';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verticalContainer: {
    ...Platform.select({
      ios: {
        shadowColor: colors.palette.neutral900,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: radius.xs,
      },
    }),
    borderRadius: radius.lg,
    flexDirection: 'column',
  },
  horizontalContainer: {
    ...Platform.select({
      ios: {
        shadowColor: colors.palette.neutral900,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: radius.xs,
      },
    }),
    height: spacing.xxxl,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    alignContent: 'space-between',
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
    width: spacing.header_section_height,
  },
  title: {
    color: colors.primary,
  },
  playbackButtons: {
    minWidth: spacing.header_section_empty_height,
  },
});
