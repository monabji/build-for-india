import type { Authority } from '../domain/types'

type CentreSeed = [state: string, district: string, longitude: number, latitude: number]

const centreSeeds: CentreSeed[] = [
  ['Andaman and Nicobar Islands', 'South Andaman', 92.7265, 11.6234],
  ['Andhra Pradesh', 'Guntur', 80.6480, 16.3067],
  ['Arunachal Pradesh', 'Papum Pare', 93.6053, 27.0844],
  ['Assam', 'Kamrup Metropolitan', 91.7362, 26.1445],
  ['Bihar', 'Patna', 85.1376, 25.5941],
  ['Chandigarh', 'Chandigarh', 76.7794, 30.7333],
  ['Chhattisgarh', 'Raipur', 81.6296, 21.2514],
  ['Dadra and Nagar Haveli and Daman and Diu', 'Daman', 72.8328, 20.3974],
  ['Delhi', 'Central Delhi', 77.2090, 28.6139],
  ['Goa', 'North Goa', 73.8278, 15.4909],
  ['Gujarat', 'Ahmedabad', 72.5714, 23.0225],
  ['Haryana', 'Gurugram', 77.0266, 28.4595],
  ['Himachal Pradesh', 'Shimla', 77.1734, 31.1048],
  ['Jammu and Kashmir', 'Srinagar', 74.7973, 34.0837],
  ['Jharkhand', 'Ranchi', 85.3096, 23.3441],
  ['Karnataka', 'Bengaluru Urban', 77.5946, 12.9716],
  ['Kerala', 'Thiruvananthapuram', 76.9366, 8.5241],
  ['Ladakh', 'Leh', 77.5770, 34.1526],
  ['Lakshadweep', 'Kavaratti', 72.6420, 10.5593],
  ['Madhya Pradesh', 'Bhopal', 77.4126, 23.2599],
  ['Maharashtra', 'Mumbai', 72.8777, 19.0760],
  ['Manipur', 'Imphal West', 93.9368, 24.8170],
  ['Meghalaya', 'East Khasi Hills', 91.8933, 25.5788],
  ['Mizoram', 'Aizawl', 92.7176, 23.7271],
  ['Nagaland', 'Kohima', 94.1086, 25.6751],
  ['Odisha', 'Khordha', 85.8245, 20.2961],
  ['Puducherry', 'Puducherry', 79.8083, 11.9416],
  ['Punjab', 'Ludhiana', 75.8573, 30.9010],
  ['Rajasthan', 'Jaipur', 75.7873, 26.9124],
  ['Sikkim', 'Gangtok', 88.6138, 27.3389],
  ['Tamil Nadu', 'Chennai', 80.2707, 13.0827],
  ['Telangana', 'Hyderabad', 78.4867, 17.3850],
  ['Tripura', 'West Tripura', 91.2868, 23.8315],
  ['Uttar Pradesh', 'Lucknow', 80.9462, 26.8467],
  ['Uttarakhand', 'Dehradun', 78.0322, 30.3165],
  ['West Bengal', 'Kolkata', 88.3639, 22.5726],
]

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const stateNames = centreSeeds.map(([state]) => state)

export const authorities: Authority[] = centreSeeds.map(([state, district, longitude, latitude]) => ({
  id: `centre-${slug(state)}`,
  name: `${district} assessment and service centre`,
  district,
  state,
  address: `District Citizen Services Campus, ${district}`,
  accessNotes: 'Step-free entrance, accessible waiting area and assisted-service support on request.',
  contactLabel: 'Synthetic centre details — confirm official information before visiting.',
  hours: 'Monday–Friday, 10:00 AM–5:00 PM',
  coordinates: [longitude, latitude],
}))

export const centresByState = (state: string) => authorities.filter((authority) => authority.state === state)

