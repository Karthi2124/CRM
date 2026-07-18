import { convertToCsv } from '../../src/utils/csv.helper';
import { AppError } from '../../src/utils/error.helper';

describe('Unit Tests: Helpers', () => {
  describe('CSV Serializer Helper', () => {
    it('should return empty string for empty array input', () => {
      expect(convertToCsv([])).toBe('');
    });

    it('should convert flat object array to valid CSV string', () => {
      const data = [
        { id: 1, name: 'Alice', role: 'Admin' },
        { id: 2, name: 'Bob', role: 'User' },
      ];
      const result = convertToCsv(data);
      const lines = result.split('\r\n');
      expect(lines[0]).toBe('id,name,role');
      expect(lines[1]).toBe('1,Alice,Admin');
      expect(lines[2]).toBe('2,Bob,User');
    });

    it('should escape CSV values containing commas and quotes correctly', () => {
      const data = [
        { name: 'Smith, John', quote: 'He said "Hello"' },
      ];
      const result = convertToCsv(data);
      const lines = result.split('\r\n');
      expect(lines[0]).toBe('name,quote');
      expect(lines[1]).toBe('"Smith, John","He said ""Hello"""');
    });
  });

  describe('AppError Utility', () => {
    it('should create an instance with correct statusCode and message', () => {
      const error = new AppError('Resource not found', 404);
      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
    });
  });
});
