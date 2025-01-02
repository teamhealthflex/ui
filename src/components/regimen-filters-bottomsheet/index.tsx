/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleProp, TextStyle, ViewStyle, View, TouchableOpacity } from 'react-native';

import { Text } from '../text';
import { spacing } from '@theme';
import { useTheme } from '@contexts';
import { Button } from '@teamhealthflex/ui';

export interface Regimen {
  _id: string;
  name: string;
}

export interface RegimenFiltersBottomSheetProps {
  data?: Regimen[];
  size?: SizePreset;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  filterAndSort?: Record<string, any>;
  pressedStyle?: StyleProp<ViewStyle>;
  disabledStyle?: StyleProp<ViewStyle>;
  pressedTextStyle?: StyleProp<TextStyle>;
  disabledTextStyle?: StyleProp<TextStyle>;
  applyFiterAndSort?: (filter: any) => void;
  regimenFilterSheetRef: React.RefObject<any>;
}

export function RegimenFiltersBottomSheet(props: RegimenFiltersBottomSheetProps) {
  const { data, applyFiterAndSort, regimenFilterSheetRef, ...rest } = props;

  const { colors } = useTheme();

  const [regimenStates, setRegimenStates] = React.useState<{ [key: string]: boolean }>({});

  /**
   * setting the initial state of the regimens
   */
  React.useEffect(() => {
    if (data) {
      setRegimenStates(data.reduce((acc, regimen) => ({ ...acc, [regimen._id]: false }), {}));
    }
  }, [data]);

  /**
   * toggling the state of the regimens
   */
  const toggleRegimenState = React.useCallback((regimenId: string) => {
    setRegimenStates((prevStates) => ({ ...prevStates, [regimenId]: !prevStates[regimenId] }));
  }, []);

  /**
   * submitting the selected regimens
   */
  const submitFilter = React.useCallback(() => {
    const selectedRegimenIds = Object.keys(regimenStates).filter((id) => regimenStates[id]);
    applyFiterAndSort?.({ regimenId: selectedRegimenIds.join(',') });

    regimenFilterSheetRef.current?.close();
  }, [regimenStates, applyFiterAndSort, regimenFilterSheetRef]);

  return (
    <>
      {(data ?? []).length > 0 ? (
        data?.map((regimen) => (
          <TouchableOpacity
            key={regimen._id}
            onPress={() => toggleRegimenState(regimen._id)}
            style={[
              $bottomSheetItem,
              { backgroundColor: regimenStates[regimen._id] ? colors.primary : 'white' },
            ]}
            {...rest}
          >
            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
              }}
            >
              <Text
                preset="subHeading"
                style={[
                  $bottomSheetItemText,
                  { color: regimenStates[regimen._id] ? 'white' : colors.primary },
                ]}
                numberOfLines={1}
              >
                {regimen.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={[$bottomSheetItemText, $unavailable]}>No available filters</Text>
      )}

      <View style={$buttonContainer}>
        <Button text="Show Results" onPress={submitFilter} />
      </View>
    </>
  );
}

export type SizePreset = 'extraSmall' | 'small' | 'medium' | 'large';

const $bottomSheetItemText: TextStyle = {
  paddingLeft: spacing.md,
};

const $bottomSheetItem: ViewStyle = {
  height: 40,
  padding: spacing.xs,
  justifyContent: 'center',
  borderRadius: spacing.xxs,
  marginVertical: spacing.xxs,
};

const $buttonContainer: ViewStyle = {
  marginVertical: spacing.xs,
};

const $unavailable: TextStyle = {
  textAlign: 'center',
  marginBottom: spacing.xs,
};

/**
 * The display name of the `RegimenFiltersBottomSheet` component.
 * @type {string}
 */
RegimenFiltersBottomSheet.displayName = 'RegimenFiltersBottomSheet';

export default RegimenFiltersBottomSheet;
