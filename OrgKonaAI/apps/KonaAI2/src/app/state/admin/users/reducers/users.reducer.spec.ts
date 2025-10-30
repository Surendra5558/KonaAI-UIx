import { reducer, initialState } from '../reducers/users.reducer';

describe('Users Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as never;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
