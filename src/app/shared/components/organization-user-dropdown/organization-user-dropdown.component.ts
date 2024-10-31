import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrganizationUserDropdownComponentStore } from './organization-user-dropdown.component-store';
import { APIOrganizationUserResponseDTO } from 'src/app/api/v2';

@Component({
  selector: 'app-organization-user-dropdown',
  templateUrl: './organization-user-dropdown.component.html',
  styleUrl: './organization-user-dropdown.component.scss',
  providers: [OrganizationUserDropdownComponentStore],
})
export class OrganizationUserDropdownComponent {

  @Input() public text: string | undefined;

  @Output() public userChange = new EventEmitter<APIOrganizationUserResponseDTO>();

  constructor(private componentStore: OrganizationUserDropdownComponentStore) {}

  public readonly users$ = this.componentStore.users$;
  public readonly usersIsLoading$ = this.componentStore.usersIsLoading$;

  public searchUsers(search?: string) {
    this.componentStore.searchUsersInOrganization(search);
  }

  public onUserChange(user: APIOrganizationUserResponseDTO) {
    this.userChange.emit(user);
  }
}
