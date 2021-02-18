import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDirective } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  validatingForm: FormGroup;

  get subscriptionFormModalName() {
    return this.validatingForm.get('subscriptionFormModalName');
  }

  get subscriptionFormModalEmail() {
    return this.validatingForm.get('subscriptionFormModalEmail');
  }

  @ViewChild('frame') public frame: ModalDirective;



  ngOnInit() {


    this.validatingForm = new FormGroup({
      subscriptionFormModalName: new FormControl('', Validators.required),
      subscriptionFormModalEmail: new FormControl('', Validators.email)
    });

  }

}
