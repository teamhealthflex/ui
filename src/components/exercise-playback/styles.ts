import { Platform, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@src/theme';

const exercisePlaybackBottomSheet = StyleSheet.create({
  headingContainer: {
    padding: spacing.md,
  },
  boldLine: {
    height: 1.4,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    backgroundColor: colors.primary,
  },
  exerciseContainer: {
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderColor: colors.primary,
    justifyContent: 'flex-start',
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.light_blue,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: radius.xs,
        shadowColor: colors.palette.neutral900,
      },
    }),
  },
  imageContainer: {
    height: spacing.xxl,
    width: spacing.xxxxl,
    marginRight: spacing.xs,
    borderRadius: radius.md,
  },
  watchButton: {
    flex: 1,
  },
  watchButtonAlign: {
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    marginBottom: spacing.xxs,
    justifyContent: 'space-between',
  },
  name: {
    maxWidth: '50%',
    fontFamily: typography.fonts.interFont.medium,
  },
});

export default exercisePlaybackBottomSheet;
