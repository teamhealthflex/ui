import React from 'react';
import { useAudioPlayer, AudioSource, AudioPlayer as ExpoAudioPlayer } from 'expo-audio';

// import { useAudio } from '@src/contexts';

export interface AudioFeedbackProps {
  /**
   * The source of the audio.
   */
  source: AudioSource;

  /**
   * Check if audio feedback should be enabled.
   */
  enableAudioFeedback: boolean;

  /**
   * Callback to handle the completion of audio playback.
   */
  onPlaybackFinished?: () => void;

  /**
   * Duration of the audio.
   */
  duration?: number;

  /**
   * Whether the audio should loop.
   */
  loop?: boolean;

  /**
   * The playback rate of the audio.
   */
  playbackRate?: number;

  /**
   * Whether the pitch should be corrected.
   */
  shouldCorrectPitch?: boolean;
}

/**
 * AudioPlayer component to handle audio playback with various options.
 *
 * @param {AudioFeedbackProps} props - The properties for the AudioPlayer component.
 * @returns {JSX.Element | null} The rendered AudioPlayer component.
 */
export function AudioPlayer(props: AudioFeedbackProps & Partial<ExpoAudioPlayer>) {
  const {
    source,
    duration,
    loop = false,
    playbackRate = 1.0,
    onPlaybackFinished,
    enableAudioFeedback,
    shouldCorrectPitch = true,
  } = props;

  /**
   * Hook to access the audio context.
   */
  // const { isAudioEnabled, checkVolume, currentVolume } = useAudio();

  /**
   * Hook to access the audio player.
   */
  const audioPlayer = useAudioPlayer(source);

  React.useEffect(() => {
    /**
     * Return early if audio is not enabled.
     */
    // if (!isAudioEnabled) {
    //   return;
    // }

    /**
     * Check the volume level before starting the audio playback.
     */
    // checkVolume();

    /**
     * Subscription to the playback status update event.
     */
    let subscription: { remove: () => void } | undefined;

    /**
     * Function to start the audio playback.
     */
    const startPlayback = () => {
      if (enableAudioFeedback && audioPlayer) {
        subscription = audioPlayer.addListener('playbackStatusUpdate', (status) => {
          if (!status.playing && status.currentTime > 0) {
            onPlaybackFinished?.();
          }
        });

        audioPlayer.play();
        audioPlayer.loop = loop;

        if (duration !== undefined) {
          audioPlayer.seekTo(duration);
        }

        audioPlayer.setPlaybackRate(playbackRate);
        if (audioPlayer.shouldCorrectPitch !== undefined) {
          audioPlayer.shouldCorrectPitch = shouldCorrectPitch;
        }
      }
    };

    /**
     * Start the audio playback.
     */
    startPlayback();

    /**
     * Cleanup function to remove the audio subscription.
     */
    return () => {
      subscription?.remove();
    };
  }, [
    loop,
    duration,
    audioPlayer,
    playbackRate,
    onPlaybackFinished,
    shouldCorrectPitch,
    enableAudioFeedback,
  ]);

  /**
   * Render null since this component does not need to render any visible UI.
   */
  return null;
}

/**
 * The display name of the `AudioPlayer` component.
 * @type {string}
 */
AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
