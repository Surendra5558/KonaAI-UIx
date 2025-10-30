import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeletePopupComponent, DeletePopupData, DeletePopupResult } from '../shared/components/delete-popup/delete-popup.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

type Status = 'Active' | 'Inactive' | 'Invited' | 'Re-Invite';

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  role: string;
  status: Status;
  projectName?: string;
}

interface LoginCredential {
  id: number;
  userName: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  category?: string;
}

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule, DeletePopupComponent, HttpClientModule],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {
  modalMode: 'add' | 'edit' = 'add';
  showModal = false;
  showUsersPopup = false;
  showDeletePopup = false;
  searchTerm: string = '';
  deleteData: DeletePopupData = {
    title: 'Delete Member',
    message: 'Are you sure you want to delete',
    itemName: '',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  };
  members: Member[] = [];

  allStatuses: Status[] = ['Active', 'Inactive', 'Invited', 'Re-Invite'];
  allRoles: string[] = ['Super Admin', 'Investigator', 'Data Manager', 'L3 Reviewer', 'Client Admin', 'L1 User', 'L2 User', 'Instance Admin', 'Guest'];
  statusDropdownOpen = false;
  roleDropdownOpen = false;
  selectedStatuses = new Set<Status>(this.allStatuses);
  selectedRoles = new Set<string>(this.allRoles);
  roleSearch = '';
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  pageIndex = 0;
  draft: Partial<Member> = {};
  selectedMember: Member | null = null;
  usersFromAssets: Array<{ id: number; firstName: string; lastName: string; fullName: string; email: string; role: string; investigatorLevel?: string }> = [];
  selectedUserEmails = new Set<string>();
  userInvestigatorLevels = new Map<string, string>(); // email -> level (L1/L2)
  private readonly MEMBERS_STORAGE_KEY = 'membersData';
  projectName: string = 'Default Project';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('Component initialized, loading members...');
    // Initialize with default members first to prevent empty state
    this.initializeWithDefaultMembers();
    // Then try to load from session or assets
    this.loadMembersFromSessionOrSeed();
  }

  // Disable ESC closing when add/edit modal is open
  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: Event) {
    if (this.showModal || this.showUsersPopup || this.showDeletePopup) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  // ------------------ Role Display Helpers ------------------
  getDisplayRole(m: Member): string {
    if (m.role?.startsWith('Investigator')) return 'Investigator';
    if (m.role === 'Data Manager') return 'Data Manager';
    if (m.role === 'Client Admin') return 'Client Admin';
    return m.role || '';
  }

  getInvestigatorLevelFromRole(role: string): 'L1' | 'L2' | undefined {
    if (!role) return undefined;
    const match = /Investigator\((L1|L2)\)/.exec(role);
    return (match ? (match[1] as 'L1' | 'L2') : undefined);
  }

  // ------------------ SessionStorage Helpers ------------------
  private readSession(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private writeSession(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch {}
  }

  private loadMembersFromSessionOrSeed() {
    console.log('Loading members from session or seed...');
    const raw = this.readSession(this.MEMBERS_STORAGE_KEY);
    console.log('Raw session data:', raw);
    
    if (raw) {
      try {
        const sessionMembers = JSON.parse(raw) as Member[];
        if (sessionMembers && sessionMembers.length > 0) {
          this.members = sessionMembers;
          console.log('Loaded members from session:', this.members);
        } else {
          console.log('Session data is empty, keeping default members');
        }
      } catch (e) {
        console.error('Error parsing session data:', e);
        console.log('Session data corrupted, keeping default members');
      }
    } else {
      console.log('No session data found, keeping default members');
      // Optional: Load from assets to sync with latest data, but don't override if empty
      this.http.get<Member[]>('assets/repository/members/members.json').subscribe({
        next: (data) => { 
          if (Array.isArray(data) && data.length > 0) {
            this.members = data;
            console.log('Updated members from assets:', this.members);
            this.saveMembersToSession();
          }
        },
        error: (err) => { 
          console.error('Error loading from assets:', err);
          console.log('Assets load failed, keeping default members');
        }
      });
    }
  
    // Ensure all roles from members are in allRoles and selectedRoles
    this.members.forEach(m => {
      if (!this.allRoles.includes(m.role)) this.allRoles.push(m.role);
      this.selectedRoles.add(m.role);
    });
  
    // Ensure all statuses from members are in allStatuses and selectedStatuses
    this.members.forEach(m => {
      if (!this.allStatuses.includes(m.status)) this.allStatuses.push(m.status);
      this.selectedStatuses.add(m.status);
    });
  
    this.saveMembersToSession();
    console.log('Final members array:', this.members);
  }
  

  private saveMembersToSession() {
    console.log('Saving members to session:', this.members);
    this.writeSession(this.MEMBERS_STORAGE_KEY, JSON.stringify(this.members));
    console.log('Session storage after save:', this.readSession(this.MEMBERS_STORAGE_KEY));
  }

  private initializeWithDefaultMembers() {
    console.log('Initializing with default members...');
    // Set default members from the JSON data
    this.members = [
      {
        id: 1,
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice.johnson@example.com",
        phoneCode: "+1",
        phoneNumber: "5551234567",
        role: "Investigator(L1)",
        status: "Active",
        projectName: "Default Project"
      },
      {
        id: 2,
        firstName: "Bob",
        lastName: "Singh",
        email: "bob.singh@example.com",
        phoneCode: "+91",
        phoneNumber: "9876543210",
        role: "Data Manager",
        status: "Active",
        projectName: "Default Project"
      }
    ];
    console.log('Initialized with default members:', this.members);
    this.saveMembersToSession();
  }

  // ------------------ Filtering & Pagination ------------------
  filteredMembers(): Member[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.members.filter(m => {
      const byStatus = this.selectedStatuses.has(m.status);
      const byRole = this.selectedRoles.has(m.role);
      const matchesSearch = !term ||
        m.firstName.toLowerCase().includes(term) ||
        m.lastName.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        m.role.toLowerCase().includes(term) ||
        m.status.toLowerCase().includes(term);
      return byStatus && byRole && matchesSearch;
    });
  }

  pagedMembers(): Member[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredMembers().slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredMembers().length / this.pageSize));
  }

  setPageSize(size: number) {
    this.pageSize = size;
    this.pageIndex = 0;
  }

  prevPage() { if (this.pageIndex > 0) this.pageIndex--; }
  nextPage() { if (this.pageIndex < this.totalPages - 1) this.pageIndex++; }
  goToPage(i: number) { if (i >= 0 && i < this.totalPages) this.pageIndex = i; }
  private resetToFirstPage() { this.pageIndex = 0; }

  // ------------------ Dropdowns ------------------
  toggleStatusDd() { this.statusDropdownOpen = !this.statusDropdownOpen; if (this.statusDropdownOpen) this.roleDropdownOpen = false; }
  toggleRoleDd() { this.roleDropdownOpen = !this.roleDropdownOpen; if (this.roleDropdownOpen) this.statusDropdownOpen = false; }

  isStatusChecked(s: Status) { return this.selectedStatuses.has(s); }
  isRoleChecked(r: string) {
    if (this.roleSearch.trim()) {
      const q = this.roleSearch.toLowerCase();
      if (!r.toLowerCase().includes(q)) return false;
    }
    return this.selectedRoles.has(r);
  }

  onStatusChange(s: Status, ev: Event) {
    const checked = (ev.target as HTMLInputElement).checked;
    checked ? this.selectedStatuses.add(s) : this.selectedStatuses.delete(s);
    this.resetToFirstPage();
  }

  onRoleFilterChange(r: string, ev: Event) {
    const checked = (ev.target as HTMLInputElement).checked;
    checked ? this.selectedRoles.add(r) : this.selectedRoles.delete(r);
    this.resetToFirstPage();
  }

  clearRoleSearch() { this.roleSearch = ''; }
  closeDropdowns() { this.statusDropdownOpen = this.roleDropdownOpen = false; }

  // ------------------ Add/Edit/Delete ------------------
  openAdd() {
    const currentUrl = this.router.url;
    console.log('Add Member clicked - Current URL:', currentUrl);
    
    // Check if we're in Projects tab (projects/members) or Organisation tab (organisation/members)
    if (currentUrl.includes('/projects/members')) {
      // Projects tab: Show users from login_credentials.json filtered by category
      console.log('Projects tab detected - showing filtered users popup');
      this.selectedUserEmails.clear();
      this.loadUsersFromAssetsForProjects();
      this.showUsersPopup = true;
    } else if (currentUrl.includes('/organisation/members')) {
      // Organisation tab: Show direct member addition modal
      console.log('Organisation tab detected - showing direct member modal');
      this.modalMode = 'add';
      this.draft = {
        firstName: '',
        lastName: '',
        email: '',
        phoneCode: '+91',
        phoneNumber: '',
        role: '',
        status: 'Invited'
      };
      this.showModal = true;
    } else {
      // Default behavior (fallback to direct modal)
      console.log('Default context - showing direct member modal');
      this.modalMode = 'add';
      this.draft = {
        firstName: '',
        lastName: '',
        email: '',
        phoneCode: '+91',
        phoneNumber: '',
        role: '',
        status: 'Invited'
      };
      this.showModal = true;
    }
    this.closeDropdowns();
  }

  openAddFromUsers() {
    this.selectedUserEmails.clear();
    this.loadUsersFromAssets();
    this.showUsersPopup = true;
    this.closeDropdowns();
  }

  openEdit(m: Member) {
    this.selectedMember = m;
    this.draft = { ...m };
    this.modalMode = 'edit';
  this.showModal = true;
    this.closeDropdowns();
  }

  closeAllModals() {
    this.showModal = false;
    this.showDeletePopup = false;
    this.showUsersPopup = false;
    this.selectedMember = null;
    this.draft = {};
  }
  closeUsersPopup() {
    this.showUsersPopup = false;
  }

  openDelete(member: Member) {
    this.selectedMember = member;
    this.deleteData = {
      ...this.deleteData,
      itemName: `${member.firstName} ${member.lastName}`
    };
    this.showDeletePopup = true;
  }

  handleDeleteResult(result: DeletePopupResult) {
    this.showDeletePopup = false;
    if (result.confirmed && this.selectedMember) {
      this.members = this.members.filter(m => m.id !== this.selectedMember!.id);
      this.saveMembersToSession();
      this.selectedMember = null;
      this.resetToFirstPage();
    }
  }

  confirmDelete() {
    if (!this.selectedMember) return;
    this.members = this.members.filter(m => m.id !== this.selectedMember!.id);
    this.saveMembersToSession();
    this.closeAllModals();
    this.resetToFirstPage();
  }

  saveMember() {
    // Basic validation
    if (!this.draft.firstName || !this.draft.lastName || !this.draft.email || !this.draft.role || !this.draft.status) {
      alert('Please fill in all required fields (First Name, Last Name, Email, Role, and Status).');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.draft.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Check for duplicate email
    const existingMember = this.members.find(m => m.email.toLowerCase() === this.draft.email!.toLowerCase() && m.id !== this.selectedMember?.id);
    if (existingMember) {
      alert('A member with this email address already exists.');
      return;
    }

    if (this.modalMode === 'add') {
      const nextId = this.members.length ? Math.max(...this.members.map(m => m.id)) + 1 : 1;
      this.members.unshift({
        id: nextId,
        firstName: this.draft.firstName || '',
        lastName: this.draft.lastName || '',
        email: this.draft.email || '',
        phoneCode: this.draft.phoneCode || '+91',
        phoneNumber: this.draft.phoneNumber || '',
        role: this.draft.role || 'User',
        status: (this.draft.status as Status) || 'Invited',
        projectName: this.projectName
      });
    } else if (this.modalMode === 'edit' && this.selectedMember) {
      const idx = this.members.findIndex(m => m.id === this.selectedMember!.id);
      if (idx > -1) {
        this.members[idx] = {
          ...this.members[idx],
          firstName: this.draft.firstName || this.members[idx].firstName,
          lastName: this.draft.lastName || this.members[idx].lastName,
          email: this.draft.email || this.members[idx].email,
          phoneCode: this.draft.phoneCode || this.members[idx].phoneCode,
          phoneNumber: this.draft.phoneNumber || this.members[idx].phoneNumber,
          role: this.draft.role || this.members[idx].role,
          status: (this.draft.status as Status) || this.members[idx].status,
          projectName: this.projectName
        };
      }
    }

    this.saveMembersToSession();
    this.closeAllModals();
  }
  
  // ------------------ Users from assets ------------------
  private loadUsersFromAssets() {
    const currentEmail = this.authService.currentUserValue?.userName?.toLowerCase() || '';
    this.http.get<LoginCredential[]>('assets/repository/login_details_folder/login_credentials.json')
      .subscribe((creds) => {
        const memberEmails = new Set(this.members.map(m => m.email.toLowerCase()));
        const filtered = creds.filter(c => c.userName.toLowerCase() !== currentEmail && !memberEmails.has(c.userName.toLowerCase()));
        this.usersFromAssets = filtered.map(c => ({
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          fullName: `${c.firstName} ${c.lastName}`.trim(),
          email: c.userName,
          role: this.mapRoleFromCategory(c.category, c.role),
          investigatorLevel: this.inferInvestigatorLevel(c.category, c.role)
        }));
      });
  }

  private loadUsersFromAssetsForProjects() {
    const currentEmail = this.authService.currentUserValue?.userName?.toLowerCase() || '';
    this.http.get<LoginCredential[]>('assets/repository/login_details_folder/login_credentials.json')
      .subscribe((creds) => {
        const memberEmails = new Set(this.members.map(m => m.email.toLowerCase()));
        // Filter by category: Data, Investigator, Admin
        const allowedCategories = ['Data', 'Investigator', 'Admin'];
        const filtered = creds.filter(c => 
          c.userName.toLowerCase() !== currentEmail && 
          !memberEmails.has(c.userName.toLowerCase()) &&
          c.category && 
          allowedCategories.includes(c.category)
        );
        this.usersFromAssets = filtered.map(c => ({
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          fullName: `${c.firstName} ${c.lastName}`.trim(),
          email: c.userName,
          role: this.mapRoleFromCategory(c.category, c.role),
          investigatorLevel: this.inferInvestigatorLevel(c.category, c.role)
        }));
        console.log('Filtered users for Projects tab:', this.usersFromAssets);
      });
  }

  private mapRoleFromCategory(category?: string, fallbackRole?: string): string {
    const normalized = (category || '').trim().toLowerCase();
    switch (normalized) {
      case 'data':
      case 'data manager':
        return 'Data Manager';
      case 'client admin':
        return 'Client Admin';
      case 'investigator':
        return 'Investigator';
      default:
        return fallbackRole || 'User';
    }
  }

  private inferInvestigatorLevel(category?: string, roleLabel?: string): 'L1' | 'L2' | undefined {
    const normalizedCategory = (category || '').trim().toLowerCase();
    if (normalizedCategory !== 'investigator') return undefined;
    const normalizedRole = (roleLabel || '').toLowerCase();
    if (normalizedRole.includes('l2')) return 'L2';
    return 'L1';
  }

  // ------------------ Role Management (Read-only for users popup) ------------------
  
  getDisplayRoleForUser(user: any): string {
    if (user.role?.startsWith('Investigator')) return 'Investigator';
    return user.role || '';
  }

  getInvestigatorLevelFromUserRole(role: string): 'L1' | 'L2' | undefined {
    if (!role) return undefined;
    const match = /Investigator\((L1|L2)\)/.exec(role);
    return (match ? (match[1] as 'L1' | 'L2') : 'L1'); // Default to L1 if no level specified
  }

  // ------------------ Users from assets ------------------
  onUserCheckboxChange(email: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    checked ? this.selectedUserEmails.add(email) : this.selectedUserEmails.delete(email);
  }

  isAllUsersSelected(): boolean {
    return this.usersFromAssets.length > 0 && this.usersFromAssets.every(u => this.selectedUserEmails.has(u.email));
  }

  toggleSelectAllUsers(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.usersFromAssets.forEach(u => this.selectedUserEmails.add(u.email));
    } else {
      this.selectedUserEmails.clear();
    }
  }

  grantAccessToSelectedUsers() {
    if (this.selectedUserEmails.size === 0) return;

    const selected = this.usersFromAssets.filter(u => this.selectedUserEmails.has(u.email));
    const existingEmails = new Set(this.members.map(m => m.email.toLowerCase()));
    let nextId = this.members.length ? Math.max(...this.members.map(m => m.id)) + 1 : 1;
    const newMembers: Member[] = [];

    console.log('Selected users:', selected);

    for (const u of selected) {
      if (existingEmails.has(u.email.toLowerCase())) continue;

      // Ensure role is added to allRoles and selectedRoles for filtering
      if (!this.allRoles.includes(u.role)) {
        this.allRoles = [...this.allRoles, u.role];
        this.selectedRoles.add(u.role);
      }

      // Use role as-is since it's read-only
      let finalRole = u.role || 'User';

      const newMember = {
        id: nextId++,
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        email: u.email,
        phoneCode: '+91',
        phoneNumber: '',
        role: finalRole,
        status: 'Active' as Status,
        projectName: this.projectName
      };

      newMembers.push(newMember);
      console.log('Added member:', newMember);
    }

    if (newMembers.length > 0) {
      this.members = [...newMembers, ...this.members];
      this.pageIndex = 0;
      this.saveMembersToSession();
      console.log('Updated members array:', this.members);
      
      // Force a change detection cycle
      setTimeout(() => {
        console.log('Members after timeout:', this.members);
      }, 100);
    } else {
      console.log('No new members to add');
    }

    this.selectedUserEmails.clear();
    this.loadUsersFromAssets();
    this.showUsersPopup = false;
  }

  // ------------------ UI Helper Methods ------------------
  getUsersModalTitle(): string {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/projects/members')) {
      return 'Add Members';
    }
    return 'Select Users';
  }

  // ------------------ Debug Methods ------------------
  refreshMembersData() {
    console.log('Manually refreshing members data...');
    this.loadMembersFromSessionOrSeed();
  }

  checkSessionStorage() {
    const raw = this.readSession(this.MEMBERS_STORAGE_KEY);
    console.log('Current session storage:', raw);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        console.log('Parsed session data:', parsed);
      } catch (e) {
        console.error('Error parsing session data:', e);
      }
    }
  }

  // ------------------ Inline SVG Icons ------------------
  get editSvg() { return 'M3 12.5l9-9 3.5 3.5-9 9H3v-3.5z M2 16h12v2H2z'; }
  get trashSvg() { return 'M3 6h10l-1 10H4L3 6zm2-2h6l1 2H4l1-2z'; }
  get redoSvg() { return 'M12 5v3H8l4 4 4-4h-4V5h-2zM4 19v-2h12v2H4z'; }
  get chevSvg() { return 'M6 9l4 4 4-4'; }
}
