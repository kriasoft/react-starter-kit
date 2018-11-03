import { SHOW_MODAL, HIDE_MODAL } from '../constants';

export function showModal(modalId) {
  return {
    type: SHOW_MODAL,
    data: modalId,
  };
}

export function hideModal(modalId) {
  return {
    type: HIDE_MODAL,
    data: modalId,
  };
}
