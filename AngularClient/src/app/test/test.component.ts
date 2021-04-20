import { Component, OnInit } from '@angular/core';
import { Test } from '../models/Test';

@Component({
  selector: 'app-tets',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor() { }

  test: Test = new Test();
  viewMode = false;

  ngOnInit(): void {
  }

}
