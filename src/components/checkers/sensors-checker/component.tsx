import React from 'react';
import { Portal } from '@gorhom/portal';
import { useShallow } from 'zustand/react/shallow';
import { TextStyle, View, ViewStyle } from 'react-native';

import { spacing } from '@theme';
import { useTheme } from '@contexts';
import { utils } from '../../../resources';
import { useSensorStore } from '@src/store/sensor-store';
import { PortalTypes, SENSOR_BODY_TAG } from '@src/models';
import { SensorState, useBle, useSensor, useSession } from '@src/contexts';
import { BottomSheet, Button, Card, Text, BottomSheetRef, Chip } from '@teamhealthflex/ui';

export function SensorsChecker(props: React.PropsWithChildren) {
  const { children } = props;

  const { colors } = useTheme();
  const { exercise } = useSession();
  const { isBluetoothEnabled } = useBle();
  const { refreshBleConnection, reconnectSensor, sensorState, isReconnecting, connectedDevices } =
    useSensor();
  const { sensorMap } = useSensorStore(
    useShallow((state) => ({
      sensors: state.sensors,
      sensorMap: state.sensorMap,
    })),
  );

  const bottomSheetRef = React.useRef<BottomSheetRef>(null);

  /**
   * function to reconnect sensor and callback function to execute once reconnectSensor gets called
   * @param deviceId
   */
  const handleReconnect = (deviceId: string) => {
    reconnectSensor(deviceId, () => {
      bottomSheetRef.current?.close();
    });
  };

  React.useEffect(() => {
    /**
     * Get the current bottom sheet ref.
     * NOTE: This is required to open/close the bottom sheet when the sensor state changes.
     */
    const currentBottomRef = bottomSheetRef.current;

    /**
     * Open the bottom sheet when the sensor state changes to partially.
     */
    if (sensorState === SensorState.Partially) {
      if (exercise && exercise.sensorsRequired) {
        /**
         * check if disconnected sensor is in the required sensors
         * if yes then open the bottom sheet
         */
        const connectedSensorTypes: Array<SENSOR_BODY_TAG> = [];
        connectedDevices.forEach((device) => {
          if (device.name) {
            const tag = sensorMap[device.name];
            connectedSensorTypes.push(tag as SENSOR_BODY_TAG);
          }
        });

        const allSensorsStillConnected = exercise.sensorsRequired.every((_sensor) =>
          connectedSensorTypes.includes(_sensor),
        );

        if (!allSensorsStillConnected && !bottomSheetRef.current?.isOpen()) {
          currentBottomRef?.open();
        }
      }
    }

    /**
     * Close the bottom sheet when the sensor state changes to connected.
     */
    if (sensorState === SensorState.Connected) {
      currentBottomRef?.close();
    }

    /**
     * Close the bottom sheet when the sensor state changes to disconnected.
     */
    return () => {
      if (sensorState === SensorState.Connected) {
        currentBottomRef?.close();
      }
    };
  }, [sensorState, connectedDevices, exercise, sensorMap]);

  /**
   * after connection if the sensor got disconnected then show it
   */
  const renderSensorStatus = () => {
    /**
     * Check if the sensorMap are available.
     */
    if (!sensorMap || !Object.keys(sensorMap).length) {
      return null;
    }

    /**
     * Get the sensor sensorMap and check if the connected devices are still connected.
     */
    const sensorMappings = Object.keys(sensorMap).map((sensorId) => {
      const tag = sensorMap[sensorId];
      const connectedSensor = connectedDevices.find((d) => d.name === sensorId);
      if (!connectedSensor) {
        return { deviceId: sensorId, tag, found: false, status: 'disconnected' };
      }
      return { deviceId: sensorId, tag, found: true, status: 'connected' };
    });

    const opacity = isReconnecting ? 0.5 : 1;

    return (
      <BottomSheet
        initialIndex={-1}
        ref={bottomSheetRef}
        title="Sensor Devices"
        enableOverDrag={false}
        enablePanDownToClose={false}
        backdropRenderedBehavior="none"
      >
        <View>
          <View style={$sensorsCardContainer}>
            {sensorMappings?.map((device) => (
              <Card
                raised
                key={device.deviceId}
                onPress={() => handleReconnect(device.deviceId)}
                disabled={device.found || !device.tag || isReconnecting}
                style={[
                  $bottomSheetItem,
                  { opacity },
                  {
                    borderColor: !device.found || !device.tag ? colors.danger300 : colors.grey100,
                  },
                ]}
                ContentComponent={
                  <View style={$cardContainer}>
                    <View>
                      <Text style={$cardText} key={device.deviceId}>
                        {device.deviceId}
                      </Text>

                      <View>
                        {!device.found && (
                          <Chip size="sm" preset="error" variant="solid">
                            <Text>disconnected</Text>
                          </Chip>
                        )}
                      </View>
                    </View>
                    <Chip variant="solid" preset="success">
                      <Text>{utils.toTitleCase(device.tag!)}</Text>
                    </Chip>
                  </View>
                }
              />
            ))}
          </View>

          <Button onPress={refreshBleConnection}>Restart Connection</Button>
        </View>
      </BottomSheet>
    );
  };
  return (
    <>
      {children}

      <Portal hostName={PortalTypes.APP}>
        {/* show if some connected sensors got partially disconnected */}
        {isBluetoothEnabled && renderSensorStatus()}
      </Portal>
    </>
  );
}

const $bottomSheetItem: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: spacing.xs,
};

const $cardContainer: ViewStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: spacing.xs,
  justifyContent: 'space-between',
};

const $cardText: TextStyle = {
  marginVertical: spacing.xs,
};

const $sensorsCardContainer: ViewStyle = {
  flex: 1,
};

/**
 * The display name of the `SensorsChecker` component.
 * @type {string}
 */
SensorsChecker.displayName = 'SensorsChecker';

export default SensorsChecker;
