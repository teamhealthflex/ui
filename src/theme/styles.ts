import { useTheme } from '@contexts';
import { StyleSheet } from 'react-native';

import { radius } from './radius';
import { spacing } from './spacing';
import { fontSizes, fontWeights } from '@theme';

export const useCustomStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    statusBarRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
    },
    screenLogo: {
      width: 70,
      height: 80,
    },
    textCenter: {
      textAlign: 'center',
    },
    screenLogoBox: {
      margin: 0,
      padding: 0,
      justifyContent: 'center',
    },
    screenLogoTitle: {
      fontSize: 22,
      fontWeight: fontWeights.bold,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    columnContainer: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    rowContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    centerContainer: {
      backgroundColor: 'white',
    },
    boxContainer: {
      backgroundColor: 'white',
      width: '90%',
      height: '50%',
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowFlex: {
      flex: 1,
      flexDirection: 'row',
    },
    columnFlex: {
      flex: 1,
      flexDirection: 'column',
    },
    endFlex: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    startFlex: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    alignSelfCenter: {
      alignSelf: 'center',
    },
    row: {
      flexDirection: 'row',
    },
    spacer: {
      flex: 1,
    },
    contentPadding: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    noPadding: {
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    noMargin: {
      marginVertical: 0,
      marginHorizontal: 0,
    },
    buttonText: {
      ...fontSizes.md,
      color: colors.black500,
    },
    boldFont: {
      fontWeight: fontWeights.bold,
    },
    errorText: {
      color: colors.danger,
    },
    successText: {
      color: colors.success,
    },
    autoMargin: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    actionSheetContainerStyle: {
      backgroundColor: colors.white500,
      padding: spacing.md,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    actionSheetIndicatorStyle: {
      width: 100,
    },
    heading: {
      fontWeight: fontWeights.bold,
    },
    subHeading: {
      fontWeight: fontWeights.normal,
    },
    subHeadingMedium: {
      fontWeight: fontWeights.medium,
    },
    headerIconLeft: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: spacing.sm,
      justifyContent: 'flex-start',
      height: spacing.xxxl,
    },
    headerIconRight: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: spacing.xs,
      justifyContent: 'flex-end',
      height: spacing.xxxl,
    },
    inputContainer: {
      marginBottom: spacing.sm,
    },
    gradientContainer: {
      borderBottomLeftRadius: radius.lg,
      borderBottomRightRadius: radius.lg,
    },
    disabled: {
      opacity: 0.75,
    },
  });

  return { styles };
};

export default useCustomStyles;
