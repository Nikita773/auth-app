import { MockDataItem } from '../models/mock-api.model';

export function generateMockData(count = 2000): MockDataItem[] {
  return Array.from({ length: count }).map((_: unknown, index: number) => ({
    id: index + 1,
    name: `Name ${index + 1}`,
    email: `user${index + 1}@mail.com`,
    phone: `+380000000${String(index + 1).padStart(4, '0')}`,
    status: index % 2 === 0 ? 'Active' : 'Inactive',
  }));
}
