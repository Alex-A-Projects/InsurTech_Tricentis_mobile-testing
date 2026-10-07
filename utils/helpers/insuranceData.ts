import {
  randomCity,
  randomComments,
  randomDateOfBirth,
  randomEmail,
  randomFutureDate,
  randomInt,
  randomItem,
  randomLicensePlate,
  randomPastDate,
  randomPassword,
  randomPhone,
  randomStreetAddress,
  randomString,
  randomUsername,
  randomWebsite,
  randomZip,
} from './testData';

/**
 * Static reference data sourced from the Tricentis Vehicle Insurance
 * Sample App form options. Keeping these constants out of the POMs
 * means we can reuse the same option lists in API and DB tests, and
 * makes it easy to update when the form changes.
 *
 * Ported verbatim from the Playwright/TypeScript desktop project.
 */

export const AUTOMOBILE_MAKES = [
  'Audi',
  'BMW',
  'Ford',
  'Honda',
  'Mazda',
  'Mercedes Benz',
  'Nissan',
  'Opel',
  'Porsche',
  'Renault',
  'Skoda',
  'Suzuki',
  'Toyota',
  'Volkswagen',
  'Volvo',
] as const;

export const AUTOMOBILE_MODELS_BY_MAKE: Record<string, readonly string[]> = {
  Audi: ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
  BMW: ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
  Ford: ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
  Honda: ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
  Mazda: ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
  'Mercedes Benz': ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
  Nissan: ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
  Opel: ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
  Porsche: ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
  Renault: ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
  Skoda: ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
  Suzuki: ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
  Toyota: ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
  Volkswagen: ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
  Volvo: ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'],
};

export const TRUCK_MAKES = AUTOMOBILE_MAKES; // Same list of makes for all vehicle types
export const TRUCK_MODELS_BY_MAKE: Record<string, readonly string[]> = Object.fromEntries(
  AUTOMOBILE_MAKES.map((m) => [
    m,
    ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'] as readonly string[],
  ]),
) as Record<string, readonly string[]>;

export const MOTORCYCLE_MAKES = AUTOMOBILE_MAKES;
export const MOTORCYCLE_MODELS_BY_MAKE: Record<string, readonly string[]> = Object.fromEntries(
  AUTOMOBILE_MAKES.map((m) => [
    m,
    ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'] as readonly string[],
  ]),
) as Record<string, readonly string[]>;

export const CAMPER_MAKES = AUTOMOBILE_MAKES;
export const CAMPER_MODELS_BY_MAKE: Record<string, readonly string[]> = Object.fromEntries(
  AUTOMOBILE_MAKES.map((m) => [
    m,
    ['Scooter', 'Three-Wheeler', 'Moped', 'Motorcycle'] as readonly string[],
  ]),
) as Record<string, readonly string[]>;

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric Power', 'Gas', 'Other'] as const;
export const NUMBER_OF_SEATS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
export const MOTORCYCLE_SEATS = ['1', '2', '3'] as const;
export const RIGHT_HAND_DRIVE = ['Yes', 'No'] as const;
export const GENDERS = ['Male', 'Female'] as const;

export const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'East Timor',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea, North',
  'Korea, South',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
] as const;

export const OCCUPATIONS = [
  'Employee',
  'Public Official',
  'Farmer',
  'Unemployed',
  'Selfemployed',
] as const;

export const HOBBIES = [
  'Speeding',
  'Bungee Jumping',
  'Cliff Diving',
  'Skydiving',
  'Other',
] as const;

export const INSURANCE_SUMS = [
  '3.000.000,00',
  '5.000.000,00',
  '7.000.000,00',
  '10.000.000,00',
  '15.000.000,00',
  '20.000.000,00',
  '25.000.000,00',
  '30.000.000,00',
  '35.000.000,00',
] as const;

export const MERIT_RATINGS = [
  'Super Bonus',
  'Bonus 1',
  'Bonus 2',
  'Bonus 3',
  'Bonus 4',
  'Bonus 5',
  'Bonus 6',
  'Bonus 7',
  'Bonus 8',
  'Bonus 9',
  'Malus 10',
  'Malus 11',
  'Malus 12',
  'Malus 13',
  'Malus 14',
  'Malus 15',
  'Malus 16',
  'Malus 17',
] as const;

export const DAMAGE_INSURANCE_OPTIONS = [
  'No Coverage',
  'Partial Coverage',
  'Full Coverage',
] as const;
export const COURTESY_CAR_OPTIONS = ['No', 'Yes'] as const;
export const OPTIONAL_PRODUCTS = ['Euro Protection', 'Legal Defense Insurance'] as const;
export const PRICE_OPTIONS = ['Silver', 'Gold', 'Platinum', 'Ultimate'] as const;

