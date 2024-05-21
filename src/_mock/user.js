import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const users = [...Array(24)].map((_, index) => ({
  id: faker.string.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.person.fullName(),
  company: faker.company.name(),
  isVerified: faker.datatype.boolean(),
  status: sample(['active', 'banned']),
  role: sample([
    'General Practitioner',
    'Nurse Practitioner',
    'Medical Laboratory Technician',
    'Radiologic Technologist',
    'Pharmacist',
    'Physical Therapist',
    'Biomedical Engineer',
    'Health Information Technician',
    'Occupational Therapist',
    'Public Health Administrator',
  ]),
}));
