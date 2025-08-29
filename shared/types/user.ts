export interface IAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface IUserRole {
  role: string;
}

export interface IUser {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  tgUsername?: string;
  address?: IAddress;
  roles: IUserRole[];
  favorites: string[];
  createdAt: Date;
  updatedAt: Date;
}
