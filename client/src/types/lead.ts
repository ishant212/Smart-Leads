export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;

  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}