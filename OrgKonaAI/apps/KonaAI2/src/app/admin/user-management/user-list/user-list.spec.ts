// user-list.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UserList } from './user-list'; // your standalone component
import { selectAll } from '../../../state/admin/users/reducers/users.reducer'; // adjust path

describe('UserList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserList],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAll, value: [{ id: 1, name: 'Alice', email: 'a@a.com' }] }
          ],
        }),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UserList);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  });
});
