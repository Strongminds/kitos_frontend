export function getDataProcessingFields() {
  const fields = {
    oversightDates: {
      collection: {},
      oversightDate: {},
      oversightRemark: {},
      oversightReportLink: {
        name: {},
        url: {},
      },
    },
  };
  return getFieldsMap(fields);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FieldNestedMap = Record<string, any>;

function getFieldsMap(obj: FieldNestedMap, prefix?: string): FieldNestedMap {
  const result: FieldNestedMap = {};

  for (const key of Object.keys(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && Object.keys(obj[key]).length > 0) {
      result[key] = getFieldsMap(obj[key], fullPath);
    } else {
      result[key] = fullPath;
    }
  }

  return result;
}
