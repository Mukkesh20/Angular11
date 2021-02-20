import gql from 'graphql-tag';
import { AssetData } from './../assetData';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';

import { Apollo } from 'apollo-angular';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit, OnInit {
  editMode = false;
  idToUpdate;
  totalInvested = 0;
  totalValue = 0;
  validatingForm: FormGroup;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  editField: string;
  personList: Array<any> = [];
  data: AssetData[] = [];
  resp: any = {};
  isLoadingResults = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('frame') public frame: ModalDirective;

  get modalName() {
    return this.validatingForm.get('modalName');
  }

  get modalInvested() {
    return this.validatingForm.get('modalInvested');
  }

  get modalValue() {
    return this.validatingForm.get('modalValue');
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getTotalCost() {
    return ELEMENT_DATA.map(t => t.weight).reduce((acc, value) => acc + value, 0);
  }

  constructor(private apollo: Apollo) {
  }


  ngOnInit() {
    this.validatingForm = new FormGroup({
      modalName: new FormControl('', Validators.required),
      modalInvested: new FormControl('', Validators.required),
      modalValue: new FormControl('', Validators.required)
    });

    this.apollo.query({
      query: gql `{ AssetDatas { _id, type, name, invested, value } }`
    }).subscribe(res => {
      this.resp = res;
      this.data = this.resp.data.books;
      console.log(this.data);
      this.isLoadingResults = false;
    });
  }



  updateList(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
    this.personList[id][property] = this.editField;
  }

  updateList1(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
    ELEMENT_DATA[id][property] = this.editField;
  }

  changeValue1(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  remove(id: any) {
    this.personList.splice(id, 1);
  }

  getTotalInvestedAmount() {
    return this.personList.map(t => t.invested).reduce((acc, value) => acc + value, 0);
  }

  getTotalValue() {
    return this.personList.map(t => t.value).reduce((acc, value) => acc + value, 0);
  }

  getProfitLoss() {
    return (this.getTotalValue() - this.getTotalInvestedAmount());
  }

  getProfitLossPercent() {
    return ((this.getTotalValue() - this.getTotalInvestedAmount()) * 100 / this.getTotalInvestedAmount()).toFixed(2) + ' %';
  }

  update(id: any) {
    this.editMode = true;
    this.idToUpdate = id;
    console.log(this.idToUpdate);
    this.frame.show();
    this.validatingForm.setValue({
      modalName: this.personList[this.idToUpdate].name,
       modalInvested: this.personList[this.idToUpdate].invested,
       modalValue: this.personList[this.idToUpdate].value
      });
  }

  updateData() {

    console.log(this.idToUpdate);
    const newData = this.personList.map(el => {
      if (el.id === this.idToUpdate + 1) {
        return Object.assign({}, el, {
          id: this.idToUpdate,
          name: this.modalName.value,
          invested: this.modalInvested.value,
          value: this.modalValue.value
        });
      }
      return el;
    });
    this.personList = newData;
    this.frame.hide();
    this.validatingForm.reset();
    console.log(this.personList);

  }

  addNewData(){
    this.editMode = false;
    this.validatingForm.reset();
    this.frame.show();
  }

  addData() {
    let person;
    if(this.personList.length === 0){
       person = { id: 1, name: this.modalName.value, invested: this.modalInvested.value, value: this.modalValue.value };
    }else{
       person = {
         id: this.personList[this.personList.length - 1]['id'] + 1,
         name: this.modalName.value,
         invested: this.modalInvested.value,
         value: this.modalValue.value
        };
    }
    this.personList.push(person);
    this.frame.hide();
    this.validatingForm.reset();
    console.log(this.personList);
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }





}
