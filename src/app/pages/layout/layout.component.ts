import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private toastr: ToastrService, private router: Router, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  onLogOut() {
    this.confirmationService.confirm({
      message: 'Are you sure that you wan to log out?',
      accept: () => {
        localStorage.removeItem('username');
        this.toastr.success('Logged Out Successfully');
        this.router.navigateByUrl('login');
      }
    });
  }

}
