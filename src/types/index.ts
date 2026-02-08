export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    joined: string;
    city: string;
}

export interface Vehicle {
    id: string;
    ownerId: string;
    brand: string;
    model: string;
    plate: string;
    year: number;
    type: string;
    color: string;
    mileage: number;
}

export interface Intervention {
    id: string;
    clientId: string;
    vehicleId: string;
    type: string;
    status: 'En attente' | 'En cours' | 'Terminé' | 'Facturée';
    dateIn: string;
    dateOut?: string;
    symptoms: string;
    diagnostic?: string;
    cost: number;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    minStock: number;
    unit: string;
}

export interface Service {
    id: string;
    name: string;
    price: number;
    duration: string;
    category: string;
}

export interface Invoice {
    id: string;
    interventionId: string;
    amount: number;
    status: 'Payée' | 'En attente' | 'Impayée';
    date: string;
    method?: string;
}

export interface Stat {
    label: string;
    value: string | number;
    iconName?: string;
    icon?: any;
    color: string;
    trend?: string;
    trendType?: 'up' | 'down';
}

export interface NavItem {
    label: string;
    icon: any; // LucideIcon
    href: string;
}

export interface NavSection {
    title: string;
    items: NavItem[];
}

export interface Paiement {
    id: string;
    invoice_id: string;
    client: string;
    method: string;
    amount: string | number;
    date: string;
}

export interface AppUser {
    id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
}

export interface DashboardClient {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    vehicles: number;
    lastVisit: string;
}

export interface DashboardInvoice {
    id: string;
    client: string;
    amount: string;
    status: string;
    date: string;
    due_date: string;
}

export interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    category: string;
    quantity: number;
    minQuantity: number;
    price: string;
    status: string;
}

export interface DashboardVehicle {
    id: string;
    owner: string;
    brand: string;
    model: string;
    plate: string;
    year: number;
    mileage: string | number;
    lastService: string;
    status: string;
}

export interface DashboardIntervention {
    id: string;
    client: string;
    vehicle: string;
    type: string;
    status: string;
    date: string;
    cost: string;
}

export interface InventoryProduct {
    id: string;
    ref: string;
    name: string;
    category: string;
    stock: number;
    price: string;
}

export interface InventoryService {
    id: string;
    name: string;
    category: string;
    duration: string;
    price: string;
}

export interface ListVehicle {
    id: string;
    manufacturer: string;
    model: string;
    registration: string;
    year: number;
    mileage: string;
    owner: string;
}
