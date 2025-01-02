import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@src/theme';

const holdCardStyles = StyleSheet.create({
  holdContainer: {
    flexDirection: 'row',
    padding: spacing.sm,
    paddingTop: spacing.md,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },

  // hold: {
  //   flex: 1,
  //   alignItems: 'center',
  //   padding: spacing.xxs,
  //   justifyContent: 'center',
  //   marginRight: spacing.xxs,
  //   borderRadius: radius.lg,
  //   backgroundColor: 'rgba(255, 255, 255, 0.2)',
  // },

  // stability: {
  //   flex: 1,
  //   alignItems: 'center',
  //   padding: spacing.xxs,
  //   marginLeft: spacing.xxs,
  //   borderRadius: radius.lg,
  //   justifyContent: 'center',
  //   backgroundColor: 'rgba(255, 255, 255, 0.2)',
  // },
  // lottie: {
  //   width: '100%',
  //   height: '100%',
  // },
  circle: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: spacing.xxl / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    backgroundColor: colors.primary,
  },
  circleText: {
    fontWeight: 'bold',
    color: colors.palette.white100,
    fontSize: typography.size.sm.fontSize,
  },
  labelText: {
    color: colors.primary,
    fontSize: typography.size.sm.fontSize,
  },
});

export default holdCardStyles;
