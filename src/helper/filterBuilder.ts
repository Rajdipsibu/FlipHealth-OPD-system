import { Op } from 'sequelize';

export const buildWhereClause = (
  query: any,
  allowedFields: string[] = [],
  searchFields: string[] = []
) => {
  const where: any = { is_deleted: false };

  // 1. Handle explicit 'is_deleted' override
  if (query.is_deleted !== undefined) {
    where.is_deleted = query.is_deleted === 'true';
  }
//like operator in sequelize. -> phone;

  // 2. Loop through allowed fields for exact matches
  allowedFields.forEach((field) => {
    if (query[field] !== undefined) {
      if (query[field] === 'null') {
        where[field] = { [Op.is]: null };
      } else {
        where[field] = query[field];
      }
    }
  });

  // 3. Handle Global Search across multiple columns
  if (query.search && searchFields.length > 0) {
    where[Op.or] = searchFields.map((field) => ({
      [field]: { [Op.like]: `%${query.search}%` }
    }));
  }

  return where;
};