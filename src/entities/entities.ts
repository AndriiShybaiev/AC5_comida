export interface MenuItem {
  id: number;
  name: string;
  quantity: number;
  desc: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}
