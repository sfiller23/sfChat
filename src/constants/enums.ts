export enum AppStateActions {
  SET_IMAGE_PROFILE,
  SET_IMAGE_PROFILE_CHANGE,
  SET_LOADING,
  CLEAR,
}

export enum AuthStateActions {
  LOGIN,
  LOGOUT,
  REFRESH,
  SET_DISPLAY_NAME,
}

export enum PreviewState {
  ADD = "Add",
  EDIT = "Edit",
}

export enum MessageStatus {
  SENT = "SENT",
  ARRIVED = "ARRIVED",
  SEEN = "SEEN",
}
