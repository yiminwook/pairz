export interface UserInfo {
  uid: string;
  email: string | null;
  emailId?: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ImageInfo {
  id: number;
  imgURL: string;
  uid: string;
  imageName: string;
}
