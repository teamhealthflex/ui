import { act, render } from '@tests/setup';

import { CountDownTimer } from './index';

describe('CountDownTimer Component', () => {
  jest.useFakeTimers();

  it('renders the initial time correctly', () => {
    const { getByText } = render(<CountDownTimer initialTime={10} />);

    expect(getByText('10')).toBeTruthy();
  });

  it('starts the timer and decrements the time', () => {
    const { getByText } = render(<CountDownTimer initialTime={5} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByText('4')).toBeTruthy();
  });

  it('pauses the timer when pauseTimer is called', () => {
    const onReadyMock = jest.fn();
    render(<CountDownTimer initialTime={5} onReady={onReadyMock} />);

    const controls = onReadyMock.mock.calls[0][0];
    act(() => {
      controls.pauseTimer();
      jest.advanceTimersByTime(1000);
    });

    expect(controls.time).toBe(5);
  });

  it('restarts the timer when restartTimer is called', () => {
    const onReadyMock = jest.fn();
    render(<CountDownTimer initialTime={5} onReady={onReadyMock} />);

    const controls = onReadyMock.mock.calls[0][0];
    act(() => {
      jest.advanceTimersByTime(2000);
      controls.restartTimer();
    });

    expect(controls.time).toBe(5);
  });

  it('cancels the timer when cancelTimer is called', () => {
    const onReadyMock = jest.fn();
    render(<CountDownTimer initialTime={5} onReady={onReadyMock} />);

    const controls = onReadyMock.mock.calls[0][0];
    act(() => {
      jest.advanceTimersByTime(2000);
      controls.cancelTimer();
    });

    expect(controls.time).toBe(5);
  });

  it('calls onFinish when the timer reaches 0', () => {
    const onFinishMock = jest.fn();
    render(<CountDownTimer initialTime={1} onFinish={onFinishMock} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onFinishMock).toHaveBeenCalled();
  });

  it('displays "START" when the timer reaches 0', () => {
    const { getByText } = render(<CountDownTimer initialTime={1} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByText('START')).toBeTruthy();
  });

  it('calls onReady with the timer controls', () => {
    const onReadyMock = jest.fn();
    render(<CountDownTimer initialTime={5} onReady={onReadyMock} />);

    const controls = onReadyMock.mock.calls[0][0];

    expect(controls).toHaveProperty('startTimer');
    expect(controls).toHaveProperty('pauseTimer');
    expect(controls).toHaveProperty('restartTimer');
    expect(controls).toHaveProperty('cancelTimer');
    expect(controls).toHaveProperty('isTimerActive');
  });
});
