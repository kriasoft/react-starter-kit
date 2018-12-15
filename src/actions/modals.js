import { SHOW_MODAL, HIDE_MODAL } from '../constants';

export function showModal(modalId, data) {
  return {
    type: SHOW_MODAL,
    data: { id: modalId, data },
  };
}

export function hideModal(modalId) {
  return {
    type: HIDE_MODAL,
    data: modalId,
  };
}
