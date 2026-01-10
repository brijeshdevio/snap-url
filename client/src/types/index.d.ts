export interface UserType {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// ======== MODAL ============
export type ModalsType = {
  NewKeyModal: boolean;
};

export type ModalContextType = {
  modals: ModalsType;
  modal: (key: keyof ModalsType, value: boolean) => void;
};

export type AvatarForm = {
  file: File;
  secret: string;
};
