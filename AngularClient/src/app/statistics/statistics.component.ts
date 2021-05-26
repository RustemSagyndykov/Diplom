import { Component, OnInit } from '@angular/core';
import { timestamp } from 'rxjs/operators';
import { StatisticService } from '../shared/statisticService/statistic.service';
import { Chart } from '../models/Chart';
import { UserRole } from '../models/Roles';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  role;
  userRoles = UserRole;
  single: any[];
  view: any[] = [700, 400];
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'right';
  legendTitle: string = 'Сводка';
  animations: boolean = true;
  cardColor: string = '#232837';
  statisticList = [];

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#C50331', '#a8385d', '#7aa3e5', '#CFC0BB']
  };
  
  constructor(private service: StatisticService) {}

  ngOnInit(){
    this.role = this.getUserRole();
    this.getAll();
  }

  getUserRole(){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userRole = payLoad.role;
    return userRole;
  }

  getAll(){
    if(this.role == this.userRoles.Student){
      this.service.getForStudent().subscribe((res:Chart[])=>{
        this.statisticList = res;
      });
    }else if(this.role == this.userRoles.Teacher){
      this.service.getForTeacher().subscribe((res:Chart[])=>{
        this.statisticList = res;
      });
    }else{
      this.service.getForAdmin().subscribe((res:Chart[])=>{
        this.statisticList = res;
      });
    }
  }

}