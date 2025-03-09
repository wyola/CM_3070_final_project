import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Fix copied from https://github.com/testing-library/user-event/discussions/1087#discussioncomment-6302495
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
