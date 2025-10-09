type NestedMap = Record<string, any>;

export class FieldPermissionsService {
  static hasPermission(fieldPermissions: { [key: string]: boolean } | undefined, field: string): boolean {
    return fieldPermissions ? !!fieldPermissions[field] : false;
  }

  static getFieldsMap(obj: NestedMap, prefix?: string): NestedMap {
    const result: NestedMap = {};

    for (const key of Object.keys(obj)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && Object.keys(obj[key]).length > 0) {
        result[key] = this.getFieldsMap(obj[key], fullPath);
      } else {
        result[key] = fullPath;
      }
    }

    return result;
  }
}
