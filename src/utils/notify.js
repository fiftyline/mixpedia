import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export const notify = new Notyf({
  duration: 3000,
  position: { x: 'right', y: 'bottom' },
  dismissible: true,
  types: [
    {
      type: 'success',
      background: '#6366f1',
      icon: false,
    },
    {
      type: 'error',
      background: '#dc2626',
      icon: false,
    },
  ],
});
