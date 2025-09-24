import { z } from 'zod';

const requiredString = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, { message: `${fieldName} is required` });

const requiredCoordinate = (fieldName: string, min: number, max: number) =>
  z
    .coerce
    .number()
    .refine((value) => Number.isFinite(value), `${fieldName} is required`)
    .refine(
      (value) => value >= min && value <= max,
      `${fieldName} must be between ${min} and ${max}`,
    );

export const activitySchema = z.object({
  title: requiredString('Title'),
  description: requiredString('Description'),
  category: requiredString('Category'),
  date: z.coerce
    .date({ message: 'Date is required' })
    .refine((value) => value.getTime() > Date.now(), 'Date must be in the future'),
  location: z.object({
    venue: requiredString('Venue'),
    city: requiredString('City'),
    latitude: requiredCoordinate('Latitude', -90, 90),
    longitude: requiredCoordinate('Longitude', -180, 180),
  }),
});

export type ActivitySchema = z.infer<typeof activitySchema>;
