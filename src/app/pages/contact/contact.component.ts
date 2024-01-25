import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactList: contactObject[] = [];
  filteredContactList: contactObject[] = [];
  contactObj: contactObject = new contactObject();
  displayModalContact: boolean;
  favoriteContacts: contactObject[] = [];
  searchTxt: string = '';
  emailPattern: string;
  phonePattern: string;

  constructor(private toastr: ToastrService, private confirm: ConfirmationService) {
    this.displayModalContact = false;
    this.emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
    this.phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";
  }

  ngOnInit(): void {
    this.getAllContact();
    const favoriteContactsData = localStorage.getItem('favoriteContacts');
    this.favoriteContacts = favoriteContactsData ? JSON.parse(favoriteContactsData) : [];
    console.log(this.favoriteContacts);
  }

  openContactModal() {
    this.displayModalContact = true;
    this.onReset();
  }

  onSaveContact() {
    const isData = localStorage.getItem('localContacts');
    if (isData == null) {
      this.contactObj.id = 1;
      const newArr = [];
      newArr.push(this.contactObj);
      localStorage.setItem('localContacts', JSON.stringify(newArr));
      this.onReset();
      this.displayModalContact = false;
    } else {
      const oldData = JSON.parse(isData);
      const newId = oldData.length + 1;
      this.contactObj.id = newId;
      oldData.push(this.contactObj);
      localStorage.setItem('localContacts', JSON.stringify(oldData));
      this.onReset();
      this.displayModalContact = false;
    }
    this.toastr.success('Contact Created Successfully!!');
    this.getAllContact();
  }

  getAllContact() {
    const isData = localStorage.getItem('localContacts');
    if (isData != null) {
      const localData = JSON.parse(isData);
      this.contactList = localData.map((contact: any) => ({ ...contact, isFavorite: false }));
      this.filteredContactList = localData.map((contact: any) => ({ ...contact, isFavorite: false }));
    }
  }

  onUpdateContact() {
    const isData = localStorage.getItem('localContacts');
    if (isData != null) {
      const localData = JSON.parse(isData);
      this.contactList = localData;
      const record = localData.find((m: any) => m.id == this.contactObj.id);
      record.firstName = this.contactObj.firstName;
      record.lastName = this.contactObj.lastName;
      record.email = this.contactObj.email;
      record.password = this.contactObj.password;
      record.confirmPassword = this.contactObj.confirmPassword;
      record.phoneNo = this.contactObj.phoneNo;
      record.address = this.contactObj.address;
      record.isFavorite = this.contactObj.isFavorite;
      localStorage.setItem('localContacts', JSON.stringify(localData));
    }
    this.displayModalContact = false;
    this.getAllContact();
    this.toastr.success('Contact Updated Successfully!!');
  }

  onEdit(item: contactObject) {
    this.openContactModal();
    this.contactObj = item;
  }

  onDelete(item: contactObject) {
    this.confirm.confirm({
      message: 'Are you sure that you want delete this record?',
      accept: () => {
        const isData = localStorage.getItem('localContacts');
        if (isData != null) {
          const localData = JSON.parse(isData);
          for (let i = 0; i < localData.length; i++) {
            if (localData[i].id == item.id) {
              localData.splice(i, 1);
            }
          }
          localStorage.setItem('localContacts', JSON.stringify(localData));
          this.toastr.error('Contact Deleted Successfully!!');
          this.getAllContact();
        }
      }
    });
  }

  onReset() {
    this.contactObj = new contactObject();
  }

  onCancel() {
    this.onReset();
    this.displayModalContact = false;
  }

  addToFavorite(contact: contactObject) {
    const copiedContact = JSON.parse(JSON.stringify(contact));
    const index = this.favoriteContacts.findIndex(c => c.id === copiedContact.id);
    if (index === -1) {
      this.favoriteContacts.push(copiedContact);
      copiedContact.starColor = 'gold';
    } else {
      this.favoriteContacts.splice(index, 1);
      copiedContact.starColor = 'black';
    }
    const originalIndex = this.filteredContactList.findIndex(c => c.id === copiedContact.id);
    if (originalIndex !== -1) {
      this.filteredContactList[originalIndex].isFavorite = !this.filteredContactList[originalIndex].isFavorite;
      this.filteredContactList[originalIndex].starColor = copiedContact.starColor;
    }
    localStorage.setItem('localContacts', JSON.stringify(this.contactList));
    localStorage.setItem('favoriteContacts', JSON.stringify(this.favoriteContacts));
  }


  removeFromFavorites(contact: contactObject) {
    const index = this.favoriteContacts.findIndex(c => c.id === contact.id);
    if (index !== -1) {
      this.favoriteContacts.splice(index, 1);
      const originalIndex = this.filteredContactList.findIndex(c => c.id === contact.id);
      if (originalIndex !== -1) {
        this.filteredContactList[originalIndex].starColor = 'black';
      }
    }
    localStorage.setItem('favoriteContacts', JSON.stringify(this.favoriteContacts));
    localStorage.setItem('localContacts', JSON.stringify(this.contactList));
  }

  searchContactData() {
    this.filteredContactList = this.contactList.filter((contact: any) =>
      Object.values(contact).some((value: any) =>
        value.toString().toLowerCase().includes(this.searchTxt.toLowerCase())
      )
    );
  }

}

export class contactObject {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNo: string;
  address: string;
  isFavorite: boolean;
  starColor: string;

  constructor() {
    this.id = 0;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.phoneNo = '';
    this.address = '';
    this.isFavorite = false;
    this.starColor = 'black';
  }
}