export type VehicleType = 'automobile' | 'truck' | 'motorcycle' | 'camper';

export interface VehicleData {
  type?: VehicleType;
  make: string;
  model: string;
  cylinderCapacity: number;
  enginePerformance: number;
  dateOfManufacture: string;
  numberOfSeats: string;
  rightHandDrive?: 'Yes' | 'No';
  fuelType: string;
  payload?: number;
  totalWeight?: number;
  listPrice: number;
  licensePlateNumber: string;
  annualMileage: number;
}

export interface InsurantData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  streetAddress: string;
  country: string;
  zipCode: string;
  city: string;
  occupation: string;
  hobbies: string[];
  website?: string;
}

export interface ProductData {
  startDate: string;
  insuranceSum: string;
  meritRating: string;
  damageInsurance: string;
  optionalProducts: string[];
  courtesyCar: string;
}

export interface SendQuoteData {
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  comments?: string;
}

export interface QuoteFormData {
  vehicle: VehicleData;
  insurant: InsurantData;
  product: ProductData;
  priceOption: string;
  sendQuote: SendQuoteData;
}

export function makeVehicleData(type: VehicleType = 'automobile'): VehicleData {
  let makes: readonly string[] = AUTOMOBILE_MAKES;
  if (type === 'truck') makes = TRUCK_MAKES;
  else if (type === 'motorcycle') makes = MOTORCYCLE_MAKES;
  else if (type === 'camper') makes = CAMPER_MAKES;

  const make = randomItem(makes);

  // Field availability per Tricentis's idealforms config:
  //   automobile: NO Model, NO Cylinder Capacity, NO Payload/Total Weight, NO Right Hand Drive
  //   truck: NO Model, NO Cylinder Capacity (KEEPS Payload, Total Weight)
  //   motorcycle: KEEPS Model, Cylinder Capacity (NO NumberOfSeats, NO FuelType, NO LicensePlate, NO Payload/TotalWeight)
  //   camper: NO Model, NO Cylinder Capacity (KEEPS Payload, Total Weight)
  const isMotorcycle = type === 'motorcycle';
  const seats = isMotorcycle ? randomItem(MOTORCYCLE_SEATS) : randomItem(['4', '5']);
  const base: VehicleData = {
    type,
    make,
    model: 'Scooter', // Only used for motorcycle (others lack the field)
    cylinderCapacity: randomInt(800, 2500),
    enginePerformance: randomInt(50, 200),
    dateOfManufacture: randomPastDate(8),
    numberOfSeats: seats,
    fuelType: randomItem(['Petrol', 'Diesel']),
    listPrice: randomInt(5000, 100000),
    licensePlateNumber: randomLicensePlate(),
    annualMileage: randomInt(100, 100000),
  };

  if (type === 'truck' || type === 'camper') {
    base.payload = randomInt(100, 1000);
    base.totalWeight = randomInt(500, 50000);
  }
  return base;
}

export function makeInsurantData(): InsurantData {
  return {
    firstName: randomString(6),
    lastName: randomString(8),
    dateOfBirth: randomDateOfBirth(),
    gender: randomItem(['Male', 'Female']),
    streetAddress: randomStreetAddress(),
    country: randomItem(['United States', 'Germany', 'United Kingdom', 'France', 'Spain']),
    zipCode: randomZip(),
    city: randomCity(),
    occupation: randomItem(OCCUPATIONS),
    hobbies: [randomItem(HOBBIES)],
    website: randomWebsite(),
  };
}

export function makeProductData(type: VehicleType = 'automobile'): ProductData {
  return {
    startDate: randomFutureDate(60),
    insuranceSum: randomItem(INSURANCE_SUMS),
    meritRating: type === 'automobile' ? randomItem(MERIT_RATINGS) : 'Bonus 1',
    damageInsurance: randomItem(DAMAGE_INSURANCE_OPTIONS),
    optionalProducts: [randomItem(OPTIONAL_PRODUCTS)],
    courtesyCar: type === 'automobile' ? randomItem(COURTESY_CAR_OPTIONS) : 'No',
  };
}

export function makeSendQuoteData(): SendQuoteData {
  const password = randomPassword();
  return {
    email: randomEmail(),
    phone: randomPhone(),
    username: randomUsername(),
    password,
    confirmPassword: password,
    comments: randomComments(),
  };
}

export function makeFullQuoteData(type: VehicleType = 'automobile'): QuoteFormData {
  return {
    vehicle: makeVehicleData(type),
    insurant: makeInsurantData(),
    product: makeProductData(type),
    priceOption: randomItem(PRICE_OPTIONS),
    sendQuote: makeSendQuoteData(),
  };
}
