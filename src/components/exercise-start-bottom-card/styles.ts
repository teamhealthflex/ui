import { Platform, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@src/theme';

const cardStyles = StyleSheet.create({
  bottomContainer: {
    height: '10%',
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: radius.lg,
    marginVertical: spacing.md,
    borderColor: colors.primary,
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
    backgroundColor: colors.palette.neutral100,
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

  bottomRefreshIconContainer: {
    width: spacing.xl,
    height: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.xl / 2,
    borderColor: colors.palette.primary100,
    backgroundColor: 'rgba(26, 53, 107, 0.06)',
  },
  repsParentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  repsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  starsParentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
});

export default cardStyles;
